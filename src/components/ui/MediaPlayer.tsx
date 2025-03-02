
import React, { useState, useRef, useEffect } from 'react';
import { Play, Pause, Volume2, VolumeX, Maximize, SkipBack, SkipForward } from 'lucide-react';
import { Media } from '@/types';
import { Slider } from '@/components/ui/slider';
import { formatDuration } from '@/utils/media';

interface MediaPlayerProps {
  media: Media;
  autoPlay?: boolean;
}

const MediaPlayer: React.FC<MediaPlayerProps> = ({ media, autoPlay = false }) => {
  const [isPlaying, setIsPlaying] = useState(autoPlay);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    const updateTime = () => setCurrentTime(videoElement.currentTime);
    const updateDuration = () => setDuration(videoElement.duration);
    const handleEnd = () => setIsPlaying(false);

    videoElement.addEventListener('timeupdate', updateTime);
    videoElement.addEventListener('loadedmetadata', updateDuration);
    videoElement.addEventListener('ended', handleEnd);

    return () => {
      videoElement.removeEventListener('timeupdate', updateTime);
      videoElement.removeEventListener('loadedmetadata', updateDuration);
      videoElement.removeEventListener('ended', handleEnd);
    };
  }, [media]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    isPlaying ? videoElement.play() : videoElement.pause();
  }, [isPlaying]);

  useEffect(() => {
    const videoElement = videoRef.current;
    if (!videoElement) return;

    videoElement.volume = isMuted ? 0 : volume;
  }, [volume, isMuted]);

  const handlePlayPause = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (value[0] === 0) {
      setIsMuted(true);
    } else if (isMuted) {
      setIsMuted(false);
    }
  };

  const handleMuteToggle = () => {
    setIsMuted(!isMuted);
  };

  const handleProgressChange = (value: number[]) => {
    const videoElement = videoRef.current;
    if (videoElement) {
      videoElement.currentTime = value[0];
      setCurrentTime(value[0]);
    }
  };

  const handleFullscreen = () => {
    if (!playerRef.current) return;

    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      });
    }
  };

  const skipForward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.min(videoRef.current.currentTime + 10, duration);
  };

  const skipBackward = () => {
    if (!videoRef.current) return;
    videoRef.current.currentTime = Math.max(videoRef.current.currentTime - 10, 0);
  };

  if (media.type === 'image') {
    return (
      <div className="w-full max-h-[80vh] flex items-center justify-center bg-black/5 rounded-md overflow-hidden">
        <img 
          src={media.url} 
          alt={media.title} 
          className="max-w-full max-h-[80vh] object-contain animate-blur-in"
          loading="lazy"
        />
      </div>
    );
  }

  return (
    <div 
      ref={playerRef} 
      className="relative w-full overflow-hidden rounded-md bg-black group"
    >
      <video
        ref={videoRef}
        src={media.url}
        poster={media.thumbnailUrl}
        className="w-full max-h-[80vh] object-contain"
        onClick={handlePlayPause}
        onDoubleClick={handleFullscreen}
        playsInline
      />
      
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4 transition-opacity duration-300 opacity-0 group-hover:opacity-100">
        <div className="flex items-center gap-2 mb-2">
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleProgressChange}
            className="flex-1"
          />
          <span className="text-white text-xs">
            {formatDuration(currentTime)} / {formatDuration(duration)}
          </span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <button 
              onClick={skipBackward}
              className="text-white hover:text-primary transition-colors"
            >
              <SkipBack size={20} />
            </button>
            
            <button
              onClick={handlePlayPause}
              className="w-10 h-10 flex items-center justify-center rounded-full bg-white/20 text-white backdrop-blur-sm hover:bg-white/30 transition-colors"
            >
              {isPlaying ? <Pause size={20} /> : <Play size={20} className="ml-1" />}
            </button>
            
            <button 
              onClick={skipForward}
              className="text-white hover:text-primary transition-colors"
            >
              <SkipForward size={20} />
            </button>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 w-24">
              <button onClick={handleMuteToggle} className="text-white hover:text-primary transition-colors">
                {isMuted ? <VolumeX size={20} /> : <Volume2 size={20} />}
              </button>
              <Slider
                value={[isMuted ? 0 : volume]}
                min={0}
                max={1}
                step={0.01}
                onValueChange={handleVolumeChange}
              />
            </div>
            
            <button
              onClick={handleFullscreen}
              className="text-white hover:text-primary transition-colors"
            >
              <Maximize size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MediaPlayer;
