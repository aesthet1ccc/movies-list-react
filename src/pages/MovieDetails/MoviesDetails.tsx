import axios from "axios";
import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import blank_poster from "../../assets/blank-poster.svg";
import style from "./MovieDetails.module.scss";

interface MovieDetailFetch {
  id: number;
  name: string;
  alternativeName?: string;
  year: number;
  poster: {
    url: string;
    previewUrl: string;
  };
  rating: {
    imdb: number;
  };
  genres: {
    name: string;
  }[];
  description?: string;
  premiere?: {
    world?: string;
    russia?: string;
  };
}

const MoviesDetails = () => {
  const [movieDetail, setMovieDetail] = useState<MovieDetailFetch | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const { id } = useParams();

  const apiToken = import.meta.env.VITE_API_TOKEN;

  useEffect(() => {
    const fetchMovieDetails = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get(
          `https://api.poiskkino.dev/v1.4/movie/${id}`,
          {
            params: {
              token: apiToken,
            },
          },
        );
        setMovieDetail(response.data);
      } catch (error) {
        console.log("ошибка загрузки фильма", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovieDetails();
  }, [id]);

  if (isLoading) return <section>Загрузка...</section>;

  if (!movieDetail) return <section>Фильм не найден</section>;

  const genres = movieDetail.genres.map((genre) => genre.name).join(", ");

  const unreadyDate =
    movieDetail.premiere?.russia || movieDetail.premiere?.world;
  const date = unreadyDate
    ? new Date(unreadyDate).toLocaleDateString("ru-RU")
    : "неизвестна";

  return (
    <section className={style.movie_detail_block}>
      <img
        src={
          movieDetail.poster?.url ||
          movieDetail.poster?.previewUrl ||
          blank_poster
        }
        alt="movie poster"
        width={350}
        height={500}
        className={style.poster}
      />
      <div className={style.movie_info_block}>
        <h1>{movieDetail.name || movieDetail?.alternativeName}</h1>
        <p>
          <b>Описание: </b>
          {movieDetail.description || "Нет описания"}
        </p>
        <p>
          <b> Рейтинг фильма: </b>
          {movieDetail?.rating.imdb || "Рейтинг отсутствует"}
        </p>
        <p>
          <b>Дата выхода: </b>
          {date}
        </p>
        <p>
          <b>Жанр: </b> {genres}
        </p>
      </div>
    </section>
  );
};
export default MoviesDetails;
