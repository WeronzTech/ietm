import { useState, useRef, useEffect } from "react";
import { Play, Pause, Volume2, VolumeX, Maximize, Film, RotateCcw } from "lucide-react";

export default function VideoGallery({ manualId }) {
  const [videos, setVideos] = useState([]);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.8);
  const [isMuted, setIsMuted] = useState(false);
  const videoRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    loadVideos();
  }, [manualId]);

  const loadVideos = async () => {
    try {
      const assets = await window.api.getManualAssets?.({ manualId, assetType: "video" }) || [];
      if (assets.length > 0) {
        setVideos(assets);
        setSelectedVideo(assets[0]);
      } else {
        const defaults = [
          {
            id: 1,
            title: "VID 01: Complete Field Strip & Disassembly Procedure",
            duration: "04:32",
            description: "Step-by-step breakdown of primary bolt, barrel, and return springs in field environment.",
            file_path: "/sample-disassembly.mp4",
          },
          {
            id: 2,
            title: "VID 02: Immediate Action Drills (Failure to Feed & Clear)",
            duration: "02:15",
            description: "Remedial actions and immediate drill clearing procedures for feed stoppages.",
            file_path: "/sample-clearing.mp4",
          },
          {
            id: 3,
            title: "VID 03: Preventive Maintenance Lubrication & Cleaning",
            duration: "05:10",
            description: "Authorized lubrication application points and solvent inspection guidelines.",
            file_path: "/sample-lubrication.mp4",
          },
        ];
        setVideos(defaults);
        setSelectedVideo(defaults[0]);
      }
    } catch (err) {
      console.error(err);
    }
  };

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play();
    }
    setIsPlaying(!isPlaying);
  };

  const handleTimeUpdate = () => {
    if (videoRef.current) {
      setCurrentTime(videoRef.current.currentTime);
      setDuration(videoRef.current.duration || 100);
    }
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    if (videoRef.current) {
      videoRef.current.currentTime = time;
    }
  };

  const handleVolumeChange = (e) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      videoRef.current.muted = val === 0;
    }
    setIsMuted(val === 0);
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    const next = !isMuted;
    setIsMuted(next);
    videoRef.current.muted = next;
  };

  const toggleFullScreen = () => {
    if (!containerRef.current) return;
    if (!document.fullscreenElement) {
      containerRef.current.requestFullscreen().catch((err) => console.log(err));
    } else {
      document.exitFullscreen();
    }
  };

  const formatTime = (secs) => {
    if (isNaN(secs)) return "00:00";
    const m = Math.floor(secs / 60);
    const s = Math.floor(secs % 60);
    return `${m.toString().padStart(2, "0")}:${s.toString().padStart(2, "0")}`;
  };

  return (
    <div className="flex h-full gap-6 p-6 overflow-hidden bg-vector-bg text-vector-text">
      {/* LEFT: Video Player (V6) */}
      <div className="flex-1 flex flex-col bg-vector-panel border border-gray-800 rounded-lg overflow-hidden">
        {/* Player Container */}
        <div ref={containerRef} className="relative flex-1 bg-black flex items-center justify-center group overflow-hidden">
          <video
            ref={videoRef}
            src={selectedVideo?.file_path || ""}
            onTimeUpdate={handleTimeUpdate}
            onEnded={() => setIsPlaying(false)}
            className="w-full h-full object-contain"
            poster="/video-poster.png"
          />

          {/* Fallback Simulation Notice if no physical MP4 */}
          <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/40 pointer-events-none text-center p-6">
            <Film size={48} className="text-vector-accent mb-3 opacity-60" />
            <h4 className="text-sm font-bold text-white uppercase tracking-wider">{selectedVideo?.title}</h4>
            <p className="text-xs text-gray-400 font-mono mt-1 max-w-md">{selectedVideo?.description}</p>
          </div>

          {/* Big Center Play/Pause button on hover */}
          <button
            onClick={togglePlay}
            className="absolute w-16 h-16 rounded-full bg-vector-accent/80 hover:bg-vector-accent text-black flex items-center justify-center shadow-[0_0_25px_rgba(0,245,212,0.4)] transition-all transform hover:scale-110 z-20"
          >
            {isPlaying ? <Pause size={28} /> : <Play size={28} className="ml-1" />}
          </button>

          {/* Standard Video Player Controls Bar */}
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black via-black/80 to-transparent p-4 flex flex-col gap-2 z-30">
            {/* Timeline Seek Bar */}
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-vector-accent"
            />

            {/* Controls */}
            <div className="flex justify-between items-center text-xs">
              <div className="flex items-center gap-4">
                <button onClick={togglePlay} className="text-white hover:text-vector-accent">
                  {isPlaying ? <Pause size={18} /> : <Play size={18} />}
                </button>
                <div className="flex items-center gap-2">
                  <button onClick={toggleMute} className="text-gray-400 hover:text-white">
                    {isMuted ? <VolumeX size={16} /> : <Volume2 size={16} />}
                  </button>
                  <input
                    type="range"
                    min="0"
                    max="1"
                    step="0.05"
                    value={isMuted ? 0 : volume}
                    onChange={handleVolumeChange}
                    className="w-16 h-1 bg-gray-700 appearance-none rounded cursor-pointer accent-vector-accent"
                  />
                </div>
                <span className="font-mono text-xs text-gray-400">
                  {formatTime(currentTime)} / {formatTime(duration || 180)}
                </span>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    if (videoRef.current) videoRef.current.currentTime = 0;
                  }}
                  className="text-gray-400 hover:text-white"
                  title="Replay"
                >
                  <RotateCcw size={16} />
                </button>
                <button onClick={toggleFullScreen} className="text-gray-400 hover:text-white" title="Fullscreen">
                  <Maximize size={16} />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* Video Metadata Footer */}
        <div className="p-4 border-t border-gray-800 bg-gray-900/60 flex justify-between items-center">
          <div>
            <h3 className="font-bold text-white text-sm">{selectedVideo?.title}</h3>
            <p className="text-xs text-gray-400 mt-0.5">{selectedVideo?.description}</p>
          </div>
          <span className="text-[10px] font-mono bg-vector-accent/10 border border-vector-accent text-vector-accent px-2.5 py-1 rounded">
            MIL-STD HD 1080p
          </span>
        </div>
      </div>

      {/* RIGHT: Video Playlist */}
      <div className="w-80 flex flex-col bg-vector-panel border border-gray-800 rounded-lg overflow-hidden shrink-0">
        <div className="p-3.5 border-b border-gray-800 font-bold uppercase tracking-widest text-xs text-vector-accent flex items-center gap-2 bg-gray-900/60">
          <Film size={16} /> Video Library ({videos.length})
        </div>
        <div className="flex-1 overflow-y-auto p-2 space-y-2 scrollbar-thin scrollbar-thumb-gray-700">
          {videos.map((vid) => (
            <div
              key={vid.id}
              onClick={() => {
                setSelectedVideo(vid);
                setIsPlaying(false);
                setCurrentTime(0);
              }}
              className={`p-3 rounded border cursor-pointer transition-colors flex gap-3 ${
                selectedVideo?.id === vid.id
                  ? "bg-vector-accent/15 border-vector-accent text-white"
                  : "bg-vector-bg/40 border-gray-800 text-vector-text-muted hover:bg-gray-800 hover:text-white"
              }`}
            >
              <div className="w-10 h-10 rounded bg-gray-800 flex items-center justify-center shrink-0 text-vector-accent">
                <Play size={16} />
              </div>
              <div className="flex-1 min-w-0">
                <h4 className="text-xs font-bold text-white truncate">{vid.title}</h4>
                <div className="flex justify-between items-center text-[10px] font-mono text-gray-500 mt-1">
                  <span>Standard Procedure</span>
                  <span className="text-vector-accent">{vid.duration || "03:00"}</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
