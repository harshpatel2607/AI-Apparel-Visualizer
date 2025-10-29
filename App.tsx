import React, { useState, useMemo } from 'react';
import { Header } from './components/Header';
import { ImageUploader } from './components/ImageUploader';
import { ResultDisplay } from './components/ResultDisplay';
import { TshirtIcon, UserIcon, DesignIcon } from './components/icons';
import { generateApparelImage } from './services/geminiService';
import { DesignControls } from './components/DesignControls';

const App: React.FC = () => {
    const [tshirtImage, setTshirtImage] = useState<string | null>(null);
    const [modelImage, setModelImage] = useState<string | null>(null);
    const [generatedImages, setGeneratedImages] = useState<string[] | null>(null);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const [designImage, setDesignImage] = useState<string | null>(null);
    const [design1Position, setDesign1Position] = useState('front-center');
    const [design1Size, setDesign1Size] = useState('medium');

    const [showDesign2Uploader, setShowDesign2Uploader] = useState(false);
    const [designImage2, setDesignImage2] = useState<string | null>(null);
    const [design2Position, setDesign2Position] = useState('front-center');
    const [design2Size, setDesign2Size] = useState('medium');


    const allImagesUploaded = useMemo(() => tshirtImage && modelImage && designImage, [tshirtImage, modelImage, designImage]);

    const handleGenerate = async () => {
        if (!allImagesUploaded) return;

        setIsLoading(true);
        setError(null);
        setGeneratedImages(null);

        try {
            const result = await generateApparelImage(
                modelImage,
                tshirtImage,
                designImage,
                design1Position,
                design1Size,
                designImage2,
                design2Position,
                design2Size
            );
            setGeneratedImages(result);
        } catch (err: unknown) {
            setError(err instanceof Error ? err.message : 'An unknown error occurred.');
        } finally {
            setIsLoading(false);
        }
    };

    const handleReset = () => {
        setTshirtImage(null);
        setModelImage(null);
        setDesignImage(null);
        setDesignImage2(null);
        setShowDesign2Uploader(false);
        setDesign1Position('front-center');
        setDesign1Size('medium');
        setDesign2Position('front-center');
        setDesign2Size('medium');
        setGeneratedImages(null);
        setIsLoading(false);
        setError(null);
        // A full reload is an easy way to reset file inputs
        window.location.reload(); 
    };

    const handleToggleDesign2 = () => {
        if (showDesign2Uploader) {
            setDesignImage2(null);
            setDesign2Position('front-center');
            setDesign2Size('medium');
        }
        setShowDesign2Uploader(!showDesign2Uploader);
    };


    return (
        <div className="min-h-screen bg-gray-50 dark:bg-gray-900 text-gray-900 dark:text-gray-100 font-sans transition-colors duration-300">
            <Header />
            <main className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
                    <div className="flex flex-col gap-6 p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg">
                        <div className='grid grid-cols-1 sm:grid-cols-2 gap-4'>
                            <ImageUploader id="tshirt" label="Upload T-Shirt" icon={<TshirtIcon />} onImageUpload={setTshirtImage} />
                            <ImageUploader id="model" label="Upload Model" icon={<UserIcon />} onImageUpload={setModelImage} />
                        </div>
                        
                        <div className="flex flex-col gap-2">
                            <ImageUploader id="design" label="Upload Design 1" icon={<DesignIcon />} onImageUpload={setDesignImage} />
                            {designImage && (
                                <DesignControls
                                    designNumber={1}
                                    position={design1Position}
                                    size={design1Size}
                                    onPositionChange={setDesign1Position}
                                    onSizeChange={setDesign1Size}
                                />
                            )}
                        </div>

                        {showDesign2Uploader && (
                            <div className="flex flex-col gap-2 border-t border-gray-200 dark:border-gray-700 pt-4">
                                <ImageUploader id="design2" label="Upload Design 2 (Optional)" icon={<DesignIcon />} onImageUpload={setDesignImage2} />
                                {designImage2 && (
                                    <DesignControls
                                        designNumber={2}
                                        position={design2Position}
                                        size={design2Size}
                                        onPositionChange={setDesign2Position}
                                        onSizeChange={setDesign2Size}
                                    />
                                )}
                            </div>
                        )}

                        <button
                            onClick={handleToggleDesign2}
                            className="w-full bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 font-semibold py-2 px-4 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-300 text-sm"
                        >
                            {showDesign2Uploader ? '− Remove Second Design' : '+ Add Second Design'}
                        </button>

                        {error && <div className="text-center text-red-500 bg-red-100 dark:bg-red-900/20 p-3 rounded-lg">{error}</div>}
                        
                        <div className="flex flex-col sm:flex-row gap-4 pt-4 border-t border-gray-200 dark:border-gray-700">
                            <button
                                onClick={handleGenerate}
                                disabled={!allImagesUploaded || isLoading}
                                className="w-full flex-1 bg-primary-600 text-white font-bold py-3 px-6 rounded-lg shadow-md hover:bg-primary-700 disabled:bg-gray-400 dark:disabled:bg-gray-600 disabled:cursor-not-allowed transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-opacity-50"
                            >
                                {isLoading ? 'Generating...' : 'Visualize Design'}
                            </button>
                            <button
                                onClick={handleReset}
                                className="w-full sm:w-auto bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200 font-bold py-3 px-6 rounded-lg hover:bg-gray-300 dark:hover:bg-gray-600 transition-colors duration-300"
                            >
                                Reset
                            </button>
                        </div>
                    </div>

                    <div className="p-6 bg-white dark:bg-gray-800 rounded-2xl shadow-lg sticky top-8">
                        <ResultDisplay images={generatedImages} isLoading={isLoading} />
                    </div>
                </div>
            </main>
             <footer className="text-center py-6 text-gray-500 dark:text-gray-400 text-sm">
                <p>Powered by Gemini. Create your vision.</p>
            </footer>
        </div>
    );
};

export default App;