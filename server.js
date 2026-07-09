const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path');

// Load environment variables from .env file
dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());

// Health check route
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

// Query route (proxies to Lightning AI remote model)
app.post('/api/query', async (req, res) => {
    const start = performance.now();
    const question = req.body.question?.trim() || "";
    
    const aiModelUrl = process.env.ai_model;
    
    if (!aiModelUrl) {
        return res.json({
            answer: "Error: 'ai_model' URL not configured in .env",
            sources: [],
            latency_ms: Math.round(performance.now() - start)
        });
    }

    try {
        const queryUrl = aiModelUrl.replace(/\/+$/, '') + '/query';
        const response = await fetch(queryUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ question }),
            // Fetch timeout implementation:
            signal: AbortSignal.timeout(300000) // 5 minutes
        });

        if (response.ok) {
            const data = await response.json();
            const answer = data.answer || JSON.stringify(data);
            res.json({
                answer,
                sources: [],
                latency_ms: Math.round(performance.now() - start)
            });
        } else {
            const text = await response.text();
            res.json({
                answer: `Remote API Error (Status ${response.status}): ${text}`,
                sources: [],
                latency_ms: Math.round(performance.now() - start)
            });
        }
    } catch (error) {
        res.json({
            answer: `Failed to connect to remote AI model: ${error.message}`,
            sources: [],
            latency_ms: Math.round(performance.now() - start)
        });
    }
});

// Serve frontend build static files
const frontendDist = path.join(__dirname, 'frontend', 'dist');
app.use(express.static(frontendDist));

// Catch-all route to serve React index.html for client-side routing
app.use((req, res) => {
    res.sendFile(path.join(frontendDist, 'index.html'), (err) => {
        if (err) {
            res.status(500).send("Frontend not built yet. Run 'npm run build' in the frontend directory.");
        }
    });
});

app.listen(PORT, () => {
    console.log(`Express server running on http://localhost:${PORT}`);
});
