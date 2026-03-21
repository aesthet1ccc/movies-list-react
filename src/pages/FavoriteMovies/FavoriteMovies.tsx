import axios from "axios";
import { useEffect, useState, type FC } from "react";

import {
  MovieCard,
  type MovieData,
} from "../../components/MovieCard/MovieCard";
import style from "./FavoriteMovies.module.scss";

const FavoriteMovies: FC = () => {
  const [favoriteMovies, setFavoriteMovies] = useState<MovieData[]>([]);

  useEffect(() => {
    const idInLocalStorage: number[] = JSON.parse(
      localStorage.getItem("favorites") || "[]",
    );

    const fetchFavoriteMovies = async () => {
      if (idInLocalStorage.length === 0) {
        return [];
      }

      const apiToken = import.meta.env.VITE_API_TOKEN;

      try {
        const queryParams = idInLocalStorage.map((id) => `id=${id}`).join("&");
        console.log(queryParams);

        const response = await axios.get(
          `https://api.poiskkino.dev/v1/movie?${queryParams}`,
          {
            params: {
              token: apiToken,
            },
          },
        );

        setFavoriteMovies(response.data.docs);
      } catch (error) {
        console.log("error", error);
      }
    };

    fetchFavoriteMovies();
  }, []);

  return (
    <section className={style.section_favorite}>
      <h1 className={style.favorite_title}>Избранное</h1>
      <div className={style.favorite_movies_block}>
        {favoriteMovies.map((movie) => (
          <MovieCard key={movie.id} movie={movie} />
        ))}
      </div>
    </section>
  );
};

export default FavoriteMovies;
