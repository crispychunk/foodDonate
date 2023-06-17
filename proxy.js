import http from "http";
import https from "https";
import pkg from "http-proxy";
const { createProxyServer } = pkg;
import httpProxy from "http-proxy";
import Express from "express";

// Create an instance of the proxy server
const proxy = httpProxy.createProxyServer({});

// Create an Express app
const app = Express();

// Proxy middleware
app.use((req, res) => {
  proxy.web(req, res, { target: req.url, secure: false });
});

// Create the HTTP server
const httpServer = http.createServer(app);

// Create the HTTPS server
const httpsServer = https.createServer(
  {
    // Provide the SSL/TLS certificate and private key paths
    key: fs.readFileSync("/path/to/private/key.pem"),
    cert: fs.readFileSync("/path/to/certificate.pem"),
  },
  app
);

// Start the HTTP server on a specified port
const httpPort = 3000;
httpServer.listen(httpPort, () => {
  console.log(`HTTP proxy server is running on http://localhost:${httpPort}`);
});

// Start the HTTPS server on a specified port
const httpsPort = 4000;
httpsServer.listen(httpsPort, () => {
  console.log(`HTTPS proxy server is running on https://localhost:${httpsPort}`);
});
