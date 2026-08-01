'use client';
import React from 'react';
import { Heart, ArrowLeftRight } from 'lucide-react';
import { toast } from 'sonner';
import EmptyState from '@/components/ui/EmptyState';

export default function FavoritesClient() {
  // Mock favorites data with realistic placeholder colors instead of images
  const favorites = [
    {
      id: 1,
      title: 'Vintage Levi\'s 501 Jeans',
      brand: 'Levi\'s',
      size: '28',
      value: 45,
      color: '#4A90A4', // Blue denim color
      owner: 'Maya Alvarez',
      location: 'Portland, OR',
    },
    {
      id: 2,
      title: 'Zara Floral Summer Dress',
      brand: 'Zara',
      size: 'M',
      value: 35,
      color: '#E8B4B8', // Pink floral color
      owner: 'Sarah Chen',
      location: 'Seattle, WA',
    },
    {
      id: 3,
      title: 'Nike Air Max 90',
      brand: 'Nike',
      size: '8',
      value: 65,
      color: '#2C3E50', // Dark sneaker color
      owner: 'James Wilson',
      location: 'Portland, OR',
    },
  ];

  const handleRemoveFavorite = (id: number) => {
    // BACKEND INTEGRATION: DELETE /api/favorites/:id
    toast.success('Removed from favorites');
  };

  return (
    <div className="fade-in">
      <div className="mb-6">
        <h1 className="text-2xl font-700 text-foreground mb-1">My Favorites</h1>
        <p className="text-sm text-muted-foreground">
          {favorites.length} item{favorites.length !== 1 ? 's' : ''} saved
        </p>
      </div>

      {favorites.length === 0 ? (
        <EmptyState
          icon={Heart}
          title="No favorites yet"
          description="Start browsing listings and save items you love by clicking the heart icon."
          actionLabel="Browse Listings"
          onAction={() => window.location.href = '/clothing-listings-page'}
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favorites.map((item) => (
            <div key={item.id} className="bg-card rounded-2xl border border-border overflow-hidden hover:shadow-card transition-all duration-200 group">
              <div className="aspect-square relative" style={{ backgroundColor: item.color }}>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white/80 text-xs font-500 text-center px-2">{item.brand}</span>
                </div>
                <button
                  onClick={() => handleRemoveFavorite(item.id)}
                  className="absolute top-3 right-3 w-8 h-8 rounded-full bg-card/80 backdrop-blur-sm flex items-center justify-center hover:bg-card transition-colors"
                  aria-label="Remove from favorites"
                >
                  <Heart size={16} className="fill-negative text-negative" />
                </button>
              </div>
              <div className="p-4">
                <p className="text-sm font-600 text-foreground mb-1 truncate">{item.title}</p>
                <p className="text-xs text-muted-foreground mb-2">{item.brand} · Size {item.size}</p>
                <div className="flex items-center justify-between">
                  <p className="text-sm font-600 text-primary">₹{item.value}</p>
                  <button className="text-xs font-500 text-muted-foreground hover:text-foreground transition-colors">
                    View details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
