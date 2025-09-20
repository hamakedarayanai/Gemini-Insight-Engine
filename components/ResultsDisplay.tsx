
import React from 'react';
import type { SynthesizedResponse, KnowledgeGraphNode, KnowledgeGraphEdge, KeyFigures } from '../types';
import { BookOpenIcon, UsersIcon, BuildingIcon, QuoteIcon, LinkIcon } from './Icons';
import { ResponsiveContainer, ScatterChart, Scatter, XAxis, YAxis, ZAxis, Tooltip, Cell, Label } from 'recharts';

interface ResultsDisplayProps {
  data: SynthesizedResponse;
}

const ResultCard: React.FC<{ title: string; icon: React.ReactNode; children: React.ReactNode }> = ({ title, icon, children }) => (
  <div className="bg-gray-800/50 backdrop-blur-sm border border-gray-700 rounded-xl shadow-lg overflow-hidden h-full flex flex-col">
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
    const colors = ['#a78bfa', '#f472b6', '#4ade80', '#fbbf24', '#60a5fa'];
    const dataWithColor = nodes.map((node, i) => ({ ...node, color: colors[i % colors.length] }));

    return (
        <div>
            <div className="w-full h-80 md:h-96">
                <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                        <XAxis type="number" dataKey="x" name="x" hide />
                        <YAxis type="number" dataKey="y" name="y" hide />
                        <ZAxis type="number" range={[100, 500]} dataKey="label" name="label" />
                         <Tooltip cursor={{ strokeDasharray: '3 3' }} contentStyle={{ backgroundColor: '#2d3748', border: '1px solid #4a5568' }} />
                        <Scatter name="Concepts" data={dataWithColor} fill="#8884d8">
                            {dataWithColor.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={entry.color} />
                            ))}
                             {/* @ts-ignore */}
                            <Label content={<CustomLabel />} dataKey="label" position="right" />
                        </Scatter>
                    </ScatterChart>
                </ResponsiveContainer>
            </div>
            <div className="mt-4">
                <h4 className="text-lg font-semibold text-purple-300 mb-2">Relationships</h4>
                <ul className="list-none space-y-1 text-sm">
                    {edges.map((edge, i) => (
                        <li key={i} className="flex items-center">
                            <span className="font-semibold text-gray-200">{nodes.find(n => n.id === edge.from)?.label}</span>
                            <span className="mx-2 text-gray-400">&rarr;</span>
                            <span className="italic text-gray-400">{edge.label}</span>
                            <span className="mx-2 text-gray-400">&rarr;</span>
                            <span className="font-semibold text-gray-200">{nodes.find(n => n.id === edge.to)?.label}</span>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

// This has to be defined outside the component to avoid re-rendering issues
const CustomLabel = (props: any) => {
    const { x, y, value } = props;
    return (
        <text x={x} y={y} dy={-10} fill="#e5e7eb" fontSize={12} textAnchor="middle">
            {value}
        </text>
    );
};

export const ResultsDisplay: React.FC<ResultsDisplayProps> = ({ data }) => {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 animate-fade-in">
      
      <div className="lg:col-span-2">
        <ResultCard title="Synthesized Summary" icon={<BookOpenIcon className="w-6 h-6 text-purple-400"/>}>
          <p className="whitespace-pre-wrap">{data.synthesis}</p>
        </ResultCard>
      </div>

      <div>
        <ResultCard title="Key Figures" icon={<UsersIcon className="w-6 h-6 text-pink-400"/>}>
            <KeyFiguresDisplay figures={data.keyFigures} />
        </ResultCard>
      </div>

      <div className="lg:col-span-3">
        <ResultCard title="Generated Diagram" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" /></svg>}>
          <div className="flex justify-center items-center bg-gray-900/50 p-4 rounded-lg"
               dangerouslySetInnerHTML={{ __html: data.diagramSVG }}>
          </div>
        </ResultCard>
      </div>

      <div className="lg:col-span-3">
        <ResultCard title="Knowledge Graph" icon={<svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-yellow-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.98-7a1 1 0 011.414 0 8.001 8.001 0 011.828 11.233A8 8 0 0117.657 18.657z" /></svg>}>
            <KnowledgeGraphDisplay nodes={data.knowledgeGraph.nodes} edges={data.knowledgeGraph.edges} />
        </ResultCard>
      </div>
        
      {data.sources && data.sources.length > 0 && (
        <div className="lg:col-span-3">
            <ResultCard title="Sources" icon={<LinkIcon className="w-6 h-6 text-blue-400"/>}>
                <ul className="space-y-2">
                    {data.sources.map((source, i) => (
                        <li key={i}>
                            <a href={source.uri} target="_blank" rel="noopener noreferrer" className="text-blue-300 hover:text-blue-200 hover:underline transition-colors duration-200 break-all">
                                {source.title || source.uri}
                            </a>
                        </li>
                    ))}
                </ul>
            </ResultCard>
        </div>
      )}

    </div>
  );
};
