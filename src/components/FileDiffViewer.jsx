import { FileCode, Plus, Minus, FileEdit } from 'lucide-react';

export default function FileDiffViewer({ changes }) {
  if (!changes || changes.length === 0) {
    return (
      <div className="h-full flex items-center justify-center text-gray-500">
        <div className="text-center">
          <FileCode className="w-16 h-16 mx-auto mb-4 opacity-50" />
          <p>No file changes to display</p>
          <p className="text-sm mt-2">File changes will appear here during execution</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto scrollbar-thin">
      {changes.map((change, idx) => (
        <FileChange key={idx} change={change} />
      ))}
    </div>
  );
}

function FileChange({ change }) {
  const getIcon = () => {
    if (change.type === 'create') return <Plus className="w-4 h-4 text-unity-green" />;
    if (change.type === 'delete') return <Minus className="w-4 h-4 text-red-500" />;
    return <FileEdit className="w-4 h-4 text-unity-blue" />;
  };

  const getTypeColor = () => {
    if (change.type === 'create') return 'bg-unity-green/20 text-unity-green';
    if (change.type === 'delete') return 'bg-red-500/20 text-red-500';
    return 'bg-unity-blue/20 text-unity-blue';
  };

  return (
    <div className="border-b border-unity-gray">
      <div className="p-4 bg-unity-gray/30">
        <div className="flex items-center gap-3">
          {getIcon()}
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-sm text-white">{change.file}</span>
              <span className={`text-xs px-2 py-0.5 rounded ${getTypeColor()}`}>
                {change.type}
              </span>
            </div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-2">
        <div className="border-r border-unity-gray">
          <div className="px-4 py-2 bg-red-500/10 border-b border-unity-gray">
            <span className="text-xs font-semibold text-gray-400">Before</span>
          </div>
          <pre className="p-4 text-xs text-gray-300 font-mono overflow-x-auto">
            {change.before || '(empty file)'}
          </pre>
        </div>

        <div>
          <div className="px-4 py-2 bg-unity-green/10 border-b border-unity-gray">
            <span className="text-xs font-semibold text-gray-400">After</span>
          </div>
          <pre className="p-4 text-xs text-gray-300 font-mono overflow-x-auto">
            {change.after}
          </pre>
        </div>
      </div>
    </div>
  );
}
