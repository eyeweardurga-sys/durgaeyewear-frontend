'use client';

import { useState } from 'react';

interface LensOption {
    lensType: string;
    additionalPrice: number;
    description?: string;
}

interface LensSelectorProps {
    lensOptions: LensOption[];
    basePrice: number;
    onLensChange: (selectedLens: LensOption, totalPrice: number) => void;
    className?: string;
}

export default function LensSelector({ lensOptions, basePrice, onLensChange, className = '' }: LensSelectorProps) {
    const [selectedLens, setSelectedLens] = useState<LensOption>(lensOptions[0] || { lensType: 'Standard Lens', additionalPrice: 0, description: '' });

    const handleLensChange = (lens: LensOption) => {
        setSelectedLens(lens);
        const totalPrice = basePrice + lens.additionalPrice;
        onLensChange(lens, totalPrice);
    };

    return (
        <div className={`space-y-3 ${className}`}>
            <div className="flex items-center justify-between mb-2">
                <h3 className="text-sm font-semibold text-gray-900">Select Lens Type</h3>
                <p className="text-xs text-gray-500">Price adjusts automatically</p>
            </div>

            <div className="space-y-2">
                {lensOptions.map((lens, index) => {
                    const isSelected = selectedLens.lensType === lens.lensType;
                    const totalPrice = basePrice + lens.additionalPrice;

                    return (
                        <label
                            key={index}
                            className={`
                                flex items-center justify-between p-3 rounded-lg border-2 cursor-pointer transition-all
                                ${isSelected
                                    ? 'border-[#1e3a5f] bg-[#1e3a5f]/5 shadow-sm'
                                    : 'border-gray-200 hover:border-[#1e3a5f]/50 hover:bg-gray-50'
                                }
                            `}
                        >
                            <div className="flex items-start gap-3 flex-1">
                                <input
                                    type="radio"
                                    name="lens-option"
                                    checked={isSelected}
                                    onChange={() => handleLensChange(lens)}
                                    className="mt-1 w-4 h-4 text-[#1e3a5f] focus:ring-[#1e3a5f]"
                                />
                                <div className="flex-1">
                                    <div className="flex items-center gap-2">
                                        <span className="text-sm font-medium text-gray-900">
                                            {lens.lensType}
                                        </span>
                                        {lens.additionalPrice === 0 && (
                                            <span className="text-xs bg-green-100 text-green-700 px-2 py-0.5 rounded-full font-medium">
                                                Included
                                            </span>
                                        )}
                                        {index === 1 && (
                                            <span className="text-xs bg-[#d4af37]/20 text-[#d4af37] px-2 py-0.5 rounded-full font-medium border border-[#d4af37]/30">
                                                Popular
                                            </span>
                                        )}
                                    </div>
                                    <p className="text-xs text-gray-500 mt-0.5">{lens.description}</p>
                                </div>
                            </div>
                            <div className="text-right ml-3">
                                {lens.additionalPrice > 0 ? (
                                    <div>
                                        <p className="text-xs text-gray-500">+₹{lens.additionalPrice}</p>
                                        <p className="text-sm font-bold text-[#1e3a5f]">₹{totalPrice}</p>
                                    </div>
                                ) : (
                                    <p className="text-sm font-bold text-[#1e3a5f]">₹{basePrice}</p>
                                )}
                            </div>
                        </label>
                    );
                })}
            </div>

            {/* Total Price Display */}
            <div className="border-t pt-3 mt-3">
                <div className="flex items-center justify-between">
                    <div>
                        <p className="text-sm text-gray-600">Frame Price:</p>
                        <p className="text-xs text-gray-500">Selected Lens: {selectedLens.lensType}</p>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold text-[#1e3a5f]">
                            ₹{basePrice + selectedLens.additionalPrice}
                        </p>
                        {selectedLens.additionalPrice > 0 && (
                            <p className="text-xs text-gray-500">
                                (Frame ₹{basePrice} + Lens ₹{selectedLens.additionalPrice})
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
