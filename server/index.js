const fs = require('fs');
const http = require('http');
const { resolve } = require('path');

const root = resolve(__dirname, '../');

const server = http.createServer()
    .on('request', (req, res) => {
        const path = req.url.replace(/^[\/\\]*/, '');
        router[path](req, res);
    })
    .listen(process.argv[2] || 8888);

function respond(path) {
    return (req, res) => {
        console.log('path: ', path);
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
