# Shunya - AI Unity Development Studio

A functional prototype of an AI-powered Unity development environment with real-time execution visualization.

## What's Been Built

This is a working demo showcasing the complete architecture of Shunya:

### Backend (Node.js + Express + WebSocket)
- Real-time WebSocket server on port 3535
- Mock Unity project parser with realistic Unity data
- AI execution engine that simulates multi-step operations
- Session and log management

### Frontend (React + Vite + Tailwind)
- **Chat Interface** - Natural language interaction with the AI
- **Project Explorer** - Unity-style file tree with scenes, scripts, and prefabs
- **Scene Visualizer** - GameObject hierarchy viewer with component details
- **Execution Log** - Real-time step-by-step operation tracking
- **File Diff Viewer** - Before/after code comparison with syntax highlighting

## Try These Demo Commands

Type these in the chat to see the AI in action:

1. **"Add health bars to all enemies"**
   - Watch it analyze the project
   - Generate new HealthBarUI script
   - Modify Goblin prefab
   - Update all scene instances

2. **"Migrate to new Input System"**
   - Analyzes existing Input.GetAxis usage
   - Creates Input Actions asset
   - Refactors PlayerController.cs
   - Validates compilation

3. **Any other request** - It will generate a generic 4-step execution plan

## Architecture Highlights

- **Real-time WebSocket communication** between frontend and backend
- **Simulated Unity project** with realistic scenes, scripts, and prefabs
- **Multi-step AI execution** with progress tracking
- **File change visualization** showing diffs
- **Unity-inspired dark theme** with professional UI

## Portfolio Value

This demo showcases:
- Full-stack development (React + Node.js)
- Real-time bidirectional communication
- Complex state management
- Professional UI/UX design
- System architecture thinking
- AI orchestration patterns

## Technical Stack

- **Frontend**: React, Vite, Tailwind CSS, Lucide Icons
- **Backend**: Node.js, Express, WebSocket (ws)
- **Real-time**: WebSocket for live updates
- **Build**: Vite for fast development and optimized production builds

## Next Steps for Production

To make this production-ready:
1. Add actual Unity Editor C# plugin
2. Integrate real LLM APIs (OpenAI/Anthropic)
3. Implement Git operations
4. Add file system watching
5. Create test validation
6. Add authentication
7. Database persistence with Supabase

---

Built as a portfolio demonstration of modern full-stack development with AI integration.
