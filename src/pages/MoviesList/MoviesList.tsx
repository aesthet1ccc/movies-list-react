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

interface MovieCursorResponse {
  docs: MovieData[];
  total: number | null;
  limit: number;
  next: string | null;
  prev: string | null;
  hasNext: boolean;
  hasPrev: boolean;
}

const MoviesList: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const { ref, inView } = useInView();

  const genres = searchParams.getAll("genre");
  const yearFrom = searchParams.get("yearFrom") || "";
  const yearTo = searchParams.get("yearTo") || "";
  const ratingFrom = searchParams.get("ratingFrom") || "";
  const ratingTo = searchParams.get("ratingTo") || "";

  const yFrom = Number(yearFrom) || 1990;
  const yTo = Number(yearTo) || 2030;
  const rFrom = Number(ratingFrom) || 0;
  const rTo = Number(ratingTo) || 10;

  const genresKey = [...genres].sort();
  const apiToken = import.meta.env.VITE_API_TOKEN;

  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, status } =
    useInfiniteQuery({
      refetchOnWindowFocus: false,
      queryKey: ["movies-infinite-cursor", genresKey, yFrom, yTo, rFrom, rTo],
      queryFn: async ({ pageParam }: { pageParam?: string }) => {
        const params: Record<string, unknown> = {
          token: apiToken,
          limit: 50,
          year: `${yFrom}-${yTo}`,
          "rating.imdb": `${rFrom}-${rTo}`,
        };

        if (genresKey.length > 0) {
          params["genres.name"] = genresKey.map((g) => `+${g}`);
        }
        if (pageParam) {
          params.next = pageParam;
        }

        const res = await axios.get("https://api.poiskkino.dev/v1.5/movie", {
          params,
        });

        return res.data as MovieCursorResponse;
      },
      initialPageParam: undefined as string | undefined,
      getNextPageParam: (lastPage) =>
        lastPage.hasNext ? (lastPage.next ?? undefined) : undefined,
    });

  useEffect(() => {
    if (inView && hasNextPage && !isFetchingNextPage) {
      fetchNextPage();
    }
  }, [inView, hasNextPage, isFetchingNextPage, fetchNextPage]);

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

    const isYearMatch = movie.year >= yFrom && movie.year <= yTo;

    const currentRating = movie.rating?.imdb ?? 0;
    const isRatingMatch = currentRating >= rFrom && currentRating <= rTo;

    return isGenreMatch && isYearMatch && isRatingMatch;
  });

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
          {status === "pending" && <div>Загрузка...</div>}
          {status === "success" && (
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
              <div ref={ref} className={style.loader_trigger}>
                {isFetchingNextPage
                  ? "Загружаем еще..."
                  : hasNextPage
                    ? ""
                    : "Вы просмотрели все фильмы"}
              </div>
            </div>
          )}
        </section>
      </div>
    </main>
  );
};

export default MoviesList;
