import { useState, useEffect } from "react";
import { useDebounce } from "use-debounce";
import Search from "../components/Search";
import MovieCard from "../components/MovieCard";
import Spinner from "../components/Spinner";
import { getMoviesFromDb, updateSearchCount } from "../appwrite";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const API_OPTION = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const Home = () => {
  const [search, setSearch] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [movieList, setMovieList] = useState([]);
  const [trendingMovieList, setTrendingMovieList] = useState([]);
  const [debouncedSearch] = useDebounce(search, 1000);

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
      if (query && data.results.length > 0) {
        await updateSearchCount(query, data.results[0]);
      }
    } catch (error) {
      console.error(setErrorMsg(`Failed to fetch movies: ${error.message}`));
    } finally {
      setIsLoading(false);
    }
  };
  const fetchTrendingMovies = async () => {
    try {
      const trending = await getMoviesFromDb();
      setTrendingMovieList(trending || []);
    } catch (error) {}
  };
  useEffect(() => {
    fetchMovies(debouncedSearch);
  }, [debouncedSearch]);

  useEffect(() => {
    fetchTrendingMovies();
  }, []);

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
        {trendingMovieList.length > 0 && (
          <section className="trending">
            <h2>Trending Movies</h2>
            <ul>
              {trendingMovieList.map((trendingMovie, index) => (
                <li key={trendingMovie.$id}>
                  <p>{index + 1}</p>
                  <img src={trendingMovie.poster_url} alt="trending movie" />
                </li>
              ))}
            </ul>
          </section>
        )}
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
};

export default Home;
