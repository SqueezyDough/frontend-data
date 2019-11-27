export { drawGraph }

// edit from example: http://bl.ocks.org/jose187/4733747
function drawGraph(nodes, links) {
    const svg = d3.select("svg"),
        width = svg.attr("width"),
        height = svg.attr("height");

    // zoom functionality: https://bl.ocks.org/puzzler10/4438752bb93f45dc5ad5214efaa12e4a
    const zoom_handler = d3.zoom()
        .on("zoom", zoom_actions);

    zoom_handler(svg);

    const tooltip = d3.select("body")
        .append("div")
        .attr("class", "tooltip")
        .style("position", "absolute")
        .style("visibility", "hidden")
        .style("z-index", "1")

    const nodeInfo = d3.select("body")
        .append("div")
        .attr("class", "node-info")
        .style("position", "absolute")
        .style("display", "none")
        .style("z-index", "1")

    const network = svg.append("g")
        .attr("class", "network");

    // links
    const link = network.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("class","link")

    // nodes
    const nodesGroup = network
        .append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodes)

    const node = nodesGroup.enter()
        .append("g").attr("class","node")
        .on("click", d => {
            update(d)
            nodeInfo.style("display", "block")
                .text(`${d.label} - ${d.id}`)

        })
        .on("mouseover", d => {
            return tooltip.style("visibility", "visible")
                          .text(d.label)
        })
        .on("mousemove", () => {
            // tt positioning: https://www.d3-graph-gallery.com/graph/interactivity_tooltip.html
            return tooltip.style("top", (event.pageY-10)+"px").style("left",(event.pageX+10)+"px")
        })
        .on("mouseout", () => {
            return tooltip.style("visibility", "hidden")
        });

    createCircles(node);
    //createLabels(node);

    //nodesGroup = nodesGroup.merge(node);

    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }).distance(20).strength(0.5))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(links);

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
        const circles = node.append("circle")
        .attr("r", function(d) {
            if (d.type === "node") {
                return 10;
            } else {
                return 6;
            }
        })

        .attr("class", function(d){ return `type-${d.type}`})
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        return circles;
    }

    function update(sourceNode) {
        simulation.stop();

        const originalNodes = simulation.nodes()
        const originalLinks = simulation.force("link").links()

        // update pattern: https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-7/142
        const centerNode = originalNodes.filter(d => d.id === sourceNode.id)
        const nodeLinks = originalLinks.filter(d =>
            centerNode.includes(d.source) ||
            centerNode.includes(d.target))
        // end

        const targetNodes = nodeLinks.map(d => {
            return originalNodes.filter(item =>
                d.source.id.includes(item.id) ||
                d.target.id.includes(item.id))
        }).flat()

        d3.selectAll(".node")
            .data(targetNodes, d => d.id)
            .exit()
            .transition()
            .duration(500)
            .style("opacity", 0)
            .remove()

        d3.selectAll(".links line")
            .data(nodeLinks, d => `${d.source.id}-${d.target.id}`)
            .exit()
            .transition()
            .duration(400)
            .style("opacity", 0)
            .remove()

            // createLabels(node);

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
