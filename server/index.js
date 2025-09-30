const express = require('express');
const cors = require('cors');
const http = require('http');

const app = express();
const port = 3001;

app.use(cors());
app.use(express.json());

// Proxy /predict to the local ML API server (FastAPI) running on port 8000.
app.post('/predict', async (req, res) => {
    try {
        const data = JSON.stringify(req.body);
        const options = {
            hostname: '127.0.0.1',
            port: 8000,
            path: '/predict',
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Content-Length': Buffer.byteLength(data)
            }
        };

        const proxyReq = http.request(options, (proxyRes) => {
            let body = '';
            proxyRes.on('data', (chunk) => { body += chunk.toString(); });
            proxyRes.on('end', () => {
                try {
                    const parsed = JSON.parse(body);
                    res.status(proxyRes.statusCode || 200).json(parsed);
                } catch (e) {
                    res.status(500).json({ error: 'Invalid JSON from ML server', details: body });
                }
            });
        });

        proxyReq.on('error', (err) => {
            res.status(500).json({ error: 'Could not connect to ML service', details: err.message });
        });

        proxyReq.write(data);
        proxyReq.end();
    } catch (e) {
        res.status(500).json({ error: 'Internal server error', details: e.message });
    }
});

app.listen(port, () => {
    console.log(`Server listening at http://localhost:${port}`);
});