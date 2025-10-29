
import React from 'react';

export const Header: React.FC = () => {
    return (
        <header className="text-center p-6 md:p-10 border-b border-gray-200 dark:border-gray-700">
            <h1 className="text-3xl md:text-5xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-primary-500 to-purple-500 tracking-tight">
                AI Apparel Visualizer
            </h1>
            <p className="mt-2 text-lg md:text-xl text-gray-500 dark:text-gray-400">
                Upload. Design. Visualize.
            </p>
        </header>
    );
};
