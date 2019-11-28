## NMVW RDF Explorer
The NMVW database is quite complex in nature. It relational basis is structured in triples, which means that an item has a relation with a subject, a predicate and an object. I want to visualise the complexity of this database to create a better understanding of its complex structure for both new and well-trained users.

### Target Audience
#### Use case for new users
As previously mentioned the database structure is quite complex. Therefore, creating the right sparql query can be difficult, because the underlying levels are both abstract and complex. Visualising this can help to create a better understanding of the database for new users. 

#### Use case for well-trained users
The database has been released recently by NVMW. The NVMW has acknowledged that there are still some bugs that need to be squashed. A visualisation might help to detect bugs and/or create a better understanding of its nature.

A RDF Structure visualisation from [source](https://s3.amazonaws.com/dev.assets.neo4j.com/wp-content/uploads/20180227014448/neo4j-rdf-graph-database-reasoning-engine.png).

#### Graph type
A network diagram seems to be the best candidate to visualise this data structure. A network diagram is used to show how objects are connected to each other. An object is presented as a node. The node can be connected with multiple other nodes and can be grouped together to form dedicated clusters. 

![Prototype](https://github.com/SqueezyDough/frontend-data/blob/master/github/network.png)

#### Interaction
* Click own a node will only show all connections to that node.
* Hover on node shows tooltip with details and link.

## Install

