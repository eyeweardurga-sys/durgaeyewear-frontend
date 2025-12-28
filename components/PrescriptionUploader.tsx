'use client';

import { useState } from 'react';
import { Upload, X } from 'lucide-react';

interface PrescriptionUploaderProps {
    onPrescriptionChange: (data: any) => void;
}

export default function PrescriptionUploader({ onPrescriptionChange }: PrescriptionUploaderProps) {
    const [prescriptionImage, setPrescriptionImage] = useState<string>('');
    const [prescriptionData, setPrescriptionData] = useState({
        leftEye: { sph: '', cyl: '', axis: '', add: '' },
        rightEye: { sph: '', cyl: '', axis: '', add: '' },
        pd: ''
    });

    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPrescriptionImage(reader.result as string);
                onPrescriptionChange({ ...prescriptionData, prescriptionImage: reader.result });
            };
            reader.readAsDataURL(file);
        }
    };

    const handleDataChange = (eye: 'leftEye' | 'rightEye', field: string, value: string) => {
        const newData = {
            ...prescriptionData,
            [eye]: { ...prescriptionData[eye], [field]: value }
        };
        setPrescriptionData(newData);
        onPrescriptionChange({ ...newData, prescriptionImage });
    };

    const handlePDChange = (value: string) => {
        const newData = { ...prescriptionData, pd: value };
        setPrescriptionData(newData);
        onPrescriptionChange({ ...newData, prescriptionImage });
    };

    return (
        <div className="space-y-6">
            <div>
                <h3 className="text-lg font-bold text-gray-900 mb-4">Prescription Details (Optional)</h3>
                <p className="text-sm text-gray-600 mb-4">
                    Upload your prescription or enter lens power manually
                </p>
            </div>

            {/* Image Upload */}
            <div className="border-2 border-dashed border-gray-300 rounded-xl p-6 hover:border-[#1e3a5f] transition-colors">
                <input
                    type="file"
                    id="prescription-upload"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                />
                <label
                    htmlFor="prescription-upload"
                    className="flex flex-col items-center cursor-pointer"
                >
                    {prescriptionImage ? (
                        <div className="relative w-full">
                            <img src={prescriptionImage} alt="Prescription" className="w-full h-48 object-contain rounded-lg" />
                            <button
                                onClick={(e) => {
                                    e.preventDefault();
                                    setPrescriptionImage('');
                                }}
                                className="absolute top-2 right-2 bg-red-500 text-white p-2 rounded-full hover:bg-red-600"
                            >
                                <X className="w-4 h-4" />
                            </button>
                        </div>
                    ) : (
                        <>
                            <Upload className="w-12 h-12 text-gray-400 mb-3" />
                            <p className="text-sm font-medium text-gray-700">Click to upload prescription</p>
                            <p className="text-xs text-gray-500 mt-1">PNG, JPG up to 10MB</p>
                        </>
                    )}
                </label>
            </div>

            {/* Manual Entry */}
            <div className="border rounded-xl p-6 bg-gray-50">
                <h4 className="font-semibold text-gray-900 mb-4">Or Enter Lens Power Manually</h4>

                {/* Left Eye */}
                <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Left Eye (OS)</p>
                    <div className="grid grid-cols-4 gap-3">
                        <input
                            type="text"
                            placeholder="SPH"
                            value={prescriptionData.leftEye.sph}
                            onChange={(e) => handleDataChange('leftEye', 'sph', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a5f] outline-none"
                        />
                        <input
                            type="text"
                            placeholder="CYL"
                            value={prescriptionData.leftEye.cyl}
                            onChange={(e) => handleDataChange('leftEye', 'cyl', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a5f] outline-none"
                        />
                        <input
                            type="text"
                            placeholder="AXIS"
                            value={prescriptionData.leftEye.axis}
                            onChange={(e) => handleDataChange('leftEye', 'axis', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a5f] outline-none"
                        />
                        <input
                            type="text"
                            placeholder="ADD"
                            value={prescriptionData.leftEye.add}
                            onChange={(e) => handleDataChange('leftEye', 'add', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a5f] outline-none"
                        />
                    </div>
                </div>

                {/* Right Eye */}
                <div className="mb-4">
                    <p className="text-sm font-medium text-gray-700 mb-2">Right Eye (OD)</p>
                    <div className="grid grid-cols-4 gap-3">
                        <input
                            type="text"
                            placeholder="SPH"
                            value={prescriptionData.rightEye.sph}
                            onChange={(e) => handleDataChange('rightEye', 'sph', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a5f] outline-none"
                        />
                        <input
                            type="text"
                            placeholder="CYL"
                            value={prescriptionData.rightEye.cyl}
                            onChange={(e) => handleDataChange('rightEye', 'cyl', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a5f] outline-none"
                        />
                        <input
                            type="text"
                            placeholder="AXIS"
                            value={prescriptionData.rightEye.axis}
                            onChange={(e) => handleDataChange('rightEye', 'axis', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a5f] outline-none"
                        />
                        <input
                            type="text"
                            placeholder="ADD"
                            value={prescriptionData.rightEye.add}
                            onChange={(e) => handleDataChange('rightEye', 'add', e.target.value)}
                            className="px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a5f] outline-none"
                        />
                    </div>
                </div>

                {/* PD */}
                <div>
                    <p className="text-sm font-medium text-gray-700 mb-2">Pupillary Distance (PD)</p>
                    <input
                        type="text"
                        placeholder="e.g., 63mm"
                        value={prescriptionData.pd}
                        onChange={(e) => handlePDChange(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-[#1e3a5f] outline-none"
                    />
                </div>

                <p className="text-xs text-gray-500 mt-4">
                    💡 Find these values on your prescription. If unsure, skip this step.
                </p>
            </div>
        </div>
    );
}
