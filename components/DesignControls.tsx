import React from 'react';

interface DesignControlsProps {
    designNumber: number;
    position: string;
    size: string;
    onPositionChange: (value: string) => void;
    onSizeChange: (value: string) => void;
}

const positionOptions = [
    { value: 'front-center', label: 'Front Center' },
    { value: 'back-center', label: 'Back Center' },
    { value: 'front-pocket-left', label: 'Front Pocket (Left)' },
    { value: 'front-pocket-right', label: 'Front Pocket (Right)' },
];

const sizeOptions = [
    { value: 'small', label: 'Small' },
    { value: 'medium', label: 'Medium' },
    { value: 'large', label: 'Large' },
    { value: 'full-chest', label: 'Full Chest/Back' },
];

export const DesignControls: React.FC<DesignControlsProps> = ({ designNumber, position, size, onPositionChange, onSizeChange }) => {
    const idPrefix = `design-${designNumber}`;
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-2 p-4 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-800">
            <div>
                <label htmlFor={`${idPrefix}-position`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Design {designNumber} Position
                </label>
                <select
                    id={`${idPrefix}-position`}
                    value={position}
                    onChange={(e) => onPositionChange(e.target.value)}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                    {positionOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
            <div>
                <label htmlFor={`${idPrefix}-size`} className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Design {designNumber} Size
                </label>
                <select
                    id={`${idPrefix}-size`}
                    value={size}
                    onChange={(e) => onSizeChange(e.target.value)}
                    className="w-full bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-primary-500 focus:border-primary-500 sm:text-sm"
                >
                    {sizeOptions.map(option => (
                        <option key={option.value} value={option.value}>{option.label}</option>
                    ))}
                </select>
            </div>
        </div>
    );
};