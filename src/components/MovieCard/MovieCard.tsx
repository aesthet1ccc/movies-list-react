import React from "react";

import style from "./MovieCard.module.scss";
import blank_poster from "./../../assets/blank-poster.svg";

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
}

interface MovieCardProps {
  movie: MovieData;
}

export const MovieCard: React.FC<MovieCardProps> = ({ movie }) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 8) return "#FFD700";
    if (rating > 7 && rating < 8) return "#28a745";
    if (rating > 4 && rating <= 7) return "#808080";
    if (rating <= 4 && rating > 0) return "#dc3545";
    return "#ccc";
  };

  return (
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
      </div>
      <h2 className={style.movie_title}>
        {movie.name || movie.alternativeName}
      </h2>
      <p className={style.movie_year}>Год выпуска: {movie.year || "—"}</p>
    </article>
  );
};
