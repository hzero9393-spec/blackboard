import type { BuilderNode } from '../types/canvas';

type Props = {
  selectedNode?: BuilderNode;
  onColorChange: (color: string) => void;
};

export const StylePanel = ({ selectedNode, onColorChange }: Props) => (
  <aside className="w-64 border-l border-zinc-800 bg-panel p-3">
    <h3 className="mb-2 text-sm font-semibold">Style</h3>
    {!selectedNode ? (
      <p className="text-xs text-zinc-400">Select a node to edit style</p>
    ) : (
      <div className="space-y-2 text-xs">
        <div>{selectedNode.data.label}</div>
        <input type="color" className="h-8 w-full" onChange={(e) => onColorChange(e.target.value)} />
      </div>
    )}
  </aside>
);
