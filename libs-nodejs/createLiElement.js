const HTMLDecoderEncoder = require('html-encoder-decoder');
const { dataOra } = require('./dataOra');

const createLiElement = (iconName, xpath, oldValue, newValue) => {
    let timestamp = dataOra().replace(/T/, ' ');
    // https://github.com/IonicaBizau/html-encoder-decoder
    let oldV = oldValue ? HTMLDecoderEncoder.encode(oldValue) : '';
    let newV = newValue ? HTMLDecoderEncoder.encode(newValue) : '';
    return `<li>` +
        `<div style="display: flex">` +
        `<div style="flex-basis: 37px; flex-shrink: 0; flex-grow: 0; align-self: flex-start">` +
        `<img src="icons/${iconName}" style="width: 20px; height: 20px; display: block; position: relative; transform: translateX(-50%); left: 50%">` +
        `</div>` +
        `<div style="position: relative; margin: 0; width: calc(100% - 55px); white-space: normal; overflow-wrap: break-word; hyphens: none">` +
        `<span style="color: #c3e88d !important">[${timestamp}]</span>` +
        `<span style="color: #2a66a2 !important">${xpath} </span>` +
        `<span style="color: #bf6363 !important">${oldV} </span>` +
        `<span style="color: #db911e !important">${newV} </span>` +
        `</div>` +
        `</div>` +
        `</li>`;
}

module.exports = { createLiElement }
