
import React, { useState, useEffect } from 'react';

const loadingSteps = [
    "Analyzing your query...",
    "Searching the latest web sources...",
    "Synthesizing key information...",
    "Generating insightful diagrams...",
    "Building knowledge graph...",
    "Finalizing your report..."
];

const SkeletonCard: React.FC<{ className?: string }> = ({ className }) => (
    <div className={`bg-gray-800/50 border border-gray-700 rounded-xl p-6 ${className}`}>
        <div className="space-y-4 animate-shimmer">
            <div className="h-6 w-1/3 bg-gray-700 rounded"></div>
            <div className="h-4 w-full bg-gray-700 rounded"></div>
            <div className="h-4 w-full bg-gray-700 rounded"></div>
            <div className="h-4 w-3/4 bg-gray-700 rounded"></div>
        </div>
    </div>
);


export const LoadingState: React.FC = () => {
    const [currentStep, setCurrentStep] = useState(0);

    useEffect(() => {
        const interval = setInterval(() => {
            setCurrentStep(prev => (prev >= loadingSteps.length -1) ? prev : prev + 1);
        }, 2000);

        return () => clearInterval(interval);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center text-center p-8">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 w-full max-w-7xl mx-auto mb-8">
                <SkeletonCard className="lg:col-span-2" />
                <SkeletonCard />
                <SkeletonCard className="lg:col-span-3" />
                <SkeletonCard className="lg:col-span-3" />
            </div>
            <h2 className="text-2xl font-semibold text-white mb-2">Generating Your Insight Report</h2>
            <p className="text-lg text-gray-400 transition-opacity duration-500">
                {loadingSteps[currentStep]}
            </p>
        </div>
    );
};