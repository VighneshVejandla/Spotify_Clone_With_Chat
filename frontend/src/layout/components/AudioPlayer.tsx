import { usePlayerStore } from "@/stores/usePlayerStore";
import { useEffect, useRef } from "react";

const AudioPlayer = () => {
	const audioRef = useRef<HTMLAudioElement>(null);
	const prevSongRef = useRef<string | null>(null);

	const { currentSong, isPlaying, playNext } = usePlayerStore();

	// Handle song changes
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio || !currentSong) return;

		const isNewSong = prevSongRef.current !== currentSong.audioUrl;

		if (isNewSong) {
			audio.src = currentSong.audioUrl;
			audio.currentTime = 0;
			prevSongRef.current = currentSong.audioUrl;
		}
	}, [currentSong]);

	// Handle play/pause toggle
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		if (isPlaying) {
			audio
				.play()
				.catch((err) => console.warn("Playback failed:", err));
		} else {
			audio.pause();
		}
	}, [isPlaying]);

	// Handle song end
	useEffect(() => {
		const audio = audioRef.current;
		if (!audio) return;

		const handleEnded = () => {
			playNext();
		};

		audio.addEventListener("ended", handleEnded);

		return () => {
			audio.removeEventListener("ended", handleEnded);
		};
	}, [playNext]);

	return <audio ref={audioRef} />;
};

export default AudioPlayer;
