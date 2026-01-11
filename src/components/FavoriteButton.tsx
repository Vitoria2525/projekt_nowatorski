import React from 'react';

interface FavoriteButtonProps {
  isFavorite: boolean;
  onToggle: () => void;
}

const FavoriteButton: React.FC<FavoriteButtonProps> = ({ isFavorite, onToggle }) => {
  return (
    <button
      className={`favorite-btn ${isFavorite ? 'active' : ''}`}
      onClick={(e) => {
        e.stopPropagation();
        onToggle();
      }}
      title={isFavorite ? "Remove from favorites" : "Add to favorites"}
    >
      {isFavorite ? '★' : '☆'}
    </button>
  );
};

export default FavoriteButton;