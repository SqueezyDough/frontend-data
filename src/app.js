export { drawGraph }
import * as data from "../src/data.js";
import * as utils from "../src/utils.js";

// edit from example: http://bl.ocks.org/jose187/4733747
function drawGraph(nodes, links) {
    let svg = d3.select("svg"),
        width = +svg.attr("width"),
        height = +svg.attr("height");

    // zoom fuctionality: https://bl.ocks.org/puzzler10/4438752bb93f45dc5ad5214efaa12e4a
    let zoom_handler = d3.zoom()
        .on("zoom", zoom_actions);

    zoom_handler(svg);

    let network = svg.append("g")
               .attr("class", "network");

    // nodes
    let nodesGroup = network
        .append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodes)

    nodesGroup.exit().remove();

    let node = nodesGroup.enter()
                         .append("g").attr("class","node");

    createCircles(node);
    createLabels(node);

    nodesGroup = nodesGroup.merge(node);


    // links
    let link = createLinks(network, links)


    let simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(20).strength(0.5))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(links);

    function createLinks(container, data) {
        let link = container.append("g")
                            .attr("class", "links")
                            .selectAll("line")
                            .data(data)
                            .enter().append("line")

        return link;
    }

    function createLabels(node) {

        node.append("text")
            .attr('font-family',"Inconsolata")
            .attr('fill',"rgba(255,255,255,0.6)")
            .attr('x', 10)
            .attr('y', 3)
            .text(function(d) {
                if (d.type === "node") {
                    return d.label;
                }
            })

        node.append("id")
            .text(function(d) { return d.id; });

        return node;

    }

    function createCircles(node) {
        let circles = node.append("circle")
        .attr("r", function(d) {
            if (d.type === "node") {
                return 7;
            } else {
                return 4;
            }
        })
        .attr("class", function(d){ return `type-${d.type}`})
        .on("click", update)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        return circles;
    }

    function update() {
        simulation.stop();

        let originalNodes = simulation.nodes()
        let originalLinks = simulation.force("link").links()

        let centerNode = originalNodes.filter(d => d.id === "https://hdl.handle.net/20.500.11840/termmaster2712")
        let nodeLinks = originalLinks.filter(d =>
            centerNode.includes(d.source) ||
            centerNode.includes(d.target))

        let targetNodes = nodeLinks.map(d => {
            return originalNodes.filter(item =>
                d.source.id.includes(item.id) ||
                d.target.id.includes(item.id))
        }).flat()

        d3.selectAll(".node")
            .data(targetNodes, d => d.id)
            .exit()
            .transition()
            .duration(300)
            .remove()

        d3.selectAll(".links line")
            .data(nodeLinks, d => `${d.source.id}-${d.target.id}`)
            .exit()
            .transition()
            .duration(300)
            .style("opacity", 0)
            .remove()

        simulation
            .nodes(originalNodes)
        simulation.force("link")
            .links(nodeLinks)
        simulation.alpha(1)
        simulation.restart()

    }

    //Zoom functions
    function zoom_actions() {
        network.attr("transform", d3.event.transform)
    }

    function ticked() {
        link
            .attr("x1", function(d) { return d.source.x; })
            .attr("y1", function(d) { return d.source.y; })
            .attr("x2", function(d) { return d.target.x; })
            .attr("y2", function(d) { return d.target.y; });

        node
            .attr("transform", function(d) {
                return "translate(" + d.x + "," + d.y + ")";
            })
    }

    function dragstarted(d) {
        if (!d3.event.active) simulation.alphaTarget(0.3).restart();
        d.fx = d.x;
        d.fy = d.y;
    }

    function dragged(d) {
        d.fx = d3.event.x;
        d.fy = d3.event.y;
    }

    function dragended(d) {
        if (!d3.event.active) simulation.alphaTarget(0);
        d.fx = null;
        d.fy = null;
    }
}
