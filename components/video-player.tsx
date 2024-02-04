import { useState, useRef, useEffect } from 'react';

const VideoPlayer = ({ videoUrl }: { videoUrl: string }) => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [thumbnailUrl, setThumbnailUrl] = useState<string | undefined>(
    undefined
  );

  const handlePlayClick = () => {
    setIsPlaying(true);
  };

  const handleVideoLoad = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth;
      canvas.height = videoRef.current.videoHeight;

      const context = canvas.getContext('2d');
      if (context) {
        context.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);

        const thumbnailUrl = canvas.toDataURL('image/png');
        setThumbnailUrl(thumbnailUrl);
      } else {
        console.error('Unable to get 2D context for canvas.');
      }
    }
  };

  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.addEventListener('loadeddata', handleVideoLoad);
    }

    return () => {
      if (videoRef.current) {
        videoRef.current.removeEventListener('loadeddata', handleVideoLoad);
      }
    };
  }, []); // Add an empty dependency array to run the effect once after mount

  return (
    <div className="relative w-full h-full">
      {!isPlaying && (
        <>
          {thumbnailUrl && (
            <img
              src={thumbnailUrl ?? 'defaultThumbnailUrl'} // Provide a default value here
              alt="Video Thumbnail"
              className="w-full h-full rounded-lg"
            />
          )}
          <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="white"
              className="w-16 h-16"
              onClick={handlePlayClick}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M5 15l10-7L5 1v14zM15 14l7-7-7-7"
              />
            </svg>
          </div>
        </>
      )}

      {isPlaying && (
        <video
          ref={videoRef}
          className="w-full h-full rounded-lg"
          controls
          crossOrigin="anonymous"
          width="800"
          height="800"
          onLoadedData={handleVideoLoad}
        >
          <source src={videoUrl} type="video/mp4" />
          Your browser does not support the video element.
        </video>
      )}
    </div>
  );
};

export default VideoPlayer;
