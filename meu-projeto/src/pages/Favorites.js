import React from "react";

export default function Favorites({ favorites, onSelectCard, onFavoriteChange, goBack }) {
  return (
    <div className="favorites-container">
      <h2>⭐ Meus Favoritos</h2>

      {favorites.length === 0 ? (
        <p>Nenhum favorito ainda.</p>
      ) : (
        <div className="favorites-grid">
          {favorites.map((card) => (
            <div key={card.id} className="favorite-card">
              
              {/* IMAGEM */}
              <img
                src={card.card_images?.[0]?.image_url_small || card.images?.small}
                alt={card.name}
                className="favorite-card-img"
                onClick={() => onSelectCard(card)}
              />

              {/* NOME */}
              <h3>{card.name}</h3>

              {/* BOTÕES */}
              <div className="fav-btn-group">

                <button
                  className="fav-remove-btn"
                  onClick={() => onFavoriteChange(card)}
                >
                  Remover
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* BOTÃO VOLTAR */}
      <button className="back-button" onClick={goBack}>
         Voltar
      </button>
    </div>
  );
}
