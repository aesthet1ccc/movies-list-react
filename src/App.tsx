import "./App.css";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import MoviesList from "./pages/MoviesList/MoviesList";
import MoviesDetails from "./pages/MovieDetails/MoviesDetails";
import FavoriteMovies from "./pages/FavoriteMovies/FavoriteMovies";
import Header from "./components/header/Header";
import { ComparisonProvider } from "../src/Contexts/ComparisonContext/ComparisonContext";

function App() {
  return (
    <BrowserRouter>
      <ComparisonProvider>
        <Header />
        <Routes>
          <Route index element={<MoviesList />} />
          <Route path="/movies-details/:id" element={<MoviesDetails />} />
          <Route path="favorite-movies" element={<FavoriteMovies />} />
        </Routes>
      </ComparisonProvider>
    </BrowserRouter>
  );
}

export default App;
