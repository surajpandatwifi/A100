import { Zap, Circle, Play } from 'lucide-react';

export default function Header({ projectName, isConnected, isExecuting }) {
  return (
    <header className="h-14 bg-unity-darker border-b border-unity-gray flex items-center justify-between px-6">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-2">
          <Zap className="w-6 h-6 text-unity-blue" />
          <h1 className="text-xl font-bold">Shunya</h1>
        </div>
        <div className="h-6 w-px bg-unity-gray"></div>
        <span className="text-gray-400">{projectName}</span>
      </div>

      <div className="flex items-center gap-6">
        {isExecuting && (
          <div className="flex items-center gap-2 text-unity-green">
            <Play className="w-4 h-4 animate-pulse" />
            <span className="text-sm font-medium">Executing...</span>
          </div>
        )}
        <div className="flex items-center gap-2">
          <Circle
            className={`w-3 h-3 ${
              isConnected ? 'text-unity-green fill-unity-green' : 'text-gray-500'
            }`}
          />
          <span className="text-sm text-gray-400">
            {isConnected ? 'Connected' : 'Disconnected'}
          </span>
        </div>
      </div>
    </header>
  );
}
