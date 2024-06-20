"use client";

const VideoPlayer = ({ src, className }) => {
  return (
    <video className={className} controls>
      <source src={src} type="video/mp4" />
      Your browser does not support the video tag.
    </video>
  );
};

export default VideoPlayer;
