
export interface KeyFigures {
  people: string[];
  organizations: string[];
  quotes: string[];
}

export interface KnowledgeGraphNode {
  id: string;
  label: string;
  x: number;
  y: number;
}

export interface KnowledgeGraphEdge {
  from: string;
  to: string;
  label: string;
}

export interface KnowledgeGraph {
  nodes: KnowledgeGraphNode[];
  edges: KnowledgeGraphEdge[];
}

export interface SynthesizedResponse {
  synthesis: string;
  diagramSVG: string;
  keyFigures: KeyFigures;
  knowledgeGraph: KnowledgeGraph;
  sources: { title: string; uri: string }[];
}
