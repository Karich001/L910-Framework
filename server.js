const r52 = require("./drugstore");

const fs = require('fs');
const url = require('url');
const http = require('http');

class App {
    constructor() {
        this.routes = { GET: {}, POST: {}, PUT: {}, PATCH: {}, DELETE: {} };
        this.middlewares = [];
        this.errorHandler = null;
    }

    get(path, handler) { this.routes.GET[path] = handler; }
    post(path, handler) { this.routes.POST[path] = handler; }
    put(path, handler) { this.routes.PUT[path] = handler; }
    patch(path, handler) { this.routes.PATCH[path] = handler; }
    delete(path, handler) { this.routes.DELETE[path] = handler; }

    use(mw) { this.middlewares.push(mw); }
    setErrorHandler(handler) { this.errorHandler = handler; }

    matchRoute(routes, pathname) {
        for (const [routePath, handler] of Object.entries(routes)) {
            const routeParts = routePath.split('/');
            const pathParts = pathname.split('/');

            if (routeParts.length !== pathParts.length) continue;

            let params = {};
            let matched = true;

            for (let i = 0; i < routeParts.length; i++) {
                if (routeParts[i].startsWith(':')) {
                    const paramName = routeParts[i].slice(1);
                    params[paramName] = pathParts[i];
                } else if (routeParts[i] !== pathParts[i]) {
                    matched = false;
                    break;
                }
            }

            if (matched) {
                return { handler, params };
            }
        }
        return null;
    }

    listen(port, callback) {
        const server = http.createServer((req, res) => {
            res.status = (code) => { res.statusCode = code; return res; };
            res.send = (data) => res.end(data);
            res.json = (obj) => {
                res.setHeader('Content-Type', 'application/json; charset=utf-8');
                res.end(JSON.stringify(obj));
            };

            const parsedUrl = url.parse(req.url, true);
            req.query = parsedUrl.query;
            req.body = null;

            let body = '';
            req.on('data', chunk => body += chunk);
            req.on('end', () => {
                if (body) {
                    try { req.body = JSON.parse(body); }
                    catch { req.body = body; }
                } else {req.body = {};}

                let i = 0;
                const next = (err) => {
                    if (err && this.errorHandler) return this.errorHandler(err, req, res);
                    if (i < this.middlewares.length) return this.middlewares[i++](req, res, next);

                    const reqMethod = this.routes[req.method];
                    const match = this.matchRoute(reqMethod, parsedUrl.pathname);

                    if (match) {
                        req.params = match.params;
                        try {
                            match.handler(req, res);
                        } catch (error) {
                            if (this.errorHandler) this.errorHandler(error, req, res);
                            else res.status(500).send('Server Error');
                        }
                    } else {
                        res.status(404).send('Not Found');
                    }
                };
                next();
            });
        });

        server.listen(port, callback);
    }
}

const app = new App();

app.get('/', (req, res) => {
    res.send('enjebado');
});

r52(app);

app.listen(3000, () => {
    console.log('Сервер слушает порт 3000');
});