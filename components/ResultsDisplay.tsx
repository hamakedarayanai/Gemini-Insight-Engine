import React, { useState } from 'react';
import type { SynthesizedResponse, KnowledgeGraphNode, KnowledgeGraphEdge, KeyFigures } from '../types';
import { BookOpenIcon, UsersIcon, BuildingIcon, QuoteIcon, LinkIcon, ExternalLinkIcon } from './Icons';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, Tooltip, Cell, Label, Line } from 'recharts';

interface ResultsDisplayProps {
  data: SynthesizedResponse;
}

const ResultCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode, className?: string, style?: React.CSSProperties }> = ({ title, icon, children, className, style }) => (
  <div className={`bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg overflow-hidden h-full flex flex-col transition-all duration-300 hover:border-purple-500/80 hover:shadow-purple-500/10 ${className}`} style={style}>
    <div className="flex items-center p-4 bg-gray-800 border-b border-gray-700">
      {icon}
      <h3 className="text-xl font-bold ml-3 text-gray-100">{title}</h3>
    </div>
    <div className="p-6 text-gray-300 leading-relaxed flex-grow">
      {children}
    </div>
  </div>
);

const KeyFiguresDisplay: React.FC<{ figures: KeyFigures }> = ({ figures }) => (
  <>
    <div className="mb-6">
      <h4 className="flex items-center text-lg font-semibold text-purple-300 mb-2"><UsersIcon className="w-5 h-5 mr-2" /> People</h4>
      <ul className="list-disc list-inside space-y-1">
        {figures.people.map((person, i) => <li key={i}>{person}</li>)}
      </ul>
    </div>
    <div className="mb-6">
      <h4 className="flex items-center text-lg font-semibold text-purple-300 mb-2"><BuildingIcon className="w-5 h-5 mr-2" /> Organizations</h4>
      <ul className="list-disc list-inside space-y-1">
        {figures.organizations.map((org, i) => <li key={i}>{org}</li>)}
      </ul>
    </div>
    <div>
      <h4 className="flex items-center text-lg font-semibold text-purple-300 mb-2"><QuoteIcon className="w-5 h-5 mr-2" /> Quotes</h4>
      <blockquote className="space-y-4">
        {figures.quotes.map((quote, i) => <p key={i} className="pl-4 border-l-4 border-gray-600 italic">"{quote}"</p>)}
      </blockquote>
    </div>
  </>
);

