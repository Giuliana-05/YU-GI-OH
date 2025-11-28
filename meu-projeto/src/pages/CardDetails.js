import React, { useEffect, useState } from "react";
import "./CardDetails.css";

export function CardDetails({ card, goBack, onFavoriteChange, isFavorited }) {
  const [translatedDesc, setTranslatedDesc] = useState("");

  const hasAtkDef = card.atk !== undefined || card.def !== undefined;

  const translateToPortuguese = async (text) => {
    try {
      const res = await fetch(
        `https://api.mymemory.translated.net/get?q=${encodeURIComponent(
          text
        )}&langpair=en|pt`
      );
      const data = await res.json();
      return data.responseData.translatedText;
    } catch {
      return text;
    }
  };

  useEffect(() => {
    if (card.desc) translateToPortuguese(card.desc).then(setTranslatedDesc);
  }, [card.desc]);

  const cardEffect = translatedDesc || "Sem descrição.";

  const cardUsage = () => {
    const type = card.type?.toLowerCase() || "";
    if (type.includes("monster"))
      return "Use para atacar ou defender. Combina bem com cartas de suporte.";
    if (type.includes("spell"))
      return "Use para alterar o campo ou fortalecer cartas. Estratégico em combos.";
    if (type.includes("trap"))
      return "Use para surpreender o adversário. Coloque estrategicamente.";
    return "Use conforme efeito da carta.";
  };

  const imageUrl =
    card.card_images && card.card_images.length > 0
      ? card.card_images[0].image_url
      : null;

  return (
    <div className="card-details-container">
      <div className="card-details-main">
        <h2>{card.name}</h2>
        <div className="card-details-content">
          <div className="card-image-container">
            {imageUrl ? (
              <img className="card-image" src={imageUrl} alt={card.name} />
            ) : (
              <div className="no-image">Sem imagem</div>
            )}

            {/* Botão de favoritos */}
            <button
            className={`favorite-btn ${isFavorited ? "favorited" : "not-favorited"}`}
            onClick={() => onFavoriteChange(card)}
            >
            ❤️
            </button>

          </div>

          <div className="card-subcards">
            <div className="subcard">
              <h3>Tipo</h3>
              <p>{card.type || "Desconhecido"}</p>
              {hasAtkDef && (
                <>
                  <p>
                    <strong>Ataque:</strong> {card.atk ?? "?"}
                  </p>
                  <p>
                    <strong>Defesa:</strong> {card.def ?? "?"}
                  </p>
                </>
              )}
            </div>

            <div className="subcard">
              <h3>Descrição</h3>
              <p>{cardEffect}</p>
            </div>

            <div className="subcard">
              <h3>Como usar</h3>
              <p>{cardUsage()}</p>
            </div>
          </div>
        </div>

        <button className="back-button" onClick={goBack}>
          Voltar
        </button>
      </div>
    </div>
  );
}
