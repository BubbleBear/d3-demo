const fs = require('fs');
const http = require('http');
const { resolve, extname } = require('path');

const root = resolve(__dirname, '../');

const server = http.createServer()
    .on('request', (req, res) => {
        const path = req.url.replace(/^[\/\\]*/, '');
        router[path](req, res);
    })
    .listen(process.argv[2] || 8888);

const CONTENT_TYPES = {
    '.html': 'text/html',
    '.js': 'application/javascript',
};

function respond(path) {
    return (req, res) => {
        console.log('path: ', path);
        const ext = extname(path);
        CONTENT_TYPES[ext] && res.writeHead(200, { 'Content-Type': CONTENT_TYPES[ext] });
        fs.createReadStream(path).on('error', err => {
            res.end(err.message);
        }).pipe(res);
    }
}

const router = new Proxy({
    '': respond(resolve(root, 'index.html')),
}, {
    get: (_, path) => {
        if (Reflect.ownKeys(_).includes(path)) {
            return _[path];
        }
        return respond(resolve(root, path));
    }
})
