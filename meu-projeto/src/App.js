import React, { useState, useRef, useCallback } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import  Favorites  from "./pages/Favorites";
import { useCardsInfinite } from "./hooks/useCardsInfinite";
import { CardDetails } from "./pages/CardDetails";
import { motion, AnimatePresence } from "framer-motion";
import "./index.css";

const queryClient = new QueryClient();

const cardTypes = [
  "Monster",
  "Spell",
  "Trap",
  "Fusion",
  "Synchro",
  "XYZ",
  "Link",
  "Pendulum",
];

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <AppContent />
    </QueryClientProvider>
  );
}

function AppContent() {
  const {
    data,
    fetchNextPage,
    hasNextPage,
    isFetchingNextPage,
    isLoading,
    isError,
    error,
  } = useCardsInfinite();

  const [selectedCard, setSelectedCard] = useState(null);
  const [showFavorites, setShowFavorites] = useState(false);
  const [favorites, setFavorites] = useState(
    JSON.parse(localStorage.getItem("favorites") || "[]")
  );
  const [filterType, setFilterType] = useState(null);
  const [showFilterMenu, setShowFilterMenu] = useState(false);

  const observer = useRef();
  const lastCardRef = useCallback(
    (node) => {
      if (isFetchingNextPage) return;
      if (observer.current) observer.current.disconnect();
      observer.current = new IntersectionObserver((entries) => {
        if (entries[0].isIntersecting && hasNextPage) fetchNextPage();
      });
      if (node) observer.current.observe(node);
    },
    [isFetchingNextPage, fetchNextPage, hasNextPage]
  );

  if (isLoading) return <div>Carregando cartas...</div>;
  if (isError) return <div>Erro: {error.message}</div>;

  // ⭐ FAVORITAR / DESFAVORITAR
  const toggleFavorite = (card) => {
    setFavorites((prev) => {
      const exists = prev.some((c) => c.id === card.id);
      let updated;

      if (exists) {
        updated = prev.filter((c) => c.id !== card.id);
      } else {
        updated = [...prev, card];
      }

      localStorage.setItem("favorites", JSON.stringify(updated));
      return updated;
    });
  };

  const filteredCards = filterType
    ? data.pages.flat().filter((c) => c.type.includes(filterType))
    : data.pages.flat();

  // ⭐ TELA DE FAVORITOS
  if (showFavorites) {
    return (
      <Favorites
        goBack={() => setShowFavorites(false)}
        favorites={favorites}
        onSelectCard={(card) => setSelectedCard(card)}
        onFavoriteChange={toggleFavorite}
      />
    );
  }

  // ⭐ TELA DE DETALHES DA CARTA
  if (selectedCard) {
    return (
      <CardDetails
        card={selectedCard}
        goBack={() => setSelectedCard(null)}
        onFavoriteChange={toggleFavorite}
        isFavorited={favorites.some((fav) => fav.id === selectedCard.id)}
      />
    );
  }

  // ⭐ LISTAGEM PRINCIPAL
  return (
    <div>
      <header className="app-header">
        <h1>Cartinhas de Yu-Gi-Oh</h1>
        <div className="header-buttons">
          <button
            className="favorites-btn"
            onClick={() => setShowFavorites(true)}
          >
            ❤️ Favoritos ({favorites.length})
          </button>

          <button
            className="filter-btn"
            onClick={() => setShowFilterMenu(!showFilterMenu)}
          >
            ☰
          </button>

          {showFilterMenu && (
            <div className="filter-menu">
              <h4>Filtrar por tipo</h4>
              <button onClick={() => setFilterType(null)}>Todos</button>
              {cardTypes.map((type) => (
                <button key={type} onClick={() => setFilterType(type)}>
                  {type}
                </button>
              ))}
            </div>
          )}
        </div>
      </header>

      <div className="card-grid">
        <AnimatePresence>
          {filteredCards.map((card, idx) => {
            const isLast = idx === filteredCards.length - 1;

            return (
              <motion.div
                key={card.id}
                ref={isLast ? lastCardRef : null}
                className="card"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.8 }}
                whileHover={{ scale: 1.05 }}
              >
                <div
                  className="card-img-container"
                  onClick={() => setSelectedCard(card)}
                >
                  <img
                    src={card.card_images[0].image_url_small}
                    alt={card.name}
                  />
                </div>

                <h2>{card.name}</h2>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </div>

      {isFetchingNextPage && <div>Carregando mais cartas...</div>}
    </div>
  );
}
