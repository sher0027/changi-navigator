const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');

const app = express();
const cors = require('cors');
app.use(cors());


app.use('/api', createProxyMiddleware({
  target: 'https://maps.googleapis.com',
  changeOrigin: true,
  pathRewrite: {'^/api' : ''},
  onProxyReq: (proxyReq, req, res) => {
    proxyReq.setHeader('Authorization', `Bearer ${process.env.NEXT_PUBLIC_MAP_KEY}`);
  }
}));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
