import { create } from 'zustand'

interface Track {
    id: string
    name: string
    artist: string
    album: string
    duration: number
    previewUrl: string | null
    imageUrl: string
}

interface MusicPlayerState {
    currentTrack: Track | null
    isPlaying: boolean
    volume: number
    playlist: Track[]
    currentIndex: number
    setCurrentTrack: (track: Track) => void
    togglePlay: () => void
    setVolume: (volume: number) => void
    nextTrack: () => void
    previousTrack: () => void
    addToPlaylist: (track: Track) => void
    setPlaylist: (tracks: Track[]) => void
}

export const useMusicPlayer = create<MusicPlayerState>((set, get) => ({
    currentTrack: null,
    isPlaying: false,
    volume: 0.7,
    playlist: [],
    currentIndex: 0,

    setCurrentTrack: (track) => set({ currentTrack: track, isPlaying: true }),

    togglePlay: () => set((state) => ({ isPlaying: !state.isPlaying })),

    setVolume: (volume) => set({ volume }),

    nextTrack: () => {
        const { playlist, currentIndex } = get()
        if (playlist.length > 0) {
            const nextIndex = (currentIndex + 1) % playlist.length
            set({
                currentIndex: nextIndex,
                currentTrack: playlist[nextIndex],
                isPlaying: true,
            })
        }
    },

    previousTrack: () => {
        const { playlist, currentIndex } = get()
        if (playlist.length > 0) {
            const prevIndex = currentIndex === 0 ? playlist.length - 1 : currentIndex - 1
            set({
                currentIndex: prevIndex,
                currentTrack: playlist[prevIndex],
                isPlaying: true,
            })
        }
    },

    addToPlaylist: (track) =>
        set((state) => ({ playlist: [...state.playlist, track] })),

    setPlaylist: (tracks) => set({ playlist: tracks, currentIndex: 0 }),
}))
