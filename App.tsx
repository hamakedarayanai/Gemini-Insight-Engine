
import React, { useState, useCallback } from 'react';
import { SearchBar } from './components/SearchBar';
import { LoadingState } from './components/LoadingState';
import { ResultsDisplay } from './components/ResultsDisplay';
import { ErrorDisplay } from './components/ErrorDisplay';
import { WelcomeScreen } from './components/WelcomeScreen';
import { fetchSynthesizedResponse } from './services/geminiService';
import type { SynthesizedResponse } from './types';
import { GeminiLogo } from './components/Icons';

const App: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [results, setResults] = useState<SynthesizedResponse | null>(null);

  const handleSearch = useCallback(async (query: string) => {
    if (!query.trim()) return;

    setIsLoading(true);
    setError(null);
    setResults(null);

    try {
      const response = await fetchSynthesizedResponse(query);
      setResults(response);
    } catch (err) {
      console.error(err);
      setError(err instanceof Error ? err.message : 'An unknown error occurred.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  const renderContent = () => {
    if (isLoading) {
      return <LoadingState />;
    }
    if (error) {
      return <ErrorDisplay message={error} />;
    }
    if (results) {
      return <ResultsDisplay data={results} />;
    }
    return <WelcomeScreen onSearch={handleSearch} />;
  };

  return (
    <div className="min-h-screen text-gray-200 font-sans">
      <main className="container mx-auto px-4 py-8 md:py-12">
        <header className="text-center mb-8 md:mb-12">
          <div className="flex items-center justify-center gap-4 mb-4">
            <GeminiLogo className="w-12 h-12 md:w-16 md:h-16" />
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight bg-gradient-to-r from-purple-400 via-pink-500 to-red-500 text-transparent bg-clip-text">
              Gemini Insight Engine
            </h1>
          </div>
          <p className="text-lg md:text-xl text-gray-400 max-w-3xl mx-auto">
            Beyond links. Get synthesized knowledge, diagrams, and interactive graphs for your most complex questions.
          </p>
        </header>

        <div className="max-w-3xl mx-auto">
          <SearchBar onSearch={handleSearch} isLoading={isLoading} />
        </div>

        <div className="mt-12">
          {renderContent()}
        </div>
      </main>
      <footer className="text-center py-6 text-gray-500 text-sm">
        <p>Powered by Google's Gemini API</p>
      </footer>
    </div>
  );
};

export default App;