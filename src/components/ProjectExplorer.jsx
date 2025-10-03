import { useState } from 'react';
import { FolderOpen, Folder, FileCode, Box, Image } from 'lucide-react';

export default function ProjectExplorer({ project }) {
  const [expandedFolders, setExpandedFolders] = useState(['Assets', 'Scenes', 'Scripts']);

  const toggleFolder = (folder) => {
    setExpandedFolders(prev =>
      prev.includes(folder)
        ? prev.filter(f => f !== folder)
        : [...prev, folder]
    );
  };

  return (
    <div className="h-full flex flex-col bg-unity-dark">
      <div className="p-4 border-b border-unity-gray">
        <h2 className="text-sm font-semibold text-gray-400 uppercase tracking-wide">
          Project Explorer
        </h2>
      </div>

      <div className="flex-1 overflow-y-auto scrollbar-thin p-2">
        <div className="space-y-1">
          <FolderItem
            name="Assets"
            icon={FolderOpen}
            expanded={expandedFolders.includes('Assets')}
            onToggle={() => toggleFolder('Assets')}
          >
            <FolderItem
              name="Scenes"
              icon={Folder}
              expanded={expandedFolders.includes('Scenes')}
              onToggle={() => toggleFolder('Scenes')}
              indent={1}
            >
              {project.scenes.map((scene, idx) => (
                <FileItem
                  key={idx}
                  name={scene.name + '.unity'}
                  icon={Image}
                  indent={2}
                />
              ))}
            </FolderItem>

            <FolderItem
              name="Scripts"
              icon={Folder}
              expanded={expandedFolders.includes('Scripts')}
              onToggle={() => toggleFolder('Scripts')}
              indent={1}
            >
              {project.scripts.map((script, idx) => (
                <FileItem
                  key={idx}
                  name={script.name}
                  icon={FileCode}
                  indent={2}
                />
              ))}
            </FolderItem>

            <FolderItem
              name="Prefabs"
              icon={Folder}
              expanded={expandedFolders.includes('Prefabs')}
              onToggle={() => toggleFolder('Prefabs')}
              indent={1}
            >
              {project.prefabs.map((prefab, idx) => (
                <FileItem
                  key={idx}
                  name={prefab.name + '.prefab'}
                  icon={Box}
                  indent={2}
                />
              ))}
            </FolderItem>
          </FolderItem>
        </div>
      </div>
    </div>
  );
}

function FolderItem({ name, icon: Icon, expanded, onToggle, children, indent = 0 }) {
  return (
    <div>
      <button
        onClick={onToggle}
        className="w-full flex items-center gap-2 px-2 py-1.5 hover:bg-unity-gray rounded text-sm text-gray-300"
        style={{ paddingLeft: `${8 + indent * 16}px` }}
      >
        <Icon className="w-4 h-4 text-unity-blue flex-shrink-0" />
        <span>{name}</span>
      </button>
      {expanded && <div>{children}</div>}
    </div>
  );
}

function FileItem({ name, icon: Icon, indent = 0 }) {
  return (
    <div
      className="flex items-center gap-2 px-2 py-1.5 hover:bg-unity-gray rounded text-sm text-gray-400"
      style={{ paddingLeft: `${8 + indent * 16}px` }}
    >
      <Icon className="w-4 h-4 flex-shrink-0" />
      <span>{name}</span>
    </div>
  );
}
