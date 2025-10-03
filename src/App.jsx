import { useState, useEffect } from 'react';
import Header from './components/Header';
import ChatInterface from './components/ChatInterface';
import ProjectExplorer from './components/ProjectExplorer';
import SceneVisualizer from './components/SceneVisualizer';
import ExecutionLog from './components/ExecutionLog';
import FileDiffViewer from './components/FileDiffViewer';
import { useWebSocket } from './hooks/useWebSocket';

function App() {
  const [unityProject, setUnityProject] = useState(null);
  const [activeView, setActiveView] = useState('scene');
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: 'Welcome to Shunya, your AI-powered Unity development assistant. Describe what you want to build or modify, and I\'ll handle the implementation.'
    }
  ]);
  const [executionLogs, setExecutionLogs] = useState([]);
  const [fileChanges, setFileChanges] = useState(null);
  const [isExecuting, setIsExecuting] = useState(false);

  const { sendMessage, isConnected } = useWebSocket({
    onMessage: (data) => {
      if (data.type === 'session_started') {
        setIsExecuting(true);
        setExecutionLogs([]);
        setMessages(prev => [...prev, {
          role: 'assistant',
          content: `Analyzing request: "${data.message}"`,
          isExecuting: true
        }]);
      } else if (data.type === 'log') {
        setExecutionLogs(prev => {
          const existing = prev.find(l => l.step === data.log.step);
          if (existing) {
            return prev.map(l => l.step === data.log.step ? data.log : l);
          }
          return [...prev, data.log];
        });
      } else if (data.type === 'file_changes') {
        setFileChanges(data.changes);
      } else if (data.type === 'session_completed') {
        setIsExecuting(false);
        setMessages(prev => prev.map((msg, idx) =>
          idx === prev.length - 1 ? { ...msg, isExecuting: false } : msg
        ));
      }
    }
  });

  useEffect(() => {
    fetch('http://localhost:3535/api/project')
      .then(res => res.json())
      .then(data => setUnityProject(data))
      .catch(err => console.error('Failed to load project:', err));
  }, []);

  const handleSendMessage = (message) => {
    setMessages(prev => [...prev, { role: 'user', content: message }]);
    sendMessage({ type: 'execute', payload: { message } });
  };

  if (!unityProject) {
    return (
      <div className="h-screen bg-unity-darker flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-unity-blue mx-auto mb-4"></div>
          <p className="text-gray-400">Loading Unity project...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-screen bg-unity-darker flex flex-col overflow-hidden">
      <Header
        projectName={unityProject.name}
        isConnected={isConnected}
        isExecuting={isExecuting}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="w-80 border-r border-unity-gray flex flex-col">
          <ProjectExplorer project={unityProject} />
        </div>

        <div className="flex-1 flex flex-col">
          <div className="flex border-b border-unity-gray">
            <button
              onClick={() => setActiveView('scene')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeView === 'scene'
                  ? 'bg-unity-dark text-unity-blue border-b-2 border-unity-blue'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              Scene View
            </button>
            <button
              onClick={() => setActiveView('diff')}
              className={`px-6 py-3 font-medium transition-colors ${
                activeView === 'diff'
                  ? 'bg-unity-dark text-unity-blue border-b-2 border-unity-blue'
                  : 'text-gray-400 hover:text-white'
              }`}
            >
              File Changes
            </button>
          </div>

          <div className="flex-1 overflow-hidden bg-unity-dark">
            {activeView === 'scene' && unityProject.scenes && (
              <SceneVisualizer scene={unityProject.scenes[1]} />
            )}
            {activeView === 'diff' && (
              <FileDiffViewer changes={fileChanges} />
            )}
          </div>
        </div>

        <div className="w-96 border-l border-unity-gray flex flex-col">
          <ExecutionLog logs={executionLogs} isExecuting={isExecuting} />
        </div>
      </div>

      <div className="h-80 border-t border-unity-gray bg-unity-dark">
        <ChatInterface
          messages={messages}
          onSendMessage={handleSendMessage}
          isExecuting={isExecuting}
        />
      </div>
    </div>
  );
}

export default App;
