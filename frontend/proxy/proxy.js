const express = require("express");
const { createProxyMiddleware } = require("http-proxy-middleware");

const app = express();

app.use(
  "/",
  createProxyMiddleware({
    // target: "http://backend.cnsof17014913-system.svc:8000",
    target: "http://36.140.31.145:31684",
    changeOrigin: true,
  })
);

// Start the server
app.listen(3000, () => {
  console.log("Proxy server is running on port 3000");
});
