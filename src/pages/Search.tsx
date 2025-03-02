
import React, { useState, useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { useMedia } from '@/context/MediaContext';
import MediaCard from '@/components/ui/MediaCard';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search as SearchIcon, X } from 'lucide-react';

const Search = () => {
  const [query, setQuery] = useState('');
  const [debouncedQuery, setDebouncedQuery] = useState('');
  const { searchMedia } = useMedia();
  
  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedQuery(query);
    }, 300);
    
    return () => clearTimeout(timer);
  }, [query]);
  
  const filteredMedias = searchMedia(debouncedQuery);
  
  const handleClear = () => {
    setQuery('');
  };
  
  return (
    <MainLayout>
      <div className="page-container">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Search</h1>
          <p className="text-muted-foreground">
            Find media shared by your friends
          </p>
        </div>
        
        <div className="relative mb-8">
          <Input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Search by title, description or tags..."
            className="pr-20"
          />
          
          {query && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-10 top-0 h-full"
              onClick={handleClear}
            >
              <X size={16} />
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="icon"
            className="absolute right-0 top-0 h-full"
          >
            <SearchIcon size={16} />
          </Button>
        </div>
        
        {query && (
          <p className="mb-4 text-sm text-muted-foreground">
            Found {filteredMedias.length} results for "{query}"
          </p>
        )}
        
        {filteredMedias.length === 0 ? (
          <div className="text-center py-12">
            <div className="mx-auto w-16 h-16 rounded-full bg-muted flex items-center justify-center mb-4">
              <SearchIcon size={24} className="text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No results found</h2>
            <p className="text-muted-foreground">
              {query ? "Try a different search term or tag" : "Enter a search term to find media"}
            </p>
          </div>
        ) : (
          <div className="media-grid">
            {filteredMedias.map(media => (
              <MediaCard key={media.id} media={media} />
            ))}
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default Search;
