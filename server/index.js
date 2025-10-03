import express from 'express';
import { WebSocketServer } from 'ws';
import cors from 'cors';
import { mockUnityProject } from './mockUnityProject.js';
import { executeAIOperation } from './aiEngine.js';

const app = express();
const PORT = 3535;

app.use(cors());
app.use(express.json());

const sessions = new Map();
const logs = new Map();

const server = app.listen(PORT, () => {
  console.log(`🚀 Shunya server running on http://localhost:${PORT}`);
});

const wss = new WebSocketServer({ server });

const clients = new Set();

wss.on('connection', (ws) => {
  console.log('Client connected');
  clients.add(ws);

  ws.send(JSON.stringify({
    type: 'connected',
    message: 'Connected to Shunya AI Engine'
  }));

  ws.on('message', async (message) => {
    const data = JSON.parse(message.toString());
    console.log('Received:', data);

    if (data.type === 'execute') {
      await handleExecution(data.payload, ws);
    }
  });

  ws.on('close', () => {
    console.log('Client disconnected');
    clients.delete(ws);
  });
});

async function handleExecution(payload, ws) {
  const sessionId = `session_${Date.now()}`;

  sessions.set(sessionId, {
    id: sessionId,
    request: payload.message,
    status: 'running',
    created_at: new Date().toISOString()
  });

  broadcast({
    type: 'session_started',
    sessionId,
    message: payload.message
  });

  await executeAIOperation(payload.message, sessionId, broadcast, logStep);

  const session = sessions.get(sessionId);
  session.status = 'completed';
  session.completed_at = new Date().toISOString();

  broadcast({
    type: 'session_completed',
    sessionId
  });
}

function logStep(sessionId, step, status, details) {
  if (!logs.has(sessionId)) {
    logs.set(sessionId, []);
  }

  const log = {
    session_id: sessionId,
    step,
    status,
    details,
    created_at: new Date().toISOString()
  };

  logs.get(sessionId).push(log);
}

function broadcast(data) {
  const message = JSON.stringify(data);
  clients.forEach(client => {
    if (client.readyState === 1) {
      client.send(message);
    }
  });
}

app.get('/api/project', (req, res) => {
  res.json(mockUnityProject);
});

app.get('/api/sessions', (req, res) => {
  const sessionList = Array.from(sessions.values())
    .sort((a, b) => new Date(b.created_at) - new Date(a.created_at))
    .slice(0, 50);

  res.json(sessionList);
});

app.get('/api/logs/:sessionId', (req, res) => {
  const sessionLogs = logs.get(req.params.sessionId) || [];
  res.json(sessionLogs);
});

console.log('✨ Shunya Studio initialized');
