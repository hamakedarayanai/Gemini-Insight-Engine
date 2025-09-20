
import React, { useState, useEffect } from 'react';

const loadingSteps = [
    "Analyzing your query...",
    "Searching the latest web sources...",
    "Synthesizing key information...",
    "Generating insightful diagrams...",
    "Building knowledge graph...",
    "Finalizing your report..."
];

export const LoadingState: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep(prev => (prev + 1) % loadingSteps.length);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <div className="w-16 h-16 border-4 border-purple-400 border-t-transparent rounded-full animate-spin mb-6"></div>
            <h2 className="text-2xl font-semibold text-white mb-2">Generating Your Insight Report</h2>
            <p className="text-lg text-gray-400 transition-opacity duration-500">
                {loadingSteps[currentStep]}
            </p>
        </div>
    );
};