const KnowledgeGraphDisplay: React.FC<{ nodes: KnowledgeGraphNode[], edges: KnowledgeGraphEdge[] }> = ({ nodes, edges }) => {
    const [hoveredNodeId, setHoveredNodeId] = useState<string | null>(null);
    const colors = ['#a78bfa', '#f472b6', '#4ade80', '#fbbf24', '#60a5fa', '#f87171', '#fb923c', '#34d399'];
    
    const nodeMap = new Map(nodes.map(node => [node.id, node]));

    const connectedNodeIds = new Set<string>();
    if (hoveredNodeId) {
        edges.forEach(edge => {
            if (edge.from === hoveredNodeId) connectedNodeIds.add(edge.to);
            if (edge.to === hoveredNodeId) connectedNodeIds.add(edge.from);
        });
    }

    const CustomTooltip = ({ active, payload }: any) => {
      if (active && payload && payload.length) {
        return (
          <div className="bg-gray-900/80 backdrop-blur-sm border border-gray-600 p-3 rounded-lg shadow-xl">
            <p className="text-white font-bold">{payload[0].payload.label}</p>
          </div>
        );
      }
      return null;
    };

    const CustomNodeLabel = (props: any) => {
        const { x, y, payload } = props;
        const isHovered = hoveredNodeId === payload.id;
        const isConnected = connectedNodeIds.has(payload.id);
        const shouldShow = !hoveredNodeId || isHovered || isConnected;
        
        return (
          <text 
            x={x} 
            y={y} 
            dy={-14} 
            fill="#e5e7eb" 
            fontSize={12} 
            textAnchor="middle"
            style={{
                opacity: shouldShow ? 1 : 0.3,
                fontWeight: isHovered ? 'bold' : 'normal',
                transition: 'opacity 0.2s, font-weight 0.2s',
                pointerEvents: 'none'
            }}
          >
            {payload.label}
          </text>
        );
    };

    return (
        <div className="w-full h-80 md:h-96">
            <ResponsiveContainer width="100%" height="100%">
                <ScatterChart margin={{ top: 25, right: 20, bottom: 20, left: 20 }}>
                    <XAxis type="number" dataKey="x" name="x" hide domain={[-5, 105]} />
                    <YAxis type="number" dataKey="y" name="y" hide domain={[-5, 105]} />
                    
                    {edges.map((edge, i) => {
                        const fromNode = nodeMap.get(edge.from);
                        const toNode = nodeMap.get(edge.to);
                        if (!fromNode || !toNode) return null;

                        const isHighlighted = hoveredNodeId === fromNode.id || hoveredNodeId === toNode.id;

                        return (
                            <Line
                                key={`edge-${i}`}
                                data={[fromNode, toNode]}
                                type="linear"
                                dataKey="y"
                                stroke={isHighlighted ? "#a78bfa" : "#4b5563"}
                                strokeWidth={isHighlighted ? 2 : 1}
                                dot={false}
                                isAnimationActive={false}
                                style={{ transition: 'stroke 0.2s, stroke-width 0.2s' }}
                            />
                        );
                    })}
                    
                    <Tooltip content={<CustomTooltip />} cursor={false} />

                    {/* FIX: The onMouseOver handler for recharts Scatter component receives a props object. The original data for the point is in the `payload` property. An `any` type is added to fix the 'unknown' type error from newer TypeScript/types versions. */}
                    <Scatter data={nodes} onMouseOver={(props: any) => setHoveredNodeId(props.payload.id)} onMouseOut={() => setHoveredNodeId(null)}>
                        {nodes.map((node, index) => {
                            const isHovered = hoveredNodeId === node.id;
                            const isConnected = connectedNodeIds.has(node.id);
                            const opacity = hoveredNodeId ? (isHovered || isConnected ? 1 : 0.3) : 1;
                            const radius = isHovered ? 10 : 6;
                            return <Cell key={`cell-${index}`} fill={colors[index % colors.length]} style={{ opacity, transition: 'all 0.2s' }} radius={radius} />;
                        })}
                        <Label content={<CustomNodeLabel />} />
                    </Scatter>
                </ScatterChart>
            </ResponsiveContainer>
        </div>
    );
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data }) => {
  const cards = [
    { id: 'summary', className: 'lg:col-span-2', title: 'Synthesized Summary', icon: <BookOpenIcon className="w-6 h-6 text-purple-400"/>, content: <p className="whitespace-pre-wrap">{data.synthesis}</p> },
    { id: 'figures', className: '', title: 'Key Figures', icon: <UsersIcon className="w-6 h-6 text-pink-400"/>, content: <KeyFiguresDisplay figures={data.keyFigures} /> },
    { id: 'diagram', className: 'lg:col-span-3', title: 'Generated Diagram', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>, content: <div className="flex justify-center items-center bg-gray-900/50 p-4 rounded-lg min-h-[200px]" dangerouslySetInnerHTML={{ __html: data.diagramSVG }}></div> },
    { id: 'graph', className: 'lg:col-span-3', title: 'Knowledge Graph', icon: <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.98-7a1 1 0 011.414 0 8.001 8.001 0 011.828 11.233A8 8 0 0117.657 18.657z" /></svg>, content: <KnowledgeGraphDisplay nodes={data.knowledgeGraph.nodes} edges={data.knowledgeGraph.edges} /> },
    ...(data.sources && data.sources.length > 0 ? [{ id: 'sources', className: 'lg:col-span-3', title: 'Sources', icon: <LinkIcon className="w-6 h-6 text-blue-400"/>, content: <ul className="space-y-3">{data.sources.map((source, i) => (<li key={i}><a href={source.uri} target="_blank" rel="noopener noreferrer" className="inline-flex items-center text-blue-300 hover:text-blue-200 hover:underline transition-colors duration-200 break-all group"><ExternalLinkIcon className="w-4 h-4 mr-2 opacity-70 group-hover:opacity-100" /><span>{source.title || source.uri}</span></a></li>))}</ul> }] : [])
  ];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
       {cards.map((card, index) => (
        <ResultCard
          key={card.id}
          title={card.title}
          icon={card.icon}
          className={`animate-fade-in-up ${card.className}`}
          style={{ animationDelay: `${index * 100}ms` }}
        >
          {card.content}
        </ResultCard>
      ))}
    </div>
  );
};
