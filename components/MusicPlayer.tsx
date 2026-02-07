'use client'

import { useEffect, useRef, useState } from 'react'
import { useMusicPlayer } from '@/lib/store'
import { FaPlay, FaPause, FaStepForward, FaStepBackward, FaVolumeUp } from 'react-icons/fa'

export default function MusicPlayer() {
    const {
        currentTrack,
        isPlaying,
        volume,
        togglePlay,
        setVolume,
        nextTrack,
        previousTrack,
    } = useMusicPlayer()

    const audioRef = useRef<HTMLAudioElement>(null)
    const [currentTime, setCurrentTime] = useState(0)
    const [duration, setDuration] = useState(0)

    useEffect(() => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.play()
            } else {
                audioRef.current.pause()
            }
        }
    }, [isPlaying])

    useEffect(() => {
        if (audioRef.current && currentTrack?.previewUrl) {
            audioRef.current.src = currentTrack.previewUrl
            audioRef.current.load()
            if (isPlaying) {
                audioRef.current.play()
            }
        }
    }, [currentTrack, isPlaying])

    useEffect(() => {
        if (audioRef.current) {
            audioRef.current.volume = volume
        }
    }, [volume])

    const handleTimeUpdate = () => {
        if (audioRef.current) {
            setCurrentTime(audioRef.current.currentTime)
        }
    }

    const handleLoadedMetadata = () => {
        if (audioRef.current) {
            setDuration(audioRef.current.duration)
        }
    }

    const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
        const time = parseFloat(e.target.value)
        setCurrentTime(time)
        if (audioRef.current) {
            audioRef.current.currentTime = time
        }
    }

    const formatTime = (time: number) => {
        const minutes = Math.floor(time / 60)
        const seconds = Math.floor(time % 60)
        return `${minutes}:${seconds.toString().padStart(2, '0')}`
    }

    if (!currentTrack) return null

    return (
        <div className="fixed bottom-0 left-0 right-0 bg-gradient-to-r from-gray-900 via-purple-900 to-gray-900 text-white shadow-2xl border-t border-purple-500/30 backdrop-blur-lg z-50">
            <audio
                ref={audioRef}
                onTimeUpdate={handleTimeUpdate}
                onLoadedMetadata={handleLoadedMetadata}
                onEnded={nextTrack}
            />

            <div className="max-w-7xl mx-auto px-4 py-3">
                <div className="flex items-center justify-between gap-4">
                    {/* Track Info */}
                    <div className="flex items-center gap-3 min-w-0 flex-1">
                        {currentTrack.imageUrl && (
                            <img
                                src={currentTrack.imageUrl}
                                alt={currentTrack.name}
                                className="w-14 h-14 rounded-lg shadow-lg"
                            />
                        )}
                        <div className="min-w-0">
                            <p className="font-semibold truncate">{currentTrack.name}</p>
                            <p className="text-sm text-gray-300 truncate">{currentTrack.artist}</p>
                        </div>
                    </div>

                    {/* Controls */}
                    <div className="flex flex-col items-center gap-2 flex-1">
                        <div className="flex items-center gap-4">
                            <button
                                onClick={previousTrack}
                                className="hover:text-purple-400 transition-colors"
                                aria-label="Previous track"
                            >
                                <FaStepBackward size={20} />
                            </button>

                            <button
                                onClick={togglePlay}
                                className="bg-white text-purple-900 rounded-full p-3 hover:scale-110 transition-transform shadow-lg"
                                aria-label={isPlaying ? 'Pause' : 'Play'}
                            >
                                {isPlaying ? <FaPause size={20} /> : <FaPlay size={20} className="ml-0.5" />}
                            </button>

                            <button
                                onClick={nextTrack}
                                className="hover:text-purple-400 transition-colors"
                                aria-label="Next track"
                            >
                                <FaStepForward size={20} />
                            </button>
                        </div>

                        {/* Progress Bar */}
                        <div className="flex items-center gap-2 w-full max-w-md">
                            <span className="text-xs text-gray-300 w-10 text-right">
                                {formatTime(currentTime)}
                            </span>
                            <input
                                type="range"
                                min="0"
                                max={duration || 0}
                                value={currentTime}
                                onChange={handleSeek}
                                className="flex-1 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                            />
                            <span className="text-xs text-gray-300 w-10">
                                {formatTime(duration)}
                            </span>
                        </div>
                    </div>

                    {/* Volume Control */}
                    <div className="flex items-center gap-2 flex-1 justify-end">
                        <FaVolumeUp className="text-gray-300" />
                        <input
                            type="range"
                            min="0"
                            max="1"
                            step="0.01"
                            value={volume}
                            onChange={(e) => setVolume(parseFloat(e.target.value))}
                            className="w-24 h-1 bg-gray-600 rounded-lg appearance-none cursor-pointer slider"
                        />
                    </div>
                </div>
            </div>

            <style jsx>{`
        .slider::-webkit-slider-thumb {
          appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }
        .slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }
      `}</style>
        </div>
    )
}
