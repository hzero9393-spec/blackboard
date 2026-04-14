type Props = {
  onAddNode: (type: 'page' | 'component' | 'shape' | 'text') => void;
  onUndo: () => void;
  onRedo: () => void;
  onDelete: () => void;
  onSave: () => void;
};

export const Toolbar = ({ onAddNode, onUndo, onRedo, onDelete, onSave }: Props) => (
  <div className="absolute left-1/2 top-3 z-20 flex -translate-x-1/2 gap-2 rounded-xl border border-zinc-700 bg-panel/95 p-2 shadow-lg">
    <button onClick={() => onAddNode('page')} className="rounded bg-zinc-800 px-3 py-1">Page</button>
    <button onClick={() => onAddNode('component')} className="rounded bg-zinc-800 px-3 py-1">Component</button>
    <button onClick={() => onAddNode('shape')} className="rounded bg-zinc-800 px-3 py-1">Shape</button>
    <button onClick={() => onAddNode('text')} className="rounded bg-zinc-800 px-3 py-1">Text</button>
    <button onClick={onUndo} className="rounded bg-zinc-800 px-3 py-1">Undo</button>
    <button onClick={onRedo} className="rounded bg-zinc-800 px-3 py-1">Redo</button>
    <button onClick={onDelete} className="rounded bg-zinc-800 px-3 py-1">Delete</button>
    <button onClick={onSave} className="rounded bg-blue-600 px-3 py-1">Save</button>
  </div>
);
