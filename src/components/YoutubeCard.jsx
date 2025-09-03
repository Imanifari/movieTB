import YouTube from "react-youtube";

const YoutubeCard = ({ videoId }) => {
  const opts = {
    height: "100%", // change height
    width: "100%", // change width
    playerVars: {
      autoplay: 0,
    },
  };
  console.log("videoId", videoId);

  return (
    <div className="relative w-full pb-[56.25%]">
      <YouTube
        videoId={videoId}
        opts={opts}
        className="absolute top-0 left-0 w-full h-full rounded-lg"
      />
    </div>
  );
};

export default YoutubeCard;
