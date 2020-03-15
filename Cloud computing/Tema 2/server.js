let http = require('http');
let router = require('./router.js');
let requests = require('./requests.js');

const PORT = 3000;

http.createServer(async (req, res) => {
    setHeaders(res)
    if (req.method === 'OPTIONS') {
        res.writeHead(200);
        res.end();
        return;
    }
    if(req.headers['content-type'] !== 'application/json'){
        res.writeHead(403);
        res.write(JSON.stringify({error: `The client did not have permission to access the requested resource.`}));
        res.end();
        return;
    }
    const route = router(req.url);
    console.log()
    if(route === -1){
        res.writeHead(404);
        res.write(JSON.stringify({error: `Endpoint doesn't exist`}));
        res.end();
        return;
    } else {
        requests({req, res, route})
    }
}).listen(PORT, () => {
    console.log(`Server running at http://127.0.0.1:${PORT}/`);
});


const setHeaders = (res) => {
    res.setHeader('Content-type', 'application/json');
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Request-Method', '*');
    res.setHeader('Access-Control-Allow-Methods', 'OPTIONS, GET');
    res.setHeader('Access-Control-Allow-Headers', '*');
}
