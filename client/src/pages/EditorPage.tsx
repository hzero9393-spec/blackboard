import { Background, Controls, MiniMap, ReactFlow, type ReactFlowInstance } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { useMemo, useState } from 'react';
import { useParams } from 'react-router-dom';
import toast from 'react-hot-toast';
import { ComponentLibrary } from '../components/ComponentLibrary';
import { LayersPanel } from '../components/LayersPanel';
import { MiniMapPanel } from '../components/MiniMapPanel';
import { StylePanel } from '../components/StylePanel';
import { Toolbar } from '../components/Toolbar';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';
import { useCanvasStore } from '../store/canvasStore';
import type { BuilderEdge, BuilderNode } from '../types/canvas';
import { exportPdf, exportPng } from '../utils/exportHelpers';

export const EditorPage = () => {
  const { projectId = 'demo-project' } = useParams();
  const [flowInstance, setFlowInstance] = useState<ReactFlowInstance<BuilderNode, BuilderEdge> | null>(null);
  const store = useCanvasStore();
  const selected = useMemo(() => store.nodes.find((n) => store.selectedIds.includes(n.id)), [store.nodes, store.selectedIds]);

  const addNode = (type: 'page' | 'component' | 'shape' | 'text') => {
    const node: BuilderNode = {
      id: crypto.randomUUID(),
      type: 'default',
      position: { x: Math.random() * 400, y: Math.random() * 300 },
      data: { label: `${type} node`, nodeType: type },
      style: { background: '#1f2937', color: '#fff', borderRadius: 12, padding: 8, border: '1px solid #374151' },
    };
    store.addNode(node);
  };

  const saveLocal = () => {
    localStorage.setItem(`project:${projectId}`, JSON.stringify(store.toSnapshot()));
    toast.success('Project saved to localStorage');
  };

  useKeyboardShortcuts({
    undo: store.undo,
    redo: store.redo,
    duplicate: store.duplicateSelected,
    deleteSelected: store.deleteSelected,
    save: saveLocal,
  });

  return (
    <div className="flex h-screen w-full bg-board text-zinc-100">
      <LayersPanel nodes={store.nodes} onSelect={(id) => store.setSelectedIds([id])} />
      <div className="relative flex-1">
        <Toolbar onAddNode={addNode} onUndo={store.undo} onRedo={store.redo} onDelete={store.deleteSelected} onSave={saveLocal} />
        <ComponentLibrary onDropPreset={(preset) => {
          addNode('component');
          toast.success(`${preset} block added`);
        }} />
        <MiniMapPanel />
        <div className="absolute right-3 top-20 z-20 flex gap-2">
          <button className="rounded bg-zinc-800 px-2 py-1 text-xs" onClick={() => exportPng(flowInstance, projectId)}>PNG</button>
          <button className="rounded bg-zinc-800 px-2 py-1 text-xs" onClick={() => exportPdf(flowInstance, projectId)}>PDF</button>
        </div>
        <ReactFlow<BuilderNode, BuilderEdge>
          nodes={store.nodes}
          edges={store.edges}
          onNodesChange={store.onNodesChange}
          onEdgesChange={store.onEdgesChange}
          onConnect={store.onConnect}
          onSelectionChange={(s) => store.setSelectedIds((s.nodes || []).map((n) => n.id))}
          fitView
          onInit={setFlowInstance}
          defaultViewport={{ x: 0, y: 0, zoom: 1 }}
          minZoom={0.2}
          maxZoom={3}
        >
          <Background gap={20} color="#202020" />
          <MiniMap />
          <Controls />
        </ReactFlow>
      </div>
      <StylePanel
        selectedNode={selected}
        onColorChange={(color) => {
          const updated = store.nodes.map((node) => (node.id === selected?.id ? { ...node, style: { ...node.style, background: color } } : node));
          store.setNodes(updated);
        }}
      />
    </div>
  );
};
