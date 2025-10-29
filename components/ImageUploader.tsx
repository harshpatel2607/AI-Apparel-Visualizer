
import React, { useState, useRef } from 'react';
import { fileToBase64 } from '../utils/fileUtils';

interface ImageUploaderProps {
    id: string;
    label: string;
    icon: React.ReactNode;
    onImageUpload: (base64: string) => void;
}

export const ImageUploader: React.FC<ImageUploaderProps> = ({ id, label, icon, onImageUpload }) => {
    const [preview, setPreview] = useState<string | null>(null);
    const fileInputRef = useRef<HTMLInputElement>(null);

    const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            try {
                const base64 = await fileToBase64(file);
                setPreview(base64);
                onImageUpload(base64);
            } catch (error) {
                console.error("Error converting file to base64:", error);
            }
        }
    };

    const handleRemoveImage = (e: React.MouseEvent) => {
        e.stopPropagation();
        e.preventDefault();
        setPreview(null);
        onImageUpload('');
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    }

    return (
        <div className="w-full">
            <label
                htmlFor={id}
                className="relative flex flex-col items-center justify-center w-full h-48 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600 transition-all duration-300 group overflow-hidden"
            >
                {preview ? (
                    <>
                        <img src={preview} alt="Preview" className="w-full h-full object-cover" />
                        <button 
                            onClick={handleRemoveImage}
                            className="absolute top-1 right-1 bg-red-500 text-white rounded-full p-1 w-6 h-6 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                            aria-label="Remove image"
                        >
                            &times;
                        </button>
                    </>
                ) : (
                    <div className="flex flex-col items-center justify-center pt-5 pb-6 text-center">
                        <div className="w-10 h-10 mb-3 text-gray-400 group-hover:text-primary-500 transition-colors">
                            {icon}
                        </div>
                        <p className="mb-2 text-sm text-gray-500 dark:text-gray-400">
                            <span className="font-semibold">{label}</span>
                        </p>
                    </div>
                )}
                <input
                    id={id}
                    type="file"
                    className="hidden"
                    accept="image/png, image/jpeg, image/webp"
                    onChange={handleFileChange}
                    ref={fileInputRef}
                />
            </label>
        </div>
    );
};
