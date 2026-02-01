// Utility functions for managing localStorage data
import { SignageData } from '../types/signage';

export interface RecentSignage {
  id: string;
  type: 'safety' | 'identification' | 'authorized' | 'emergency' | 'custom';
  title: string;
  category: string;
  timestamp: number;
  thumbnail?: string;
}

// Full saved signage with complete data
export interface SavedSignage {
  id: string;
  type: 'safety' | 'identification' | 'authorized' | 'emergency' | 'custom';
  title: string;
  category: string;
  timestamp: number;
  lastModified: number;
  thumbnail?: string;
  signageData?: SignageData; // Full SignageData for regular signage
  customEditorData?: {
    elements: any[]; // CanvasElement[] from CustomSignageEditor
    canvasWidth: number;
    canvasHeight: number;
    canvasBackground: string;
    backgroundImage?: string | null;
  }; // Custom editor data
  identificationData?: {
    areaName: string;
    icon: string;
    bgColor: string;
    textColor: string;
    iconBgColor: string;
    showHeader: boolean;
    headerText: string;
    showFooter: boolean;
    footerText: string;
    showImage: boolean;
    uploadedImage: string;
    imagePosition: 'top' | 'center' | 'bottom' | 'background';
    imageSize: number;
    imageOpacity: number;
    fontSize: number;
    iconSize: number;
    paperSize: 'a4' | 'a3' | 'letter' | 'square';
    orientation: 'landscape' | 'portrait';
    borderRadius: number;
    showBorder: boolean;
    borderColor: string;
    borderWidth: number;
    iconPosition: { x: number; y: number };
    textPosition: { x: number; y: number };
  }; // Identification signage data
}

// Save recent signage
export function saveRecentSignage(signage: RecentSignage): void {
  try {
    const existing = getRecentSignages();
    const updated = [signage, ...existing.filter(s => s.id !== signage.id)].slice(0, 20); // Keep last 20
    localStorage.setItem('recentSignages', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('signagesUpdated'));
  } catch (error) {
    console.error('Error saving recent signage:', error);
  }
}

// Get recent signages
export function getRecentSignages(): RecentSignage[] {
  try {
    const data = localStorage.getItem('recentSignages');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading recent signages:', error);
    return [];
  }
}

// Save uploaded image
export function saveUploadedImage(imageData: string): void {
  try {
    const existing = getUploadedImages();
    const updated = [imageData, ...existing].slice(0, 50); // Keep last 50
    localStorage.setItem('uploadedImages', JSON.stringify(updated));
    window.dispatchEvent(new CustomEvent('imagesUpdated'));
  } catch (error) {
    console.error('Error saving uploaded image:', error);
  }
}

// Get uploaded images
export function getUploadedImages(): string[] {
  try {
    const data = localStorage.getItem('uploadedImages');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading uploaded images:', error);
    return [];
  }
}

// Toggle favorite template
export function toggleFavoriteTemplate(templateId: string): boolean {
  try {
    const favorites = getFavoriteTemplates();
    const newFavorites = favorites.includes(templateId)
      ? favorites.filter(id => id !== templateId)
      : [...favorites, templateId];
    localStorage.setItem('favoriteTemplates', JSON.stringify(newFavorites));
    window.dispatchEvent(new CustomEvent('favoritesUpdated'));
    return newFavorites.includes(templateId);
  } catch (error) {
    console.error('Error toggling favorite:', error);
    return false;
  }
}

// Get favorite templates
export function getFavoriteTemplates(): string[] {
  try {
    const data = localStorage.getItem('favoriteTemplates');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading favorites:', error);
    return [];
  }
}

// Check if template is favorite
export function isFavoriteTemplate(templateId: string): boolean {
  return getFavoriteTemplates().includes(templateId);
}

// Clear all data
export function clearAllData(): void {
  localStorage.removeItem('recentSignages');
  localStorage.removeItem('uploadedImages');
  localStorage.removeItem('favoriteTemplates');
  window.dispatchEvent(new CustomEvent('storageCleared'));
}

// Get storage statistics
export function getStorageStats() {
  return {
    signages: getRecentSignages().length,
    images: getUploadedImages().length,
    favorites: getFavoriteTemplates().length,
    totalSize: new Blob([JSON.stringify(localStorage)]).size
  };
}

// Save full signage data to library
export function saveSignageToLibrary(signage: SavedSignage): string {
  try {
    const existing = getSavedSignages();
    // If updating existing, remove old one
    const filtered = existing.filter(s => s.id !== signage.id);
    const updated = [signage, ...filtered];
    localStorage.setItem('savedSignagesLibrary', JSON.stringify(updated));
    
    // Also update recent signages for quick access
    const recentSignage: RecentSignage = {
      id: signage.id,
      type: signage.type,
      title: signage.title,
      category: signage.category,
      timestamp: signage.timestamp,
      thumbnail: signage.thumbnail
    };
    saveRecentSignage(recentSignage);
    
    window.dispatchEvent(new CustomEvent('signagesUpdated'));
    window.dispatchEvent(new CustomEvent('libraryUpdated'));
    return signage.id;
  } catch (error) {
    console.error('Error saving signage to library:', error);
    throw error;
  }
}

// Get all saved signages from library
export function getSavedSignages(): SavedSignage[] {
  try {
    const data = localStorage.getItem('savedSignagesLibrary');
    return data ? JSON.parse(data) : [];
  } catch (error) {
    console.error('Error loading saved signages:', error);
    return [];
  }
}

// Get a specific saved signage by ID
export function getSavedSignageById(id: string): SavedSignage | null {
  try {
    const signages = getSavedSignages();
    return signages.find(s => s.id === id) || null;
  } catch (error) {
    console.error('Error loading signage by ID:', error);
    return null;
  }
}

// Delete a saved signage from library
export function deleteSavedSignage(id: string): boolean {
  try {
    const existing = getSavedSignages();
    const updated = existing.filter(s => s.id !== id);
    localStorage.setItem('savedSignagesLibrary', JSON.stringify(updated));
    
    // Also remove from recent signages
    const recent = getRecentSignages();
    const updatedRecent = recent.filter(s => s.id !== id);
    localStorage.setItem('recentSignages', JSON.stringify(updatedRecent));
    
    window.dispatchEvent(new CustomEvent('signagesUpdated'));
    window.dispatchEvent(new CustomEvent('libraryUpdated'));
    return true;
  } catch (error) {
    console.error('Error deleting signage:', error);
    return false;
  }
}

// Generate a unique ID for signage
export function generateSignageId(): string {
  return `signage_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}
