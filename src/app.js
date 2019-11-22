export { drawGraph }

// edit from example: http://bl.ocks.org/jose187/4733747
function drawGraph(nodes, links) {
    let svg = d3.select("svg"),
    width = +svg.attr("width"),
    height = +svg.attr("height");

    // zoom fuctionality: https://bl.ocks.org/puzzler10/4438752bb93f45dc5ad5214efaa12e4a
    let zoom_handler = d3.zoom()
        .on("zoom", zoom_actions);

    zoom_handler(svg);
    let g = svg.append("g")
               .attr("class", "everything");


    let simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(function(d) { return d.id; }))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))

    let link = g.append("g")
        .attr("class", "links")
        .selectAll("line")
        .data(links)
        .enter().append("line")
        .attr("stroke-width", function(d) { return Math.sqrt(d.value); });

    let node = g.append("g")
        .attr("class", "nodes")
        .selectAll("g")
        .data(nodes)
        .enter().append("g")

    let circles = node.append("circle")
        .attr("r", function(d) {
            if (d.type === "node") {
                return 7;
            } else {
                return 5;
            }
        })

        .attr("class", function(d){ return d.type})
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    let lables = node.append("text")
        .text(function(d) {
            if (d.type === "node") {
                return d.label;
            }
        })
        .attr('font-family',"Inconsolata")
        .attr('fill',"rgba(255,255,255,0.4)")
        .attr('x', 6)
        .attr('y', 3);

    node.append("id")
        .text(function(d) { return d.id; });

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(links);

    //Zoom functions
    function zoom_actions(){
        g.attr("transform", d3.event.transform)
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
