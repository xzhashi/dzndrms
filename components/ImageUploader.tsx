
import React, { useState, useCallback } from 'react';
import { supabase } from '../services/supabaseClient';
import { PlusIcon, TrashIcon } from './icons';

interface ImageUploaderProps {
    initialUrls?: string[];
    onUrlsChange: (urls: string[]) => void;
}

const BUCKET_NAME = 'listing-images';
const WATERMARK_URL = 'https://strg21.dozendreams.com/storage/v1/object/public/assetspublic/Categoryicons/DozenDreams%20Logo%20white.png';

const processAndCompressImage = (file: File): Promise<File> => {
    return new Promise((resolve, reject) => {
        const image = new Image();
        image.src = URL.createObjectURL(file);
        
        image.onload = () => {
            const watermark = new Image();
            watermark.crossOrigin = "anonymous"; // Required for cross-domain images on canvas
            watermark.src = WATERMARK_URL;
            
            watermark.onload = () => {
                const canvas = document.createElement('canvas');
                const ctx = canvas.getContext('2d');

                if (!ctx) {
                    return reject(new Error('Could not get canvas context'));
                }

                // Set canvas dimensions to image dimensions
                canvas.width = image.width;
                canvas.height = image.height;
                
                // Draw original image
                ctx.drawImage(image, 0, 0);

                // Calculate watermark size and position
                const watermarkAspectRatio = watermark.width / watermark.height;
                let watermarkWidth = canvas.width * 0.20; // Watermark is 20% of image width
                let watermarkHeight = watermarkWidth / watermarkAspectRatio;

                // If watermark is too tall, base its size on height instead
                if (watermarkHeight > canvas.height * 0.20) {
                    watermarkHeight = canvas.height * 0.20;
                    watermarkWidth = watermarkHeight * watermarkAspectRatio;
                }
                
                const margin = canvas.width * 0.03; // 3% margin from edge
                const x = canvas.width - watermarkWidth - margin;
                const y = canvas.height - watermarkHeight - margin;

                // Draw watermark
                ctx.globalAlpha = 0.6; // Set transparency
                ctx.drawImage(watermark, x, y, watermarkWidth, watermarkHeight);
                ctx.globalAlpha = 1.0; // Reset transparency

                // Convert canvas to compressed JPEG blob
                canvas.toBlob(
                    (blob) => {
                        if (!blob) {
                            return reject(new Error('Canvas to Blob conversion failed'));
                        }
                        // Create a new file with .jpeg extension
                        const newFileName = `${file.name.split('.').slice(0, -1).join('.') || 'image'}.jpeg`;
                        const compressedFile = new File([blob], newFileName, {
                            type: 'image/jpeg',
                            lastModified: Date.now(),
                        });
                        resolve(compressedFile);
                    },
                    'image/jpeg',
                    0.8 // Compression quality (0 to 1)
                );

                URL.revokeObjectURL(image.src); // Clean up object URL
            };
            
            watermark.onerror = () => {
                 console.error("Failed to load watermark image. Uploading original file.");
                 // Resolve with original file if watermark fails to load
                 resolve(file);
            };
        };
        
        image.onerror = () => {
            reject(new Error(`Failed to load image file: ${file.name}`));
        };
    });
};

export const ImageUploader: React.FC<ImageUploaderProps> = ({ initialUrls = [], onUrlsChange }) => {
    const [previews, setPreviews] = useState<string[]>(initialUrls);
    const [isUploading, setIsUploading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const uploadFiles = useCallback(async (files: File[]) => {
        setIsUploading(true);
        setError(null);
        
        try {
            const processedFilesPromises = files.map(file => processAndCompressImage(file));
            const processedFiles = await Promise.all(processedFilesPromises);

            const uploadPromises = processedFiles.map(async (file) => {
                const fileName = `${Date.now()}-${file.name}`;
                const { data, error: uploadError } = await supabase.storage
                    .from(BUCKET_NAME)
                    .upload(fileName, file);

                if (uploadError) {
                    throw new Error(`Upload failed for ${file.name}: ${uploadError.message}`);
                }
                
                if (data) {
                    const { data: { publicUrl } } = supabase.storage.from(BUCKET_NAME).getPublicUrl(data.path);
                    return publicUrl;
                }
                return null;
            });

            const results = await Promise.allSettled(uploadPromises);
            
            const successfulUrls = results
                .filter((r): r is PromiseFulfilledResult<string | null> => r.status === 'fulfilled' && r.value !== null)
                .map(r => r.value as string);
                
            const firstError = results.find((r): r is PromiseRejectedResult => r.status === 'rejected');
            if (firstError) {
                setError(firstError.reason.message);
            }

            if (successfulUrls.length > 0) {
                const updatedUrls = [...previews, ...successfulUrls];
                setPreviews(updatedUrls);
                onUrlsChange(updatedUrls);
            }

        } catch (processError) {
            const errorMessage = processError instanceof Error ? processError.message : 'An unknown error occurred during image processing.';
            setError(errorMessage);
            console.error(processError);
        } finally {
            setIsUploading(false);
        }
    }, [previews, onUrlsChange]);

    const handleFileChange = useCallback(async (event: React.ChangeEvent<HTMLInputElement>) => {
        const files = event.target.files;
        if (files && files.length > 0) {
            await uploadFiles(Array.from(files));
        }
    }, [uploadFiles]);
    
    const handleDrop = useCallback(async (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove('border-violet-400');
        const files = event.dataTransfer.files;
        if (files && files.length > 0) {
            await uploadFiles(Array.from(files));
        }
    }, [uploadFiles]);

    const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.add('border-violet-400');
    };

    const handleDragLeave = (event: React.DragEvent<HTMLDivElement>) => {
        event.preventDefault();
        event.stopPropagation();
        event.currentTarget.classList.remove('border-violet-400');
    };

    const handleRemoveImage = (index: number) => {
        // Here we can also add logic to delete from Supabase if needed
        const newPreviews = [...previews];
        newPreviews.splice(index, 1);
        setPreviews(newPreviews);
        onUrlsChange(newPreviews);
    };

    return (
        <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Listing Images</label>
            <div 
                className="group relative border-2 border-dashed border-slate-300 rounded-lg p-6 text-center transition-colors"
                onDrop={handleDrop}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
            >
                <input
                    id="file-upload"
                    name="file-upload"
                    type="file"
                    multiple
                    className="sr-only"
                    onChange={handleFileChange}
                    accept="image/*"
                    disabled={isUploading}
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                    <PlusIcon className="mx-auto h-12 w-12 text-slate-400 group-hover:text-violet-500" />
                    <span className="mt-2 block text-sm font-semibold text-slate-600">
                        {isUploading ? 'Uploading...' : 'Drag & drop files or click to browse'}
                    </span>
                    <span className="block text-xs text-slate-500">PNG, JPG, WEBP accepted</span>
                </label>
            </div>
            {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            
            {previews.length > 0 && (
                <div className="mt-4 grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
                    {previews.map((src, index) => (
                        <div key={src} className="relative group aspect-square">
                            <img
                                src={src}
                                alt={`Preview ${index + 1}`}
                                className="w-full h-full object-cover rounded-md shadow-md"
                            />
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <button
                                    type="button"
                                    onClick={() => handleRemoveImage(index)}
                                    className="p-1.5 bg-white/80 text-red-600 rounded-full hover:bg-white"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};
