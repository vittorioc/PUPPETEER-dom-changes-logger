const removeElement = (sel) => {
    let node = document.querySelector(sel);
    if (node) {
        if (node.parentNode) {
            node.parentNode.removeChild(node)
        }
    }
};
