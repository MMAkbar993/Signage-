// Utility functions for managing localStorage data

export interface RecentSignage {
  id: string;
  type: 'safety' | 'identification' | 'authorized' | 'emergency';
  title: string;
  category: string;
  timestamp: number;
  thumbnail?: string;
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
