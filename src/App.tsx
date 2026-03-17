import "./App.css";
import { Route, Routes } from "react-router";
import { BrowserRouter } from "react-router-dom";
import MoviesList from "./pages/MoviesList/MoviesList";
import MoviesDetails from "./pages/MovieDetails/MoviesDetails";
import FavoriteMovies from "./pages/FavoriteMovies/FavoriteMovies";
import Header from "./components/header/Header";

function App() {
  return (
    <BrowserRouter>
      <Header />
      <Routes>
        <Route index element={<MoviesList />} />
        <Route path="movies-details" element={<MoviesDetails />} /> //дать
        ссылку на информацию о фильме
        <Route path="favorite-movies" element={<FavoriteMovies />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
