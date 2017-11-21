/*
    Remove all children from node
 */
function emptyNode(node) {
    while(node.firstChild) {
        node.removeChild(node.firstChild);
    }
}

module.exports = {
    emptyNode
}
