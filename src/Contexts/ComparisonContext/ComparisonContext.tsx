import { createContext, useContext, useState, type ReactNode } from "react";

import type { MovieData } from "../../components/MovieCard/MovieCard";

interface ComparisonContextType {
  movieComparisonList: MovieData[];
  handleAddToComparison: (movie: MovieData) => void;
}

const ComparisonContext = createContext<ComparisonContextType | undefined>(
  undefined,
);

export const ComparisonProvider = ({ children }: { children: ReactNode }) => {
  const [movieComparisonList, setMovieComparisonList] = useState<MovieData[]>(
    [],
  );

  const handleAddToComparison = (movie: MovieData) => {
    setMovieComparisonList((prev) => {
      const isAdded = prev.some((value) => value.id === movie.id);
      if (isAdded) {
        return prev.filter((value) => value.id !== movie.id);
      }
      if (prev.length >= 2) {
        return [...prev.slice(1), movie];
      }

      return [...prev, movie];
    });
  };

  return (
    <ComparisonContext.Provider
      value={{ movieComparisonList, handleAddToComparison }}
    >
      {children}
    </ComparisonContext.Provider>
  );
};

export const useComparison = () => {
  const context = useContext(ComparisonContext);
  if (!context)
    throw new Error("useComparison должен использоваться внутри Provider");
  return context;
};
