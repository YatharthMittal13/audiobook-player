"use client"
// importing 3 icons:
//Play – a play button ▶️ (for playing the audiobook)
//Clock – 🕒 (for showing duration)
//BookOpen – 📖 (default image if no cover is available)
import { Play, Clock, BookOpen, Edit, MoreVertical } from "lucide-react"
import { useState, useRef, useEffect } from "react"

//It receives two props:
//audioBook: an object containing audiobook data like title, image, duration, and chapters.
//onPlay: a function to call when the play button is clicked.
const AudioCard = ({ audioBook, onPlay, onEdit }) => {
  //showMenu: Controls visibility of the 3-dot dropdown menu.
  //menuRef: Reference to the menu element to detect clicks outside it
  const [showMenu, setShowMenu] = useState(false)
  const menuRef = useRef(null)


  //This converts total seconds into MM:SS format.
  //Example: 65 → 1:05
  const formatDuration = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }


  // Close menu when clicking outside
  //Automatically closes the 3-dot dropdown menu if you click anywhere outside of it.
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (menuRef.current && !menuRef.current.contains(event.target)) {
        setShowMenu(false)
      }
    }
    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [])


  return (
    //Main container of the card. Styled with background, shadow, and transition for hover effect.
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden relative">
      {/* 3-Dot Menu Button
      Button with 3 dots (<MoreVertical /> icon).
      On click, it toggles showMenu.
      If showMenu is true, shows a dropdown with an Edit Book option.
      Clicking "Edit Book" runs the onEdit(audioBook) function. */}
      <div className="absolute top-3 right-3 z-10" ref={menuRef}>
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowMenu(!showMenu)
          }}
          className="p-2 rounded-full bg-white dark:bg-gray-700 shadow-md hover:shadow-lg text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-all"
          aria-label="More options"
        >
          <MoreVertical className="h-4 w-4" />
        </button>


        {/* Dropdown Menu */}
        {showMenu && (
          <div className="absolute right-0 mt-2 w-36 bg-white dark:bg-gray-700 rounded-md shadow-lg border border-gray-200 dark:border-gray-600 z-20">
            <button
              onClick={(e) => {
                e.stopPropagation()
                onEdit(audioBook)
                setShowMenu(false)
              }}
              className="w-full text-left px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600 flex items-center rounded-md transition-colors"
            >
              <Edit className="h-4 w-4 mr-3" />
              Edit Book
            </button>
          </div>
        )}
      </div>

      <div className="aspect-square bg-gradient-to-br from-blue-400 to-purple-500 flex items-center justify-center">
        {/* If a cover image exists, it's shown full width and height.
          If not, a BookOpen icon is shown as a placeholder. */}
        {audioBook.coverImage ? (
          <img
            src={audioBook.coverImage || "/placeholder.svg"}
            alt={audioBook.title}
            className="w-full h-full object-cover"
          />
        ) : (
          <BookOpen className="h-16 w-16 text-white" />
        )}
      </div>


      <div className="p-4">
        {/* Shows the audiobook's title in bold.
        line-clamp-2 ensures long titles are cut off after 2 lines.*/}
        <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2">{audioBook.title}</h3>
        {/*Left side: a clock icon + formatted duration (e.g., 2:30)
          Right side: total number of chapters*/ }
        <div className="flex items-center justify-between text-sm text-gray-600 dark:text-gray-400 mb-3">
          <span className="flex items-center">
            <Clock className="h-4 w-4 mr-1" />
            {formatDuration(audioBook.duration)}
          </span>
          <span>{audioBook.chapters.length} chapters</span>
        </div>

        {/*A blue button that calls onPlay() with the audiobook object when clicked.
          Includes a play icon and the label “Play”. */}
        <button
          onClick={() => onPlay(audioBook)}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2 px-4 rounded-md transition-colors duration-200 flex items-center justify-center"
        >
          <Play className="h-4 w-4 mr-2" />
          Play
        </button>
      </div>
    </div>
  )
}

export default AudioCard
