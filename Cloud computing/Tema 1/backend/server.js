let http = require('http');
const fetch = require("node-fetch");

const TMDB_API_KEY = 'b9eea36dbe1f2d463637b320a5f2043a';
const DEEZER_URL = 'https://api.deezer.com/search';
const TMDB_URL = 'https://api.themoviedb.org/3/search/multi';
const PORT = 3001;

http.createServer(async (req, res) => {
    let time = {};
    const query = req.url.replace('/', '');
    let queryStart = new Date().getTime();
    const response = await fetch(`${TMDB_URL}?api_key=${TMDB_API_KEY}&query=${query}`);
    const jsonResponse = await response.json();
    queryStart = new Date().getTime() - queryStart;
    time.firstQuery = queryStart;

    queryStart = new Date().getTime();
    const response2 = await fetch(`${DEEZER_URL}?q=${query}`);
    const jsonResponse2 = await response2.json();
    queryStart = new Date().getTime() - queryStart;
    time.secondQuery = queryStart;

    let resArray = [time, jsonResponse, jsonResponse2];
    res.setHeader('Content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
    if ( req.method === 'OPTIONS' ) {
        res.writeHead(200);
        res.end();
        return;
    }
    res.write(JSON.stringify(resArray));

    res.end();
}).listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});
