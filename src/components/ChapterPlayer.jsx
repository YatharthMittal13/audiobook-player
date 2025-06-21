//This ChapterPlayer component is a React-based modal audio player designed to play specific chapters from an audiobook. It supports:

//Chapter-wise playback , Play/Pause ,  Seek within chapter  , Volume control
//Playback speed adjustment ,   Skip to previous/next chapters

import { useRef, useState, useEffect } from "react"
import { Play, Pause, Volume2, SkipBack, SkipForward, X } from 'lucide-react'


//audioBook: An object containing:
//title: Book title
//audioFile: URL to the audio file
//chapters: Array of { title, startTime, endTime, id }
//onClose: Function to close the player modal
const ChapterPlayer = ({ audioBook, onClose }) => {
  //Points to the hidden <audio> element.
  const audioRef = useRef(null)

  //Tracks the player's current state:
  //isPlaying: Whether audio is playing
  //currentTime: Current position in audio
  //duration: Total duration of the audio
  //volume: Volume (0–1)
  //playbackRate: Speed multiplier
  const [playbackState, setPlaybackState] = useState({
    isPlaying: false,
    currentTime: 0,
    duration: 0,
    volume: 1,
    playbackRate: 1,
  })
  //Stores the index of the active chapter.
  const [currentChapterIndex, setCurrentChapterIndex] = useState(0)
  //Retrieves the currently selected chapter object.
  const currentChapter = audioBook?.chapters[currentChapterIndex]


  //This effect re-runs whenever:
  //A new audioBook is loaded.
  //The currentChapter changes (user clicked another chapter).
  useEffect(() => {
    //Ensures the audio element is mounted and audioBook exists.
    if (audioRef.current && audioBook) {
      const audio = audioRef.current

      //Runs every time audio time updates (usually every second)
      //Updates:  currentTime → current position in audio
      //duration → full audio length (fallback to 0 if not available)
      const updateTime = () => {
        setPlaybackState((prev) => ({
          ...prev,
          currentTime: audio.currentTime,
          duration: audio.duration || 0,
        }))

        // Check if we've reached the end of the current chapter
        //If audio passes the endTime of the current chapter:
        //Pause the audio
        //Update isPlaying to false
        //✅ Prevents user from unintentionally hearing the next chapter.
        if (currentChapter && audio.currentTime >= currentChapter.endTime) {
          audio.pause()
          setPlaybackState((prev) => ({ ...prev, isPlaying: false }))
        }
      }

      //Triggered once metadata (like duration) is available.
      //Ensures accurate duration state.
      const updateLoadedData = () => {
        setPlaybackState((prev) => ({
          ...prev,
          duration: audio.duration || 0,
        }))
      }

      //timeupdate → Fires periodically while the audio plays
      //loadedmetadata → Fires when audio file info is ready (including duration)
      audio.addEventListener("timeupdate", updateTime)
      audio.addEventListener("loadedmetadata", updateLoadedData)

      //Prevents memory leaks or duplicate listeners
      //Ensures old listeners are removed before adding new ones when:
      //The chapter changes  , A new audio book is loaded   ,The component unmounts
      return () => {
        audio.removeEventListener("timeupdate", updateTime)
        audio.removeEventListener("loadedmetadata", updateLoadedData)
      }
    }
  }, [audioBook, currentChapter])

  
  const togglePlayPause = () => {
    if (audioRef.current && currentChapter) {
      if (playbackState.isPlaying) {
        audioRef.current.pause()
      } else {
        // Ensure we start from the chapter start time
        if (
          audioRef.current.currentTime < currentChapter.startTime ||
          audioRef.current.currentTime >= currentChapter.endTime
        ) {
          audioRef.current.currentTime = currentChapter.startTime
        }
        audioRef.current.play()
      }
      setPlaybackState((prev) => ({ ...prev, isPlaying: !prev.isPlaying }))
    }
  }

  const handleSeek = (e) => {
    if (audioRef.current && currentChapter) {
      const seekTime =
        currentChapter.startTime +
        (Number.parseFloat(e.target.value) / 100) * (currentChapter.endTime - currentChapter.startTime)
      audioRef.current.currentTime = seekTime
    }
  }

  const handleVolumeChange = (e) => {
    const volume = Number.parseFloat(e.target.value) / 100
    if (audioRef.current) {
      audioRef.current.volume = volume
    }
    setPlaybackState((prev) => ({ ...prev, volume }))
  }

  const handlePlaybackRateChange = (rate) => {
    if (audioRef.current) {
      audioRef.current.playbackRate = rate
    }
    setPlaybackState((prev) => ({ ...prev, playbackRate: rate }))
  }

  const playChapter = (chapterIndex) => {
    setCurrentChapterIndex(chapterIndex)
    if (audioRef.current && audioBook) {
      const chapter = audioBook.chapters[chapterIndex]
      audioRef.current.currentTime = chapter.startTime
      audioRef.current.play()
      setPlaybackState((prev) => ({ ...prev, isPlaying: true }))
    }
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  const getChapterProgress = () => {
    if (!currentChapter) return 0
    const chapterDuration = currentChapter.endTime - currentChapter.startTime
    const chapterCurrentTime = Math.max(0, playbackState.currentTime - currentChapter.startTime)
    return Math.min(100, (chapterCurrentTime / chapterDuration) * 100)
  }

  if (!audioBook) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">{audioBook.title}</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close player"
          >
            <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>
        </div>

        <div className="flex flex-col lg:flex-row">
          {/* Chapter List */}
          <div className="lg:w-1/3 border-r border-gray-200 dark:border-gray-700 max-h-96 lg:max-h-[60vh] overflow-y-auto">
            <div className="p-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-4">Chapters</h3>
              <div className="space-y-2">
                {audioBook.chapters.map((chapter, index) => (
                  <button
                    key={chapter.id}
                    onClick={() => playChapter(index)}
                    className={`w-full text-left p-3 rounded-lg transition-colors ${
                      index === currentChapterIndex
                        ? "bg-blue-100 dark:bg-blue-900 text-blue-900 dark:text-blue-100"
                        : "hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300"
                    }`}
                  >
                    <div className="font-medium">{chapter.title}</div>
                    <div className="text-sm opacity-75">{formatTime(chapter.endTime - chapter.startTime)}</div>
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Player Controls */}
          <div className="lg:w-2/3 p-6">
            {currentChapter && (
              <>
                <div className="text-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">{currentChapter.title}</h3>
                  <div className="text-sm text-gray-600 dark:text-gray-400">
                    {formatTime(Math.max(0, playbackState.currentTime - currentChapter.startTime))} /{" "}
                    {formatTime(currentChapter.endTime - currentChapter.startTime)}
                  </div>
                </div>

                {/* Progress Bar */}
                <div className="mb-6">
                  <input
                    type="range"
                    min="0"
                    max="100"
                    value={getChapterProgress()}
                    onChange={handleSeek}
                    className="w-full h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                  />
                </div>

                {/* Playback Controls */}
                <div className="flex items-center justify-center space-x-4 mb-6">
                  <button
                    onClick={() => currentChapterIndex > 0 && playChapter(currentChapterIndex - 1)}
                    disabled={currentChapterIndex === 0}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Previous chapter"
                  >
                    <SkipBack className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </button>

                  <button
                    onClick={togglePlayPause}
                    className="p-4 bg-blue-600 hover:bg-blue-700 text-white rounded-full transition-colors"
                    aria-label={playbackState.isPlaying ? "Pause" : "Play"}
                  >
                    {playbackState.isPlaying ? <Pause className="h-8 w-8" /> : <Play className="h-8 w-8" />}
                  </button>

                  <button
                    onClick={() =>
                      currentChapterIndex < audioBook.chapters.length - 1 && playChapter(currentChapterIndex + 1)
                    }
                    disabled={currentChapterIndex === audioBook.chapters.length - 1}
                    className="p-2 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    aria-label="Next chapter"
                  >
                    <SkipForward className="h-6 w-6 text-gray-600 dark:text-gray-400" />
                  </button>
                </div>

                {/* Volume and Speed Controls */}
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <Volume2 className="h-5 w-5 text-gray-600 dark:text-gray-400" />
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={playbackState.volume * 100}
                      onChange={handleVolumeChange}
                      className="w-20 h-2 bg-gray-200 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer slider"
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-gray-600 dark:text-gray-400">Speed:</span>
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map((rate) => (
                      <button
                        key={rate}
                        onClick={() => handlePlaybackRateChange(rate)}
                        className={`px-2 py-1 text-xs rounded transition-colors ${
                          playbackState.playbackRate === rate
                            ? "bg-blue-600 text-white"
                            : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600"
                        }`}
                      >
                        {rate}x
                      </button>
                    ))}
                  </div>
                </div>
              </>
            )}

            {/* Hidden Audio Element */}
            <audio ref={audioRef} src={audioBook.audioFile} preload="metadata" />
          </div>
        </div>
      </div>
    </div>
  )
}

export default ChapterPlayer