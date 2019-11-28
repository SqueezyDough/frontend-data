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
        .on('click', d => {
            update(nodes, links, d)
            nodeInfo.html(`<span class="node-info__label">${d.label}</span> <a class="node-info__link" href=${d.id} target=__blank>${d.id}</a>`)
                    .style("display", "block")
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

    // create circles for each node
    createCircles(node);

    function createCircles(node) {
        const circles = node.append("circle")
        .attr("r", function(d) {
            if (d.type === "node") {
                return 10;
            } else {
                return 6;
            }
        })
        .attr("class", d => `type-${d.type}`)
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

        return circles;
    }

    // simulation
    const simulation = d3.forceSimulation()
        .force("link", d3.forceLink().id(d => d.id).distance(20).strength(0.5))
        .force("charge", d3.forceManyBody())
        .force("center", d3.forceCenter(width / 2, height / 2))

    simulation
        .nodes(nodes)
        .on("tick", ticked);

    simulation.force("link")
        .links(links);

    // save first init
    const allNodes = simulation.nodes();
    const allLinks = simulation.force("link").links();

    d3.select(".reset-nodes")
        .on('click', () => {
            update(allNodes, allLinks)
            nodeInfo.html(``)
                    .style("display", "none")
        })

    // update nodes and links
    function update(nodes, links, sourceNode) {
        const originalNodes = allNodes;
        const originalLinks = allLinks;

        // -> true if user clicked on a node
        if (sourceNode) {
            // update pattern: https://livebook.manning.com/book/d3js-in-action-second-edition/chapter-7/142
            const centerNode = originalNodes.filter(d => d.id === sourceNode.id)
            links = originalLinks.filter(d =>
                centerNode.includes(d.source) ||
                centerNode.includes(d.target))

            nodes = links.map(d => {
                return originalNodes.filter(item =>
                    d.source.id.includes(item.id) ||
                    d.target.id.includes(item.id))
            }).flat()

            // remove dups: https://dev.to/marinamosti/removing-duplicates-in-an-array-of-objects-in-js-with-sets-3fep
            nodes = nodes.reduce((acc, current) => {
                const x = acc.find(item => item.id === current.id);
                if (!x) {
                return acc.concat([current]);
                } else {
                return acc;
                }
            }, []);
        // -> default
        } else {
            nodes = originalNodes;
            links = originalLinks;
        }

        d3.select(".network").select(".nodes").selectAll(".node")
            .data(nodes)
            .join( enter => {
                const nodeEnter = enter.append("g").attr("class","node")

                // node events
                .on('click', function(d){
                    update(nodes, links, d)
                    nodeInfo.html(`<span class="node-info__label">${d.label}</span> <a class="node-info__link" href=${d.id} target=__blank>${d.id}</a>`)
                            .style("display", "block")
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
                }).attr("transform", function(d) {
                    return "translate(" + d.x + "," + d.y + ")";
                });

                // node circles
                nodeEnter.append("circle")
                .attr("r", function(d) {
                    if (d.type === "node") {
                        return 10;
                    } else {
                        return 6;
                    }
                })
                .attr("class", d => `type-${d.type}`)
                .call(d3.drag()
                    .on("start", dragstarted)
                    .on("drag", dragged)
                    .on("end", dragended));
            },
            update => {
                update.select("circle").attr("r", function(d) {
                    if (d.type === "node") {
                        return 10;
                    } else {
                        return 6;
                    }
            }).attr("class", d => `type-${d.type}`)
            .call(d3.drag()
                .on("start", dragstarted)
                .on("drag", dragged)
                .on("end", dragended))
        })

        d3.select(".network").select(".links").selectAll(".link")
            .data(links)
            .join( enter => {
                enter.append("line")
                    .attr("class","link")
                    .attr("x1", function(d) { return d.source.x; })
                    .attr("y1", function(d) { return d.source.y; })
                    .attr("x2", function(d) { return d.target.x; })
                    .attr("y2", function(d) { return d.target.y; });
            },
            update => {
                update.select(".link")
                .attr("x1", function(d) {
                    return d.source.x;
                })
                .attr("y1", function(d) { return d.source.y; })
                .attr("x2", function(d) { return d.target.x; })
                .attr("y2", function(d) { return d.target.y; });
            })
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

    //Zoom functions
    function zoom_actions() {
        network.attr("transform", d3.event.transform)
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
