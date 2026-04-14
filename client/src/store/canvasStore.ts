import { addEdge, applyEdgeChanges, applyNodeChanges, type Connection, type EdgeChange, type NodeChange, type Viewport } from '@xyflow/react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { produce } from 'immer';
import type { BuilderEdge, BuilderNode, ProjectSnapshot } from '../types/canvas';

const MAX_HISTORY = 50;

type State = {
  projectId: string;
  nodes: BuilderNode[];
  edges: BuilderEdge[];
  viewport: Viewport;
  selectedIds: string[];
  history: { past: ProjectSnapshot[]; future: ProjectSnapshot[] };
  setProject: (projectId: string) => void;
  setViewport: (viewport: Viewport) => void;
  onNodesChange: (changes: NodeChange<BuilderNode>[]) => void;
  onEdgesChange: (changes: EdgeChange<BuilderEdge>[]) => void;
  onConnect: (connection: Connection) => void;
  setNodes: (nodes: BuilderNode[]) => void;
  setEdges: (edges: BuilderEdge[]) => void;
  addNode: (node: BuilderNode) => void;
  deleteSelected: () => void;
  duplicateSelected: () => void;
  setSelectedIds: (ids: string[]) => void;
  undo: () => void;
  redo: () => void;
  toSnapshot: () => ProjectSnapshot;
  hydrateSnapshot: (snapshot: ProjectSnapshot) => void;
};

const makeSnapshot = (projectId: string, nodes: BuilderNode[], edges: BuilderEdge[], viewport: Viewport): ProjectSnapshot => ({
  version: '1.0',
  projectId,
  nodes,
  edges,
  viewport,
  updatedAt: new Date().toISOString(),
});

const pushHistory = (state: State) => {
  const snap = makeSnapshot(state.projectId, state.nodes, state.edges, state.viewport);
  state.history.past.push(snap);
  if (state.history.past.length > MAX_HISTORY) state.history.past.shift();
  state.history.future = [];
};

export const useCanvasStore = create<State>()(
  persist(
    (set, get) => ({
      projectId: 'demo-project',
      nodes: [],
      edges: [],
      viewport: { x: 0, y: 0, zoom: 1 },
      selectedIds: [],
      history: { past: [], future: [] },
      setProject: (projectId) => set({ projectId }),
      setViewport: (viewport) => set({ viewport }),
      setNodes: (nodes) => set(produce((draft: State) => { pushHistory(draft); draft.nodes = nodes; })),
      setEdges: (edges) => set(produce((draft: State) => { pushHistory(draft); draft.edges = edges; })),
      onNodesChange: (changes) =>
        set(produce((draft: State) => {
          draft.nodes = applyNodeChanges(changes, draft.nodes);
        })),
      onEdgesChange: (changes) => set((state) => ({ edges: applyEdgeChanges(changes, state.edges) })),
      onConnect: (connection) => set((state) => ({ edges: addEdge({ ...connection, type: 'smoothstep', animated: false }, state.edges) })),
      addNode: (node) => set(produce((draft: State) => { pushHistory(draft); draft.nodes.push(node); })),
      setSelectedIds: (ids) => set({ selectedIds: ids }),
      deleteSelected: () =>
        set(produce((draft: State) => {
          if (!draft.selectedIds.length) return;
          pushHistory(draft);
          draft.nodes = draft.nodes.filter((n) => !draft.selectedIds.includes(n.id));
          draft.edges = draft.edges.filter((e) => !draft.selectedIds.includes(e.source) && !draft.selectedIds.includes(e.target));
          draft.selectedIds = [];
        })),
      duplicateSelected: () =>
        set(produce((draft: State) => {
          const selected = draft.nodes.filter((n) => draft.selectedIds.includes(n.id));
          if (!selected.length) return;
          pushHistory(draft);
          selected.forEach((node) => {
            draft.nodes.push({
              ...node,
              id: crypto.randomUUID(),
              position: { x: node.position.x + 20, y: node.position.y + 20 },
              selected: false,
            });
          });
        })),
      undo: () =>
        set(produce((draft: State) => {
          const previous = draft.history.past.pop();
          if (!previous) return;
          draft.history.future.push(makeSnapshot(draft.projectId, draft.nodes, draft.edges, draft.viewport));
          draft.nodes = previous.nodes;
          draft.edges = previous.edges;
          draft.viewport = previous.viewport;
        })),
      redo: () =>
        set(produce((draft: State) => {
          const next = draft.history.future.pop();
          if (!next) return;
          draft.history.past.push(makeSnapshot(draft.projectId, draft.nodes, draft.edges, draft.viewport));
          draft.nodes = next.nodes;
          draft.edges = next.edges;
          draft.viewport = next.viewport;
        })),
      toSnapshot: () => makeSnapshot(get().projectId, get().nodes, get().edges, get().viewport),
      hydrateSnapshot: (snapshot) => set({ projectId: snapshot.projectId, nodes: snapshot.nodes, edges: snapshot.edges, viewport: snapshot.viewport }),
    }),
    { name: 'visual-builder-store' },
  ),
);
