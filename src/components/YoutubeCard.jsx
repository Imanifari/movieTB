import YouTube from "react-youtube";

const YoutubeCard = ({ videoId }) => {
  const opts = {
    height: "390",
    width: "640",
    playerVars: {
      autoplay: 0,
    },
  };
  console.log("videoId", videoId);

  return <YouTube videoId={videoId} opts={opts} />;
};

export default YoutubeCard;
