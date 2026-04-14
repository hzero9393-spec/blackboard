import type { Edge, Node, Viewport } from '@xyflow/react';

export type BuilderNodeData = {
  label: string;
  nodeType: 'page' | 'component' | 'shape' | 'text';
  locked?: boolean;
};

export type BuilderNode = Node<BuilderNodeData>;
export type BuilderEdge = Edge<{ label?: string }>;

export type ProjectSnapshot = {
  version: '1.0';
  projectId: string;
  nodes: BuilderNode[];
  edges: BuilderEdge[];
  viewport: Viewport;
  updatedAt: string;
};
