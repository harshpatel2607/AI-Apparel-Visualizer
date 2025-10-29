import React, { useState, useEffect } from 'react';

interface ResultDisplayProps {
    images: string[] | null;
    isLoading: boolean;
}

const LoadingState: React.FC = () => {
    const messages = [
        "Warming up the virtual press...",
        "Stitching your design onto fabric...",
        "Generating front and back views...",
        "Adjusting the studio lights...",
        "Creating your masterpiece...",
    ];
    const [message, setMessage] = useState(messages[0]);

    useEffect(() => {
        const interval = setInterval(() => {
            setMessage(prev => {
                const currentIndex = messages.indexOf(prev);
                return messages[(currentIndex + 1) % messages.length];
            });
        }, 3000);
        return () => clearInterval(interval);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    return (
        <div className="flex flex-col items-center justify-center w-full h-full text-center">
            <svg className="animate-spin -ml-1 mr-3 h-10 w-10 text-primary-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
            <p className="mt-4 text-lg font-semibold text-gray-600 dark:text-gray-300 animate-pulse">{message}</p>
        </div>
    );
}

const InitialState: React.FC = () => (
    <div className="flex flex-col items-center justify-center w-full h-full text-center text-gray-500 dark:text-gray-400">
        <svg xmlns="http://www.w3.org/2000/svg" className="w-24 h-24 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={1}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
        </svg>
        <h3 className="text-xl font-bold">Your design will appear here</h3>
        <p className="mt-2">Upload your images and click "Visualize Design" to see the magic happen.</p>
    </div>
);


export const ResultDisplay: React.FC<ResultDisplayProps> = ({ images, isLoading }) => {
    const [activeViewIndex, setActiveViewIndex] = useState(0);

    useEffect(() => {
        // Reset to the first image whenever the images array changes
        setActiveViewIndex(0);
    }, [images]);

    const handleDownload = () => {
        if (!images || !images[activeViewIndex]) return;
        const link = document.createElement('a');
        link.href = images[activeViewIndex];
        const view = activeViewIndex === 0 ? 'front' : 'back';
        link.download = `ai-apparel-design-${view}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const hasMultipleViews = images && images.length > 1;

    return (
        <div>
            <div className="w-full aspect-square bg-gray-100 dark:bg-gray-700 rounded-lg flex items-center justify-center transition-all duration-300">
                {isLoading ? (
                    <LoadingState />
                ) : images && images.length > 0 ? (
                    <div className="relative w-full h-full group">
                        <img src={images[activeViewIndex]} alt="Generated Apparel" className="w-full h-full object-contain rounded-lg" />
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 rounded-lg">
                            <button
                                onClick={handleDownload}
                                className="bg-white text-black font-bold py-3 px-6 rounded-lg shadow-lg hover:bg-gray-200 transition-transform transform hover:scale-105"
                            >
                                Download Image
                            </button>
                        </div>
                    </div>
                ) : (
                    <InitialState />
                )}
            </div>
            {hasMultipleViews && (
                <div className="flex justify-center gap-4 mt-4">
                    <button
                        onClick={() => setActiveViewIndex(0)}
                        className={`font-semibold py-2 px-5 rounded-lg transition-colors ${activeViewIndex === 0 ? 'bg-primary-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'}`}
                    >
                        Front View
                    </button>
                    <button
                        onClick={() => setActiveViewIndex(1)}
                        className={`font-semibold py-2 px-5 rounded-lg transition-colors ${activeViewIndex === 1 ? 'bg-primary-600 text-white shadow' : 'bg-gray-200 dark:bg-gray-600 hover:bg-gray-300 dark:hover:bg-gray-500'}`}
                    >
                        Back View
                    </button>
                </div>
            )}
        </div>
    );
};