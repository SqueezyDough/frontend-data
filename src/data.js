export { getNodes, getLinks }

function getNodes () {
    const url ="https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-34/sparql";

    const query = `
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX edm: <http://www.europeana.eu/schemas/edm/>
    PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    PREFIX gn: <http://www.geonames.org/ontology#>
    SELECT ?tm ?tmLabel WHERE {
      <https://hdl.handle.net/20.500.11840/termmaster2802> skos:narrower* ?tm .
      ?tm skos:prefLabel ?tmLabel .
    } ORDER BY ?tmLabel
    `

    return runQuery(url, query);
}

function getLinks () {
    const url ="https://api.data.netwerkdigitaalerfgoed.nl/datasets/ivo/NMVW/services/NMVW-34/sparql";

    const query = `
    PREFIX dc: <http://purl.org/dc/elements/1.1/>
    PREFIX dct: <http://purl.org/dc/terms/>
    PREFIX skos: <http://www.w3.org/2004/02/skos/core#>
    PREFIX edm: <http://www.europeana.eu/schemas/edm/>
    PREFIX wgs84: <http://www.w3.org/2003/01/geo/wgs84_pos#>
    PREFIX gn: <http://www.geonames.org/ontology#>
    SELECT ?tm ?tmLabel ?pred ?obj WHERE {
    VALUES ?pred { skos:narrower }
    <https://hdl.handle.net/20.500.11840/termmaster2802> skos:narrower* ?tm .
    ?tm skos:prefLabel ?tmLabel .
    ?tm ?pred ?obj .
    } ORDER BY ?tm
    `

    return runQuery(url, query);
}

// run the query
function runQuery(url, query) {
    return fetch(url+"?query="+ encodeURIComponent(query) +"&format=json")
    .then(res => res.json())
    .then(json => {
        return json.results.bindings;
    });
}