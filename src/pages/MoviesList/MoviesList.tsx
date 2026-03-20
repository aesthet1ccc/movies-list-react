import { useEffect } from "react";
import { useInfiniteQuery } from "@tanstack/react-query";
import { useSearchParams, Link } from "react-router-dom";
import axios from "axios";
import { useInView } from "react-intersection-observer";

import { MovieCard } from "../../components/MovieCard/MovieCard";
import type { MovieData } from "../../components/MovieCard/MovieCard";
import { GenresFilter } from "../../components/Filters/GenresFilter";
import { YearsFilter } from "../../components/Filters/YearsFilter";
import { RatingFilter } from "../../components/Filters/RatingFilter";

import style from "./MoviesList.module.scss";

interface MovieResponse {
  docs: MovieData[];
  total: number;
  limit: number;
  page: number;
  pages: number;
}

const MoviesList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  // const { ref, inView } = useInView();

  const genres = searchParams.getAll("genre");
  const yearFrom = searchParams.get("yearFrom") || "";
  const yearTo = searchParams.get("yearTo") || "";
  const ratingFrom = searchParams.get("ratingFrom") || "";
  const ratingTo = searchParams.get("ratingTo") || "";

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      queryKey: ["movies-infinite"],
      queryFn: async ({ pageParam = 1 }): Promise<MovieResponse> => {
        const res = await axios.get("https://api.poiskkino.dev/v1/movie", {
          params: {
            token: import.meta.env.VITE_API_TOKEN,
            limit: 50,
            page: pageParam,
          },
        });
        return res.data;
      },
      initialPageParam: 1,
      getNextPageParam: (lastPage) =>
        lastPage.page < lastPage.pages ? lastPage.page + 1 : undefined,
    });

  // useEffect(() => {
  //   if (inView && hasNextPage && !isFetchingNextPage) {
  //     fetchNextPage();
  //   }
  // }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

  const handleGenreChange = (genre: string) => {
    setSearchParams(
      (prev) => {
        const currentGenres = prev.getAll("genre");
        if (currentGenres.includes(genre)) {
          const updated = currentGenres.filter((g) => g !== genre);
          prev.delete("genre");
          updated.forEach((g) => prev.append("genre", g));
        } else {
          prev.append("genre", genre);
        }
        return prev;
      },
      { replace: true },
    );
  };

  const handleYearsChange = (from: string, to: string) => {
    setSearchParams(
      (prev) => {
        from ? prev.set("yearFrom", from) : prev.delete("yearFrom");
        to ? prev.set("yearTo", to) : prev.delete("yearTo");
        return prev;
      },
      { replace: true },
    );
  };

  const handleRatingChange = (from: string, to: string) => {
    setSearchParams(
      (prev) => {
        from ? prev.set("ratingFrom", from) : prev.delete("ratingFrom");
        to ? prev.set("ratingTo", to) : prev.delete("ratingTo");
        return prev;
      },
      { replace: true },
    );
  };

  const allMovies: MovieData[] = data?.pages.flatMap((page) => page.docs) || [];

  const filteredMovies = allMovies.filter((movie) => {
    const isGenreMatch =
      genres.length === 0 || movie.genres.some((g) => genres.includes(g.name));

    const yFrom = Number(yearFrom) || 1990;
    const yTo = Number(yearTo) || 2030;
    const isYearMatch = movie.year >= yFrom && movie.year <= yTo;

    const rFrom = Number(ratingFrom) || 0;
    const rTo = Number(ratingTo) || 10;
    const currentRating = movie.rating?.imdb ?? 0;
    const isRatingMatch = currentRating >= rFrom && currentRating <= rTo;

    return isGenreMatch && isYearMatch && isRatingMatch;
  });

  if (status === "pending") return <div>Загрузка...</div>;
  if (status === "error") return <div>Ошибка при загрузке данных</div>;

  return (
    <main className={style.main_container}>
      <div className={style.content_wrapper}>
        <aside className={style.sidebar}>
          <GenresFilter
            selectedGenres={genres}
            handleGenreChange={handleGenreChange}
          />
          <YearsFilter
            onApply={handleYearsChange}
            initialFrom={yearFrom}
            initialTo={yearTo}
          />
          <RatingFilter
            handleFilterRating={handleRatingChange}
            initialFrom={ratingFrom}
            initialTo={ratingTo}
          />
        </aside>
        <section className={style.movies_section}>
          <div className={style.movies_block}>
            {filteredMovies.map((movie) => (
              <Link
                to={`/movies-details/${movie.id}`}
                key={movie.id}
                className={style.link}
              >
                <MovieCard movie={movie} />
              </Link>
            ))}
          </div>

          {/* <div ref={ref} className={style.loader_trigger}>
            {isFetchingNextPage
              ? "Загружаем еще..."
              : hasNextPage
                ? ""
                : "Вы просмотрели все фильмы"}
          </div> */}
        </section>
      </div>
    </main>
  );
};

export default MoviesList;
