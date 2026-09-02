import React, { useState } from 'react';
import { Play, Video } from 'lucide-react';

export interface VideoPlayerProps {
  url?: string | null;
  title?: string;
  poster?: string;
  className?: string;
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  url,
  title = 'Demo Video',
  poster,
  className = '',
}) => {
  const [isPlaying, setIsPlaying] = useState(false);

  if (!url) {
    return (
      <div className={`aspect-video w-full rounded-2xl bg-dark-900/80 border border-slate-800/80 flex flex-col items-center justify-center p-6 text-center text-slate-400 ${className}`}>
        <div className="w-16 h-16 rounded-full bg-dark-800/80 border border-slate-700/60 flex items-center justify-center mb-3 text-slate-500">
          <Video className="w-8 h-8" />
        </div>
        <p className="font-medium text-slate-300">Live Video Demo Preview</p>
        <p className="text-xs text-slate-500 max-w-sm mt-1">
          Interactive demo recording is currently being prepared. Check out the GitHub repository or Live Demo link above.
        </p>
      </div>
    );
  }

  // Check if YouTube
  const isYouTube = url.includes('youtube.com') || url.includes('youtu.be');
  let embedUrl = url;

  if (isYouTube) {
    if (url.includes('watch?v=')) {
      embedUrl = url.replace('watch?v=', 'embed/');
    } else if (url.includes('youtu.be/')) {
      embedUrl = url.replace('youtu.be/', 'www.youtube.com/embed/');
    }
  }

  // Check if Vimeo
  const isVimeo = url.includes('vimeo.com');
  if (isVimeo && !url.includes('player.vimeo.com')) {
    const vimeoId = url.split('/').pop();
    embedUrl = `https://player.vimeo.com/video/${vimeoId}`;
  }

  if (isYouTube || isVimeo) {
    return (
      <div className={`relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800/80 bg-black shadow-2xl ${className}`}>
        <iframe
          src={embedUrl}
          title={title}
          className="absolute inset-0 w-full h-full border-0"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    );
  }

  // Direct MP4 / WebM video
  return (
    <div className={`relative aspect-video w-full rounded-2xl overflow-hidden border border-slate-800/80 bg-black group ${className}`}>
      {!isPlaying && poster && (
        <div
          className="absolute inset-0 bg-cover bg-center z-10 flex items-center justify-center cursor-pointer"
          style={{ backgroundImage: `url(${poster})` }}
          onClick={() => setIsPlaying(true)}
        >
          <div className="absolute inset-0 bg-dark-950/40 backdrop-blur-xs group-hover:bg-dark-950/20 transition-all" />
          <button
            className="relative z-20 w-16 h-16 rounded-full bg-brand-500/90 text-white flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform cursor-pointer"
            aria-label="Play video"
          >
            <Play className="w-7 h-7 fill-current ml-1" />
          </button>
        </div>
      )}
      <video
        src={url}
        controls
        poster={poster}
        className="w-full h-full object-contain"
        autoPlay={isPlaying}
        preload="metadata"
      >
        Your browser does not support HTML5 video.
      </video>
    </div>
  );
};
