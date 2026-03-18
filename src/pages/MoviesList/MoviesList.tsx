import { useEffect, useState, useRef } from "react";
import style from "./MoviesList.module.scss";
import axios from "axios";
import { MovieCard } from "../../components/MovieCard/MovieCard";
import type { MovieData } from "../../components/MovieCard/MovieCard";
import { GenresFilter } from "../../components/Filters/GenresFilter";

const MoviesList: React.FC = () => {
  const [selectedGenres, setSelectedGenres] = useState<string[]>([]);
  const [movies, setMovies] = useState<MovieData[]>([]);
  const [page, setPage] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const loaderRef = useRef<HTMLDivElement | null>(null);

  const handleGenreChange = (genre: string) => {
    setSelectedGenres((prev) =>
      prev.includes(genre) ? prev.filter((g) => g !== genre) : [...prev, genre],
    );
  };

  useEffect(() => {
    const fetchMovies = async () => {
      setIsLoading(true);
      try {
        const response = await axios.get("https://api.poiskkino.dev/v1/movie", {
          params: {
            token: "GRPWP14-BT4MP0Q-JCQF4P0-E6M17SM",
            limit: 50,
            page: page,
            "genres.name": selectedGenres,
          },
        });
        console.log(response.data.docs);

        const newMovies = response.data.docs;
        setMovies((prevMovies) => {
          const uniqueMovies = newMovies.filter(
            (newMovie: MovieData) =>
              !prevMovies.some((prev) => prev.id === newMovie.id),
          );
          return [...prevMovies, ...uniqueMovies];
        });
      } catch (error) {
        console.log("Ошибка при загрузке фильмов:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchMovies();
  }, [page]);

  useEffect(() => {
    setMovies([]);
    setPage(1);
  }, [selectedGenres]);

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && !isLoading) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { threshold: 1.0 },
    );

    if (loaderRef.current) {
      observer.observe(loaderRef.current);
    }

    return () => {
      if (loaderRef.current) observer.unobserve(loaderRef.current);
    };
  }, [isLoading]);

  return (
    <main className={style.main_container}>
      <div className={style.content_wrapper}>
        <aside className={style.sidebar}>
          <GenresFilter
            selectedGenres={selectedGenres}
            handleGenreChange={handleGenreChange}
          />
        </aside>
        <div className={style.movies_block}>
          {movies.map((movie) => (
            <MovieCard key={movie.id} movie={movie} />
          ))}
        </div>
        <div ref={loaderRef} style={{ height: "100px" }}></div>
      </div>
    </main>
  );
};
export default MoviesList;
