// server.js
const express = require('express');
const { createProxyMiddleware } = require('http-proxy-middleware');
const cors = require('cors');

const app = express();
const PORT = 3001;

// Replace this with your actual API key
const API_KEY = 'sk-proj-d8yo58aisIZRkn6ey2yGT3BlbkFJbjI3ZRrbNg0mstwlNW3G';

// Use CORS to handle cross-origin requests
app.use(cors());

// Set up proxy middleware with API key in headers
app.use('/api', createProxyMiddleware({
    target: 'http://127.0.0.1:8000',
    changeOrigin: true,
    pathRewrite: {
        '^/api': '/api',
    },
    onProxyReq: (proxyReq, req, res) => {
        // Add custom header to request
        proxyReq.setHeader('Authorization', `Bearer ${API_KEY}`);
    },
}));

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});

app.get('/api/test', (req, res) => {
    res.send('Test successful');
  });