// src/setupProxy.js
const { createProxyMiddleware } = require('http-proxy-middleware');

module.exports = function (app) {
  app.use(
    '/api',
    createProxyMiddleware({
      target: 'https://admin.elmodafoods.com', // جرّب https أولاً
      changeOrigin: true,
      secure: false,          // لو شهادة الـSSL مش كاملة/Self-signed
      logLevel: 'silent',
      // عدم إعادة توجيه OPTIONS؛ دعها تمر للـ upstream بدون 301/302
      onProxyReq: (proxyReq, req) => {
        if (req.method === 'OPTIONS') {
          // لا تعمل أي تعديل يؤدي لRedirect
        }
      },
      // منع أي redirect يرجع من السيرفر (احتياطيًا)
      onProxyRes: (proxyRes, req, res) => {
        const code = proxyRes.statusCode || 0;
        if (req.method === 'OPTIONS' && (code === 301 || code === 302 || code === 307 || code === 308)) {
          // خليك حذر: الـpreflight لازم يرجع 204/200 مع رؤوس CORS، مش Redirect
        }
      },
      pathRewrite: { '^/api': '/api' },
    })
  );
};
