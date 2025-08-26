import { useState, useEffect, useLayoutEffect } from "react";
import { useDebounce } from "use-debounce";
import "./App.css";
import Search from "./components/Search";
import Spinner from "./components/Spinner";
import MovieCard from "./components/MovieCard";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const API_OPTION = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

function App() {
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [movieList, setMovieList] = useState([]);
  const [debouncedSearch] = useDebounce(search, 500);

  console.log("search", search);
  console.log("debouncedSearch", debouncedSearch);
  const fetchMovies = async (query) => {
    setIsLoading(true);
    try {
      const endpoint = query
        ? `${BASE_URL}/search/movie?query=${encodeURIComponent(query)}`
        : `${BASE_URL}/discover/movie?sort_by=popularity.desc`;
      const response = await fetch(endpoint, API_OPTION);
      if (!response.ok) {
        throw new Error("Fail to fetch movies");
      }
      const data = await response.json();
      setMovieList(data.results || []);
    } catch (error) {
      console.error(setErrorMsg(`Failed to fetch movies: ${error.message}`));
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchMovies(debouncedSearch);
  }, [debouncedSearch]);
  return (
    <main>
      <div className="pattern" />
      <img src="./BG.png" className="absolute" alt="Hero Background" />
      <div className="wrapper">
        <header>
          <img src="./hero-img.png" alt="Hero Banner" />
          <h1 className="">
            Find <span className="text-gradient">Movie</span> You'll Enjoy
            without Hassle
          </h1>
          <Search search={search} setSearch={setSearch} />
        </header>
        <section className="all-movies">
          <h2 className="mt-[40px]">All Movies</h2>

          {isLoading ? (
            <Spinner />
          ) : errorMsg ? (
            <p className="text-red-500">{errorMsg}</p>
          ) : (
            <ul>
              {movieList.map((movie) => (
                <MovieCard key={movie.id} movie={movie} />
              ))}
            </ul>
          )}
        </section>
      </div>
    </main>
  );
}

export default App;
