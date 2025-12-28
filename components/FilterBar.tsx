'use client';

import { useState, useEffect } from 'react';
import { Filter, X, ChevronDown, ChevronUp, Check } from 'lucide-react';

interface FilterBarProps {
    onFilterChange: (filters: any) => void;
    className?: string;
}

interface FilterOptions {
    frameTypes: string[];
    frameShapes: string[];
    genders: string[];
    frameMaterials: string[];
}

export default function FilterBar({ onFilterChange, className = '' }: FilterBarProps) {
    const [isOpen, setIsOpen] = useState(false);
    const [filters, setFilters] = useState({
        frameType: '',
        frameShape: '',
        gender: '',
        frameMaterial: '',
        priceRange: { min: 0, max: 10000 }
    });

    const [filterOptions, setFilterOptions] = useState<FilterOptions>({
        frameTypes: ['Full Rim', 'Half Rim', 'Rimless', 'Browline'],
        frameShapes: ['Rectangle', 'Round', 'Aviator', 'Cat-eye', 'Square', 'Oval', 'Wayfarer', 'Geometric'],
        genders: ['Men', 'Women', 'Unisex'],
        frameMaterials: ['Metal', 'Plastic', 'Acetate', 'Titanium', 'Wood', 'TR90']
    });

    // Expanded states for accordion sections (default all open on desktop)
    const [expandedSections, setExpandedSections] = useState({
        frameType: true,
        frameShape: true,
        gender: true,
        frameMaterial: true
    });

    const toggleSection = (section: keyof typeof expandedSections) => {
        setExpandedSections(prev => ({ ...prev, [section]: !prev[section] }));
    };

    // Fetch dynamic filter options on mount
    useEffect(() => {
        const fetchFilterOptions = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/filters');
                if (response.ok) {
                    const data = await response.json();
                    setFilterOptions({
                        frameTypes: data.frameTypes || [],
                        frameShapes: data.frameShapes || [],
                        genders: data.genders || [],
                        frameMaterials: data.frameMaterials || []
                    });
                }
            } catch (error) {
                console.error('Error fetching filter options:', error);
            }
        };

        fetchFilterOptions();
    }, []);

    const handleFilterChange = (key: string, value: any) => {
        // Toggle behavior for sidebar: clicking same value deselects it
        const newValue = filters[key as keyof typeof filters] === value ? '' : value;
        const newFilters = { ...filters, [key]: newValue };
        setFilters(newFilters);
        onFilterChange(newFilters);
    };

    const clearFilters = () => {
        const resetFilters = {
            frameType: '',
            frameShape: '',
            gender: '',
            frameMaterial: '',
            priceRange: { min: 0, max: 10000 }
        };
        setFilters(resetFilters);
        onFilterChange(resetFilters);
    };

    const activeFilterCount = [filters.frameType, filters.frameShape, filters.gender, filters.frameMaterial]
        .filter(v => v !== '').length;

    const FilterSection = ({
        title,
        sectionKey,
        options,
        currentValue
    }: {
        title: string,
        sectionKey: keyof typeof expandedSections,
        options: string[],
        currentValue: string
    }) => (
        <div className="border-b border-gray-100 py-5 last:border-0">
            <button
                onClick={() => toggleSection(sectionKey)}
                className="flex items-center justify-between w-full text-left mb-3 group"
            >
                <span className="font-bold text-gray-800 group-hover:text-[#1e3a5f] transition-colors text-[15px]">{title}</span>
                {expandedSections[sectionKey] ? (
                    <ChevronUp className="w-4 h-4 text-gray-400 group-hover:text-[#1e3a5f]" />
                ) : (
                    <ChevronDown className="w-4 h-4 text-gray-400 group-hover:text-[#1e3a5f]" />
                )}
            </button>

            {expandedSections[sectionKey] && (
                <div className="space-y-2.5">
                    {options.map(option => {
                        const isSelected = currentValue === option;
                        return (
                            <label key={option} className={`
                                flex items-center gap-3 cursor-pointer p-2 rounded-lg transition-all duration-200
                                ${isSelected ? 'bg-blue-50/80 translate-x-1' : 'hover:bg-gray-50 hover:translate-x-1'}
                            `}>
                                <input
                                    type="checkbox"
                                    checked={isSelected}
                                    onChange={() => handleFilterChange(sectionKey as string, option)}
                                    className="hidden"
                                />
                                <div className={`
                                    w-5 h-5 rounded-md border flex items-center justify-center transition-all duration-200 shadow-sm
                                    ${isSelected
                                        ? 'bg-[#1e3a5f] border-[#1e3a5f] scale-100'
                                        : 'bg-white border-gray-300 group-hover:border-[#1e3a5f]'}
                                `}>
                                    {isSelected && <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />}
                                </div>
                                <span className={`
                                    text-sm font-medium transition-colors
                                    ${isSelected ? 'text-[#1e3a5f]' : 'text-gray-600'}
                                `}>
                                    {option}
                                </span>
                            </label>
                        );
                    })}
                </div>
            )}
        </div>
    );

    return (
        <>
            {/* Mobile Toggle Button (Visible only on mobile) */}
            <div className="lg:hidden mb-6">
                <button
                    onClick={() => setIsOpen(true)}
                    className="w-full flex items-center justify-between px-4 py-3 bg-white border border-gray-200 rounded-xl shadow-sm hover:border-[#1e3a5f] transition-all active:scale-[0.99]"
                >
                    <div className="flex items-center gap-2">
                        <div className="bg-[#1e3a5f]/10 p-1.5 rounded-lg">
                            <Filter className="w-4 h-4 text-[#1e3a5f]" />
                        </div>
                        <span className="font-bold text-gray-900">Filters</span>
                    </div>

                    <div className="flex items-center gap-2">
                        {activeFilterCount > 0 && (
                            <span className="bg-[#d4af37] text-white text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shadow-sm">
                                {activeFilterCount} Active
                            </span>
                        )}
                        <ChevronDown className="w-4 h-4 text-gray-400" />
                    </div>
                </button>
            </div>

            {/* Sidebar / Modal Container */}
            <div className={`
                fixed inset-0 z-50 lg:static lg:z-0 lg:block
                ${isOpen ? 'block' : 'hidden'}
            `}>
                {/* Mobile Backdrop */}
                <div
                    className="fixed inset-0 bg-gray-900/60 lg:hidden backdrop-blur-sm transition-opacity"
                    onClick={() => setIsOpen(false)}
                />

                {/* Filter Content */}
                <div className={`
                    fixed inset-y-0 left-0 w-[300px] bg-white lg:w-full lg:sticky lg:top-24 lg:h-[calc(100vh-8rem)] lg:overflow-y-auto lg:rounded-2xl lg:border lg:border-white/50 lg:shadow-[0_8px_30px_rgb(0,0,0,0.04)]
                    transform transition-transform duration-300 ease-in-out
                    ${isOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
                    flex flex-col
                    ${className}
                `}>
                    {/* Header */}
                    <div className="p-6 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white/95 backdrop-blur-sm z-10">
                        <div className="flex items-center gap-3">
                            <div className="bg-gradient-to-br from-[#1e3a5f] to-[#2b5285] p-2 rounded-lg shadow-blue-900/20 shadow-lg">
                                <Filter className="w-5 h-5 text-white" />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-900 text-lg leading-tight">Filters</h3>
                                <p className="text-[11px] font-medium text-gray-400 uppercase tracking-widest mt-0.5">Refine Results</p>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="lg:hidden p-2 hover:bg-gray-100 rounded-full text-gray-500 transition-colors"
                        >
                            <X className="w-5 h-5" />
                        </button>
                        {activeFilterCount > 0 && (
                            <button
                                onClick={clearFilters}
                                className="hidden lg:block text-[11px] font-bold text-red-500 hover:text-red-600 bg-red-50 hover:bg-red-100 px-3 py-1.5 rounded-full transition-all uppercase tracking-wide"
                            >
                                Clear All
                            </button>
                        )}
                    </div>

                    {/* Scrollable Filters Area */}
                    <div className="p-6 overflow-y-auto flex-1 custom-scrollbar bg-gradient-to-b from-white to-gray-50/50">
                        <FilterSection
                            title="Frame Type"
                            sectionKey="frameType"
                            options={filterOptions.frameTypes}
                            currentValue={filters.frameType}
                        />
                        <FilterSection
                            title="Frame Shape"
                            sectionKey="frameShape"
                            options={filterOptions.frameShapes}
                            currentValue={filters.frameShape}
                        />
                        <FilterSection
                            title="Gender"
                            sectionKey="gender"
                            options={filterOptions.genders}
                            currentValue={filters.gender}
                        />
                        <FilterSection
                            title="Material"
                            sectionKey="frameMaterial"
                            options={filterOptions.frameMaterials}
                            currentValue={filters.frameMaterial}
                        />
                    </div>

                    {/* Mobile Footer Actions */}
                    <div className="p-4 border-t border-gray-100 bg-white lg:hidden">
                        <div className="flex gap-3">
                            <button
                                onClick={clearFilters}
                                className="flex-1 px-4 py-3 bg-gray-50 border border-gray-200 text-gray-700 font-semibold rounded-xl hover:bg-gray-100 transition-colors"
                            >
                                Reset ({activeFilterCount})
                            </button>
                            <button
                                onClick={() => setIsOpen(false)}
                                className="flex-[2] px-4 py-3 bg-[#1e3a5f] text-white font-semibold rounded-xl hover:bg-[#162c4b] transition-all shadow-lg shadow-blue-900/30 active:scale-[0.98]"
                            >
                                View Results
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}
