'use strict';

const puppeteer = require('puppeteer');

const { logAppend } = require('./libs-nodejs/logAppend');
const { createLiElement } = require('./libs-nodejs/createLiElement');

const { removeElement } = require('./libs-browser/removeElement');

const myArgs = process.argv.slice(2);

// const logDirPath = './log/';

const SEC = 1000;
const MIN = 60 * SEC;
const HOUR = 60 * MIN;

const options = {
    args: ['--start-maximized'],
    headless: false,
    // executablePath: '/usr/bin/google-chrome',
    ignoreDefaultArgs: ['--enable-automation'],
    defaultViewport: null
};

switch (myArgs.length) {
    case 1:
        const url = myArgs[0].toLowerCase();

        (async() => {
            const browser = await puppeteer.launch(options);
            const [page] = await browser.pages();
            page.on('load', () => console.log('Page loaded: ' + page.url()));
            await page.setDefaultNavigationTimeout(0);
            await page.goto(url, { waitUntil: ['networkidle0', 'domcontentloaded'] });

            // Create and initialize the log html file with <head> and first part of <body>
            logAppend(`<html xmlns="http://www.w3.org/1999/xhtml" lang="en">` +
                `<head>` +
                `<meta charset="utf-8">` +
                `<title>DOM Changes Logger</title>` +
                `<link rel="stylesheet">` +
                `</head>` +
                `<body>` +
                `<div style="position: relative; overflow: hidden; background-color: black;">` +
                `<ul style="font-size: 12px; line-height: 19.56px; width: 100%; margin: 0; padding: 5px 0; font-family: Arial; overflow: visible; box-sizing: border-box; max-height: 100%">`);

            // Declare and expose the logger function to the browser
            await page.exposeFunction('logger', (iconName, xpath, oldValue, newValue) => logAppend(createLiElement(iconName, xpath, oldValue, newValue)));

            while (true) {
                await page.addScriptTag({ path: 'libs-browser/chrome-dompath-browserified.js' });
                await page.$eval('body', element => {
                    const DOMPath = require('chrome-dompath');
                    const observer = new MutationObserver(mutationsList => {
                        for (const mutation of mutationsList) {
                            let type = mutation.type;
                            let fullPath = DOMPath.xPath(mutation.target, true);
                            switch (type) {
                                case 'childList':
                                    const listAddedNodes = mutation.addedNodes;
                                    if (listAddedNodes.length > 0) {
                                        for (const added of listAddedNodes) {
                                            logger("addedNode.svg", fullPath, null, added.outerHTML);
                                        }
                                    }
                                    const listRemovedNodes = mutation.removedNodes;
                                    if (listRemovedNodes.length > 0) {
                                        for (const removed of listRemovedNodes) {
                                            logger("removedNode.svg", fullPath, removed.outerHTML, null);
                                        }
                                    }
                                    break;
                                case 'attributes':
                                    const name = mutation.attributeName;
                                    const oldValue = mutation.oldValue;
                                    const newValue = mutation.target.getAttribute(name);
                                    if (oldValue && newValue) {
                                        logger("changedAttribute.svg", fullPath, `[${name}="${oldValue}"]`, `[${name}="${newValue}"]`);
                                    }
                                    if (oldValue && !newValue) {
                                        logger("removedAttribute.svg", fullPath, `[${name}="${oldValue}"]`, null);
                                    }
                                    if (!oldValue && newValue) {
                                        logger("addedAttribute.svg", fullPath, null, `[${name}="${newValue}"]`);
                                    }
                                    break;
                                case 'characterData':
                                    logger("changedText.svg", fullPath, mutation.oldValue, mutation.target.nodeValue);
                                    break;
                            }
                        }
                    });

                    observer.observe(element, {
                        subtree: true,
                        childList: true,
                        attributes: true,
                        attributeOldValue: true,
                        characterData: true,
                        characterDataOldValue: true
                    });

                });

                await page.waitForTimeout(2 * MIN);
                console.log('Refresh!');
                await page.reload({ waitUntil: ['networkidle0', 'domcontentloaded'] });
            }

            // await browser.close();
        })();

        break;
    default:
        console.log('Url?');
}
