import React from 'react';
import { ZapIcon } from './Icons';

const examplePrompts = [
  "What are the ethical implications of large language models?",
  "Compare the latest advancements in mRNA vaccines vs. traditional vaccines.",
  "Explain the impact of quantum computing on modern cryptography.",
  "Future of decentralized finance (DeFi) and its regulatory challenges."
];

interface WelcomeScreenProps {
  onSearch: (query: string) => void;
}

export const WelcomeScreen: React.FC<WelcomeScreenProps> = ({ onSearch }) => {
  return (
    <div className="text-center animate-fade-in-up" style={{ animationDelay: '200ms' }}>
      <h2 className="text-2xl font-semibold text-gray-300 mb-2">Unlock deep insights.</h2>
      <p className="text-gray-400 mb-8">Start with an example or type your own query above.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-w-3xl mx-auto">
        {examplePrompts.map((prompt, index) => (
          <button
            key={index}
            onClick={() => onSearch(prompt)}
            className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg text-left hover:bg-purple-900/40 hover:border-purple-600 transition-all duration-300 group"
          >
            <div className="flex items-center">
              <div className="p-2 bg-gray-700/80 rounded-full mr-4 group-hover:bg-purple-500/50 transition-colors">
                <ZapIcon className="w-5 h-5 text-purple-300" />
              </div>
              <span className="text-gray-300 group-hover:text-white">{prompt}</span>
            </div>
          </button>
        ))}
      </div>
    </div>
  );
};
