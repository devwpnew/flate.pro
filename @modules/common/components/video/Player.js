import React from "react";
import Video from "next-video";
import Player from 'next-video/player';

const VideoPlayer = ({ playbackId }) => {
    const videoUrl = `https://stream.mux.com/${playbackId}.m3u8`;

    console.log(playbackId)

    return (
        <div className="w-fit rounded-lg overflow-hidden">
            <Video
                style={{ display: 'grid', width: '100%', aspectRatio: '16/9', borderRadius: '50px' }}
                disableTracking
                src={videoUrl}
                className="w-[300px] max-w-[300px] rounded-2xl"
                controls
                autoPlay
            />
        </div>
    );
};

export default VideoPlayer;
