/*
    Remove all children from node
 */
function emptyNode(node) {
    while(node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

function toggleClass(element, cls) {
    if (element.classList.contains(cls)) {
        element.classList.remove(cls);
    } else {
        element.classList.add(cls);
    }
}

module.exports = {
    emptyNode
}
