import React, { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import Spinner from "../components/Spinner";
import YouTube from "react-youtube";
import YoutubeCard from "../components/YoutubeCard";

const API_KEY = import.meta.env.VITE_TMDB_API_KEY;
const BASE_URL = "https://api.themoviedb.org/3";

const API_OPTION = {
  method: "GET",
  headers: {
    accept: "application/json",
    Authorization: `Bearer ${API_KEY}`,
  },
};

const MovieDetails = () => {
  const params = useParams();
  const [movieInfo, setMovieInfo] = useState(null);
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);
  const [videoError, setvideoError] = useState("");
  const [trailerLoading, setTrailerLoading] = useState(true);
  const [trailer, setTrailer] = useState([]);

  const fetchMovieDetails = async () => {
    const detailsEndpoint = `${BASE_URL}/movie/${params.movieId}`;
    try {
      setLoading(true);
      const response = await fetch(detailsEndpoint, API_OPTION);

      const data = await response.json();
      if (!data) {
        setErrorMsg("Fail to fetch movie details");
      }
      setMovieInfo(data);
      setLoading(false);
    } catch (error) {
      console.error(error);
      setErrorMsg(`Fail to fetch movie details: ${error}`);
    } finally {
      setLoading(false);
    }
  };

  // fetch movie videos
  const fetchMovieVideo = async () => {
    const videoEndpoint = `${BASE_URL}/movie/${params.movieId}/videos`;
    try {
      setTrailerLoading(true);
      const response = await fetch(videoEndpoint, API_OPTION);
      const result = await response.json();
      if (!result) {
        setvideoError("Fail to fetch movie videos");
      }
      setTrailer(result.results || []);
      setTrailerLoading(false);
    } catch (error) {
      setvideoError("Fail to fetch movie videos");
      setTrailerLoading(false);
    } finally {
      setTrailerLoading(false);
    }
  };

  const largeNumberFormatter = (num) => {
    if (num >= 1_000_000_000) {
      return (num / 1_000_000_000).toFixed(1) + " Billion";
    } else if (num >= 1_000_000) {
      return (num / 1_000_000).toFixed(0) + " Million";
    } else if (num >= 1_000) {
      return (num / 1_000).toFixed(0) + " Thousand";
    }
    return num.toString();
  };
  const formatTime = (minute) => {
    const hours = Math.floor(minute / 60);
    const minutes = minute % 60;
    return `${hours}h ${minutes}m`;
  };
  const thousandFormater = (num) => {
    if (num >= 1_000) {
      return (num / 1_000).toFixed(1) + "K";
    }
  };
  useEffect(() => {
    fetchMovieDetails();
    fetchMovieVideo();
  }, []);

  return (
    <div>
      {loading ? (
        <Spinner />
      ) : errorMsg ? (
        <p className="text-red-500">{errorMsg}</p>
      ) : (
        <div className="w-full h-screen flex justify-center items-center ">
          {/* wrapper */}
          <div className="flex flex-col align-middle max-w-[1100px] w-[95%] h-[90%] rounded-2xl bg-(--color-dark-100) shadow-[0_0_27px_#ab8bff] overflow-y-auto  hide-scrollbar lg:p-[50px] md:p-8 p-7">
            {/* header */}
            <div className="mb-9 flex flex-col md:flex-row justify-between items-start gap-6">
              <div className="flex flex-col lg:gap-4 sm:gap-2">
                <h2 className="text-[27px] md:text-xl lg:text-4xl  ">
                  {movieInfo?.title}
                </h2>
                <div className="flex gap-2.25 items-center text-[#a8b5db]">
                  <span className="text-sm text-[#a8b5db] md:text-lg lg:text-xl">
                    {movieInfo?.release_date
                      ? movieInfo.release_date.split("-")[0]
                      : "N/A"}
                  </span>{" "}
                  •
                  <span className="text-sm text-[#a8b5db] md:text-lg lg:text-xl">
                    PG 13
                  </span>{" "}
                  •
                  <span className="text-sm text-[#a8b5db] md:text-lg lg:text-xl">
                    {movieInfo?.runtime ? formatTime(movieInfo.runtime) : "N/A"}
                  </span>
                </div>
              </div>
              <div className="flex gap-2.5 ">
                <div className="flex items-center bg-(--button-light) gap-3 h-11 px-4 py-2 md:py rounded-[6px] sm:rounded-sm">
                  <img className="md:w-5 w-4" src="/rating.svg" alt="rating" />
                  <p className="text-(--color-light-200) text-sm lg:text-[16px]">
                    <span className=" text-(--color-light-100) sm:text-sm lg:text-[16px]">
                      {movieInfo?.vote_average
                        ? movieInfo.vote_average.toFixed(1)
                        : "N/A"}
                    </span>
                    /10 (
                    {movieInfo?.vote_count
                      ? thousandFormater(movieInfo.vote_count)
                      : "N/A"}
                    )
                  </p>
                </div>
                <div className="flex items-center bg-(--button-light) gap-3 h-11 px-4 py-2 rounded-[6px]">
                  <img className="w-4 lg:w-6" src="/rise.svg" alt="rise" />
                  <span className=" text-(--color-light-100) sm:text-sm md:text-[14px] lg:text-[16px]">
                    1
                  </span>
                </div>
              </div>
            </div>
            {/* poster section */}
            <section className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="">
                <img
                  className="w-full h-auto md:max-w-[250px] rounded-xl shadow"
                  src={
                    movieInfo?.poster_path
                      ? `https://image.tmdb.org/t/p/w500/${movieInfo.poster_path}`
                      : "/no-poster.png"
                  }
                  alt="poster"
                />
              </div>
              {/* <img
                className=" max-w-[680px] lg:w-[500px] lg:h-auto md:flex-1 rounded-xl object-cover"
                src="/squid_trailer_img.png"
                alt="movie poster"
              /> */}
              {videoError ? (
                <p className="text-red-500">{videoError}</p>
              ) : trailerLoading ? (
                <Spinner />
              ) : (
                <div className="md:col-span-2 rounded-xl">
                  <YoutubeCard videoId={trailer[0]?.key} />
                </div>
              )}
            </section>
            {/* details box */}
            <div className="flex flex-col md:flex-row mt-7 justify-between items-start gap-8">
              {/* each details  */}
              <div className="w-full md:w-[70%]">
                {/* genre */}
                <div className="flex flex-col md:flex-row gap-3 pt-4 items-start md:gap-[80px] md:items-center">
                  {/* title  */}
                  <span className="text-(--color-light-200) text-[18px]">
                    Genres
                  </span>
                  {/* text */}
                  <div className="text-white flex gap-2 flex-wrap">
                    {movieInfo?.genres
                      ? movieInfo.genres.map((genre) => (
                          <div
                            key={genre.id}
                            className="text-white text-[16px] bg-(--button-light) px-[18px] py-2 rounded-[6px]"
                          >
                            {genre.name}
                          </div>
                        ))
                      : "None"}
                  </div>
                </div>
                {/* overview */}
                <div className="flex flex-col md:flex-row gap-3 pt-4 items-start md:gap-[65px] ">
                  {/* title  */}
                  <span className="text-(--color-light-200) text-[18px] ">
                    Overview
                  </span>
                  {/* text */}
                  <p className="text-white text-[16px]">
                    {movieInfo?.overview ? movieInfo.overview : "Not available"}
                  </p>
                </div>
                {/* Release date */}
                <div className="flex flex-col md:flex-row gap-3 pt-4 items-start md:gap-[31px] ">
                  {/* title  */}
                  <span className="text-(--color-light-200) text-[18px] ">
                    Release Date
                  </span>
                  {/* text */}
                  <p className="text-(--info-text) text-[16px]">
                    {movieInfo?.release_date ? movieInfo.release_date : "N/A"}{" "}
                    (Worldwide)
                  </p>
                </div>
                {/* countries */}
                <div className="flex flex-col md:flex-row gap-3 pt-4 items-start md:gap-[62px] ">
                  {/* title  */}
                  <span className="text-(--color-light-200) text-[18px] ">
                    Countries
                  </span>
                  {/* text */}
                  <p className="text-(--info-text) text-[16px]">
                    {movieInfo?.production_countries
                      ? movieInfo.production_countries.map((country) => (
                          <span key={country.name} className="mr-3">
                            {country?.name}
                          </span>
                        ))
                      : "N/A"}
                  </p>
                </div>
                {/* status */}
                <div className="flex flex-col md:flex-row gap-3 pt-4 items-start md:gap-[88px] ">
                  {/* title  */}
                  <span className="text-(--color-light-200) text-[18px] ">
                    Status
                  </span>
                  {/* text */}
                  <p className="text-(--info-text) text-[16px]">
                    {movieInfo?.status ? movieInfo.status : "N/A"}{" "}
                  </p>
                </div>
                {/* language */}
                <div className="flex flex-col md:flex-row gap-3 pt-4 items-start md:gap-[59px] ">
                  {/* title  */}
                  <span className="text-(--color-light-200) text-[18px] ">
                    Language
                  </span>
                  {/* text */}
                  <p className="text-(--info-text) text-[16px]">
                    {movieInfo?.spoken_languages
                      ? movieInfo.spoken_languages.map((language) => (
                          <span key={language.name} className="mr-3">
                            {language?.name}
                          </span>
                        ))
                      : "N/A"}
                  </p>
                </div>
                {/* budget */}
                <div className="flex flex-col md:flex-row gap-3 pt-4 items-start md:gap-[83px] ">
                  {/* title  */}
                  <span className="text-(--color-light-200) text-[18px] ">
                    Budget
                  </span>
                  {/* text */}
                  <p className="text-(--info-text) text-[16px]">
                    $
                    {movieInfo?.budget
                      ? largeNumberFormatter(movieInfo.budget)
                      : "N/A"}{" "}
                  </p>
                </div>
                {/* revenue */}
                <div className="flex flex-col md:flex-row gap-3 pt-4 items-start md:gap-[68px] ">
                  {/* title  */}
                  <span className="text-(--color-light-200) text-[18px] ">
                    Revenue
                  </span>
                  {/* text */}
                  <p className="text-(--info-text) text-[16px]">
                    $
                    {movieInfo?.revenue
                      ? largeNumberFormatter(movieInfo.revenue)
                      : "N/A"}{" "}
                  </p>
                </div>
                {/* tagline */}
                <div className="flex flex-col md:flex-row gap-3 pt-4 items-start md:gap-[85px] ">
                  {/* title  */}
                  <span className="text-(--color-light-200) text-[18px] ">
                    Tagline
                  </span>
                  {/* text */}
                  <p className="text-(--info-text) text-[16px]">
                    {movieInfo?.tagline ? movieInfo?.tagline : "N/A"}{" "}
                  </p>
                </div>
                {/* production companies */}
                <div className="flex flex-col md:flex-row gap-3 pt-4 items-start md:gap-[102px] ">
                  {/* title  */}
                  <span className="text-(--color-light-200) text-[18px] md:w-10">
                    Production Companies
                  </span>
                  {/* text */}
                  <p className="text-(--info-text) text-[16px]">
                    {movieInfo?.production_companies
                      ? movieInfo?.production_companies.map((company) => (
                          <span key={company?.id} className="mr-3">
                            {company?.name}
                          </span>
                        ))
                      : "N/A"}
                  </p>
                </div>
              </div>
              <Link
                to={"/"}
                className="flex gap-2 bg-linear-to-r from-[#D6C7FF] to-[#AB8BFF] py-2 px-5 rounded-[6px] text-primary"
              >
                Visit Homepage{" "}
                <img src="/Movie-details-right-arrow.svg" alt="left arrow" />
              </Link>
            </div>
          </div>
        </div>
      )}
      ;
    </div>
  );
};

export default MovieDetails;
