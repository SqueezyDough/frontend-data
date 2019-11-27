export { searchNode,
         findReferences,
         arrayIncludes,
         createLinksList,
         createNodes,
         createLinksFromNode,
         getTmNodes,
         getObjNodes }

function searchNode (nodeId, array) {
    let index = array.findIndex(id => id == nodeId)
    return array[index];
}

function findReferences (nodeId, linksList) {
     return linksList.filter( item => nodeId === item.tm.value)
}

function arrayIncludes(string, array) {
    return array.some( testString => string.includes(testString))
}

function createLinksList (array) {
    if (array) {
        return array.map( item => {
            let link = {};

            link.source = item.tm.value;
            link.predicate = item.pred.value;
            link.target = item.obj.value;

            return link;
        });
    }
}

function getTmNodes(linksList) {
    return linksList.map (item => item.tm.value)
}

function getObjNodes(linksList) {
    return linksList.map (item => item.obj.value)
}

function createNodes(nodesList, tmNodes) {
    let nodes = nodesList.map( item => {
        let node = {};

        node.id = item.tm.value;
        node.label = item.tmLabel.value;

        if (arrayIncludes(node.id, tmNodes)) {
            node.type = "node";
        } else {
            node.type = "leaf"
        }

        return node;
    });

    return nodes
}

function createLinksFromNode(tmNodes, linksList) {
    let targetNode = searchNode("https://hdl.handle.net/20.500.11840/termmaster2710", tmNodes);
    let directReferences = findReferences(targetNode, linksList);

    let childReferences = directReferences.map( ref => {
        return findReferences(ref.obj.value, linksList)
    })

    childReferences = childReferences.flat();
    let allReferences = directReferences.concat(childReferences);

    return allReferences;
}