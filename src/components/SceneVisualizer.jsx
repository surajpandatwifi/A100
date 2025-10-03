import { useState } from 'react';
import { ChevronRight, ChevronDown, Box, Layers } from 'lucide-react';

export default function SceneVisualizer({ scene }) {
  const [expandedObjects, setExpandedObjects] = useState(new Set(['Player', 'Enemies']));

  const toggleExpanded = (name) => {
    setExpandedObjects(prev => {
      const next = new Set(prev);
      if (next.has(name)) {
        next.delete(name);
      } else {
        next.add(name);
      }
      return next;
    });
  };

  return (
    <div className="h-full flex flex-col">
      <div className="p-4 border-b border-unity-gray">
        <div className="flex items-center gap-2">
          <Layers className="w-5 h-5 text-unity-blue" />
          <h2 className="text-lg font-semibold">{scene.name}</h2>
          <span className="text-sm text-gray-500 ml-2">
            {scene.gameObjects.length} root objects
          </span>
        </div>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-4">
        <div className="space-y-1">
          {scene.gameObjects.map((obj, idx) => (
            <GameObject
              key={idx}
              obj={obj}
              expanded={expandedObjects.has(obj.name)}
              onToggle={() => toggleExpanded(obj.name)}
            />
          ))}
        </div>
      </div>
    </div>
  );
}

function GameObject({ obj, expanded, onToggle, indent = 0 }) {
  const hasChildren = obj.children && obj.children.length > 0;

  return (
    <div>
      <div
        className="flex items-start gap-2 px-3 py-2 hover:bg-unity-gray/50 rounded cursor-pointer"
        style={{ paddingLeft: `${12 + indent * 20}px` }}
        onClick={onToggle}
      >
        <div className="flex-shrink-0 mt-0.5">
          {hasChildren ? (
            expanded ? (
              <ChevronDown className="w-4 h-4 text-gray-400" />
            ) : (
              <ChevronRight className="w-4 h-4 text-gray-400" />
            )
          ) : (
            <Box className="w-4 h-4 text-gray-600" />
          )}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <Box className="w-4 h-4 text-unity-blue flex-shrink-0" />
            <span className="font-medium text-white">{obj.name}</span>
          </div>
          <div className="mt-1 flex flex-wrap gap-1">
            {obj.components.map((comp, idx) => (
              <span
                key={idx}
                className="text-xs px-2 py-0.5 bg-unity-gray rounded text-gray-400"
              >
                {comp}
              </span>
            ))}
          </div>
        </div>
      </div>

      {hasChildren && expanded && (
        <div>
          {obj.children.map((child, idx) => (
            <GameObject
              key={idx}
              obj={child}
              expanded={false}
              onToggle={() => {}}
              indent={indent + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
