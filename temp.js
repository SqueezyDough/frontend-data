
    data.getNodes().then( (dataset) => {
        let nodes = dataset.map( (item, index) => {
            let nodeList = [item.tm.value, item.obj.value];

            let node = {};
            nodeList.forEach( nodeItem => {


                node.id = nodeItem;
                node.label = item.tmLabel.value;
                node.predicate = item.pred.value
                node.obj = item.obj.value;

                //console.log(item.obj.value);

            })

            console.log(nodeList);

            //console.log(node);

            return node;
        });


        let links = dataset.map( (item, index) => {
            let link = {};

            link.source = item.tm.value;
            link.target = item.obj.value;

            return link;
        });

        //console.log(links)

        app.drawGraph(nodes, links);
    })
