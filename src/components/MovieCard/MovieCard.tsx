import { useState } from "react";
import type { FC, MouseEvent } from "react";
import { Checkbox } from "@vkontakte/vkui";

import style from "./MovieCard.module.scss";
import heart from "../../assets/favourites-icon.svg";
import favorite_heart from "../../assets/active-heart.svg";
import blank_poster from "./../../assets/blank-poster.svg";
import { useComparison } from "../../Contexts/ComparisonContext/ComparisonContext";

export interface MovieData {
  id: number;
  name: string;
  alternativeName?: string;
  year: number;
  poster?: {
    url: string;
    previewUrl: string;
  };
  rating: {
    imdb: number;
  };
  genres: {
    name: string;
  }[];
  movieLength: number;
}

interface MovieCardProps {
  movie: MovieData;
}

const checkIsFavoriteInLocalStorage = (id: number) => {
  const saveInLocalStorage = JSON.parse(
    localStorage.getItem("favorites") || "[]",
  );
  return saveInLocalStorage.includes(id);
};

export const MovieCard: FC<MovieCardProps> = ({ movie }) => {
  const [isActiveModal, setIsActiveModal] = useState(false);
  const [isFavorite, setIsFavorite] = useState(() =>
    checkIsFavoriteInLocalStorage(movie.id),
  );

  const { movieComparisonList, handleAddToComparison } = useComparison();
  const isInComparison = movieComparisonList.some(
    (value) => value.id === movie.id,
  );

  const handleClickFavorite = (event: MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();

    if (isFavorite) {
      handleClickConfirmFavorite();
    } else {
      setIsActiveModal(true);
    }
  };

  const handleClickConfirmFavorite = () => {
    const localStorageData = localStorage.getItem("favorites") || "[]";
    const favorites: number[] = JSON.parse(localStorageData);

    let updateFavorites: number[];
    if (isFavorite) {
      updateFavorites = favorites.filter((id) => id !== movie.id);
    } else {
      updateFavorites = [...favorites, movie.id];
    }

    const stringifyData = JSON.stringify(updateFavorites);

    localStorage.setItem("favorites", stringifyData);
    setIsFavorite(!isFavorite);
    setIsActiveModal(false);
  };

  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "#35ff5a";
    if (rating > 7 && rating < 8) return "#28a745";
    if (rating > 4 && rating <= 7) return "#808080";
    if (rating <= 4 && rating > 0) return "#dc3545";
    return "#808080";
  };

  return (
    <>
      <article className={style.movie_card_block}>
        <div className={style.poster_wrapper}>
          <img
            className={style.poster}
            src={movie.poster?.url || movie.poster?.previewUrl || blank_poster}
            alt="movie poster"
            width={200}
            height={300}
          />
          <span
            className={style.rating}
            style={{ backgroundColor: getRatingColor(movie.rating.imdb || 0) }}
          >
            {movie.rating.imdb || "—"}
          </span>
          <div className={style.icons}>
            <div onClick={(event: MouseEvent) => event.stopPropagation()}>
              <Checkbox
                checked={isInComparison}
                onChange={() => handleAddToComparison(movie)}
                className={style.checkbox}
              />
            </div>
            <img
              className={style.favorite_icon}
              src={isFavorite ? favorite_heart : heart}
              alt="favorite icon"
              width={26}
              height={26}
              onClick={handleClickFavorite}
            />
          </div>
        </div>
        <h2 className={style.movie_title}>
          {movie.name || movie.alternativeName}
        </h2>
        <p className={style.movie_year}>Год: {movie.year || "—"}</p>
      </article>

      {isActiveModal && (
        <div
          className={style.modal_overlay}
          onClick={() => setIsActiveModal(false)}
        >
          <div
            className={style.modal_content}
            onClick={(e) => e.stopPropagation()}
          >
            <h3>Добавить в избранное?</h3>
            <p>Вы действительно хотите добавить фильм "{movie.name}"?</p>

            <div className={style.buttons}>
              <button
                className={style.btn_confirm}
                onClick={(event: MouseEvent) => {
                  event.preventDefault();
                  event.stopPropagation();
                  handleClickConfirmFavorite();
                }}
              >
                Да, добавить
              </button>
              <button
                className={style.btn_cancel}
                onClick={(event: MouseEvent) => {
                  event.preventDefault();
                  event.stopPropagation();
                  setIsActiveModal(false);
                }}
              >
                Отмена
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
