import React, { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

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
  // console.log(params.movieId);
  const fetchMovieDetails = async () => {
    const endpoint = `${BASE_URL}/movie/${params.movieId}`;
    try {
      const response = await fetch(endpoint, API_OPTION);

      const data = await response.json();
      console.log(data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    fetchMovieDetails();
  }, []);

  return (
    <div className="w-full h-screen flex justify-center items-center ">
      <div className="flex flex-col align-middle w-[95%] h-[90%] rounded-2xl bg-(--color-dark-100) shadow-[0_0_27px_#ab8bff] overflow-y-auto  hide-scrollbar">
        <div className="max-w-[1100px] flex flex-col md:flex-row justify-between items-start gap-5">
          <div className="flex flex-col gap-4 sm:gap-2">
            <h2 className="lg:text-4xl md:text-xl sm:text-[27px]">
              Squid Game 2
            </h2>
            <div className="flex gap-2.25 items-center text-[#a8b5db]">
              <span className="text-sm text-[#a8b5db] md:text-lg lg:text-xl">
                2024
              </span>{" "}
              •
              <span className="text-sm text-[#a8b5db] md:text-lg lg:text-xl">
                PG 13
              </span>{" "}
              •
              <span className="text-sm text-[#a8b5db] md:text-lg lg:text-xl">
                2h 46m
              </span>
            </div>
          </div>
          <div className="flex gap-2.5 ">
            <div className="flex items-center bg-(--button-light) gap-3 h-11 px-4 py-2 md:py rounded-[6px] sm:rounded-sm">
              <img className="md:w-5 w-4" src="/rating.svg" alt="rating" />
              <p className="text-(--color-light-200) text-sm lg:text-[16px]">
                <span className=" text-(--color-light-100) text-sm lg:text-[16px]">
                  8
                </span>
                /10 (200k)
              </p>
            </div>
            <div className="flex items-center bg-(--button-light) gap-3 h-11 px-4 py-2 rounded-[6px]">
              <img className="w-4 lg:w-6" src="/rise.svg" alt="" />
              <span className=" text-(--color-light-100)">1</span>
            </div>
          </div>
        </div>
        <div className="flex gap-6 flex-col md:flex-row">
          <img
            className="w-full h-[490px] lg:"
            src="/squid_poster_img.png"
            alt="movie poster"
          />
          <img
            className="w-full h-[185px]"
            src="/squid_trailer_img.png"
            alt="movie poster"
          />
        </div>
        {/* details box */}
        <div className="flex justify-between shrin items-start sm:flex-col gap-8">
          <div>
            {/* each details  */}
            <div className="flex items-start w-[80%] sm:w-full">
              {/* title  */}
              <span className="text-(--color-light-200) text-[18px] ">
                Genres
              </span>
              <p className="text-white text-[16px]">Adventure</p>
            </div>
          </div>
          <Link
            to={"/"}
            className="flex gap-2 text-(--color-light-200) bg-linear-to-r from-[#D6C7FF] to-[#AB8BFF] py-2 px-5 rounded-[6px] text-primary"
          >
            Visit Homepage{" "}
            <img src="/Movie-details-right-arrow.svg" alt="left arrow" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MovieDetails;
