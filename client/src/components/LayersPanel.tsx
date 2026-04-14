import type { BuilderNode } from '../types/canvas';

type Props = {
  nodes: BuilderNode[];
  onSelect: (id: string) => void;
};

export const LayersPanel = ({ nodes, onSelect }: Props) => (
  <aside className="w-64 border-r border-zinc-800 bg-panel p-3">
    <h3 className="mb-2 text-sm font-semibold">Layers</h3>
    <div className="space-y-1">
      {[...nodes].reverse().map((node) => (
        <button key={node.id} onClick={() => onSelect(node.id)} className="w-full rounded bg-zinc-800 px-2 py-1 text-left text-xs">
          {node.data.label}
        </button>
      ))}
    </div>
  </aside>
);
