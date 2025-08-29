import React from "react";
import { Link } from "react-router-dom";

const MovieCard = ({
  movie: {
    title,
    vote_average,
    release_date,
    original_language,
    poster_path,
    id,
  },
}) => {
  return (
    <Link to={`/movie/${id}`} className="movie-card">
      <img
        src={
          poster_path
            ? `https://image.tmdb.org/t/p/w500/${poster_path}`
            : "/no-poster.png"
        }
        alt={title}
      />
      <div className="mt-3">
        <h3>{title}</h3>
        <div className="content">
          <div className="rating">
            <img src="/rating.svg" alt="" />
            <p>{vote_average ? vote_average.toFixed(1) : "N/A"}</p>
          </div>
          <span>•</span>
          <p className="lang">{original_language}</p>
          <span>•</span>
          <p className="year">
            {release_date ? release_date.split("-")[0] : "N/A"}
          </p>
        </div>
      </div>
    </Link>
  );
};

export default MovieCard;
