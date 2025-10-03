import { CheckCircle, Circle, Loader, Terminal } from 'lucide-react';

export default function ExecutionLog({ logs, isExecuting }) {
  return (
    <div className="h-full flex flex-col bg-unity-dark">
      <div className="p-4 border-b border-unity-gray">
        <div className="flex items-center gap-2">
          <Terminal className="w-5 h-5 text-unity-green" />
          <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
            Execution Log
          </h2>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        {logs.length === 0 && !isExecuting ? (
          <div className="text-center py-8 text-gray-500">
            <Terminal className="w-12 h-12 mx-auto mb-3 opacity-50" />
            <p className="text-sm">No active execution</p>
          </div>
        ) : (
          <div className="space-y-4">
            {logs.map((log, idx) => (
              <LogEntry key={idx} log={log} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

function LogEntry({ log }) {
  const details = typeof log.details === 'string' ? JSON.parse(log.details) : log.details;

  return (
    <div className="border-l-2 border-unity-gray pl-4 pb-4">
      <div className="flex items-start gap-3">
        <div className="flex-shrink-0 mt-1">
          {log.status === 'completed' ? (
            <CheckCircle className="w-5 h-5 text-unity-green" />
          ) : log.status === 'running' ? (
            <Loader className="w-5 h-5 text-unity-blue animate-spin" />
          ) : (
            <Circle className="w-5 h-5 text-gray-500" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-semibold text-gray-500">
              Step {log.step}
            </span>
            <span className={`text-xs px-2 py-0.5 rounded ${
              log.status === 'completed'
                ? 'bg-unity-green/20 text-unity-green'
                : log.status === 'running'
                ? 'bg-unity-blue/20 text-unity-blue'
                : 'bg-gray-700 text-gray-400'
            }`}>
              {log.status}
            </span>
          </div>

          <p className="text-sm font-medium text-white mb-1">
            {details.action?.replace(/_/g, ' ').toUpperCase()}
          </p>

          <p className="text-sm text-gray-400 leading-relaxed">
            {details.description}
          </p>

          {details.result && log.status === 'completed' && (
            <div className="mt-2 p-2 bg-unity-gray/50 rounded text-xs text-gray-300">
              {details.result}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
