import { useState } from "react";
import { Popover, Group, InfoRow, Headline, Flex } from "@vkontakte/vkui";

import { useComparison } from "../../Contexts/ComparisonContext/ComparisonContext";
import type { MovieData } from "../MovieCard/MovieCard";

export const ComparisonMovies = () => {
  const [shown, setShown] = useState(false);
  const { movieComparisonList } = useComparison();

  const movie1: MovieData = movieComparisonList[0];
  const movie2: MovieData = movieComparisonList[1];

  if (!movie1 || !movie2) {
    return <div>Сравнение</div>;
  }

  const genresStringMovie1 =
    movie1.genres.map((value) => value.name).join(", ") || "Жанр не указан";

  const genresStringMovie2 =
    movie2.genres.map((value) => value.name).join(", ") || "Жанр не указан";

  const movie1Len = movie1.movieLength
    ? `${movie1.movieLength} минут`
    : "неизвестно";
  const movie2Len = movie2.movieLength
    ? `${movie2.movieLength} минут`
    : "неизвестно";

  const movie1Rating = movie1.rating.imdb === 0 ? "—" : movie1.rating.imdb;
  const movie2Rating = movie2.rating.imdb === 0 ? "—" : movie2.rating.imdb;

  return (
    <div>
      <Popover
        shown={shown}
        onShownChange={setShown}
        content={
          <Group mode="plain">
            <div style={{ padding: "12px", width: 320 }}>
              <Headline
                level="2"
                weight="2"
                style={{ marginBottom: 12, textAlign: "center" }}
              >
                Сравнение
              </Headline>

              <Flex gap="m" align="start">
                <Flex direction="column" gap="s" style={{ flex: 1 }}>
                  <InfoRow header="Название">
                    {movie1.name || movie1.alternativeName}
                  </InfoRow>
                  <InfoRow header="Год">{movie1.year}</InfoRow>
                  <InfoRow header="Рейтинг">{movie1Rating}</InfoRow>
                  <InfoRow header="Жанр">{genresStringMovie1}</InfoRow>
                  <InfoRow header="Длительность">{movie1Len}</InfoRow>
                </Flex>

                <div
                  style={{
                    width: 1,
                    backgroundColor: "var(--vkui--color_separator_primary)",
                    alignSelf: "stretch",
                  }}
                />

                <Flex direction="column" gap="s" style={{ flex: 1 }}>
                  <InfoRow header="Название">
                    {movie2.name || movie2.alternativeName}
                  </InfoRow>
                  <InfoRow header="Год">
                    {movie2.year || "Год не указан"}
                  </InfoRow>
                  <InfoRow header="Рейтинг">{movie2Rating}</InfoRow>
                  <InfoRow header="Жанр">{genresStringMovie2}</InfoRow>
                  <InfoRow header="Длительность">{movie2Len}</InfoRow>
                </Flex>
              </Flex>
            </div>
          </Group>
        }
      >
        <span
          style={{
            cursor: "pointer",
            fontWeight: 500,
            padding: "0 4px",
          }}
          onClick={() => setShown(true)}
        >
          Сравнение
        </span>
      </Popover>
    </div>
  );
};
