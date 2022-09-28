const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function(app) {
  app.use(
    '/expandopedia',
    createProxyMiddleware({
      target: 'https://saas-dev.expandopedia.com',
      changeOrigin: true,
    })
  );
};

// const proxy = require('http-proxy-middleware');

// module.exports = function(app) {
//   app.use(proxy('qa/user/', {
//     target: 'https://subscribed-qa.expandopedia.com/',
//     changeOrigin: true
//   }))
// };
