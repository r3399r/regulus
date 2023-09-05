/* eslint-disable */
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    createProxyMiddleware('/api', {
      target: 'https://yoho-test.celestialstudio.net/',
      changeOrigin: true,
    }),
  );
};
