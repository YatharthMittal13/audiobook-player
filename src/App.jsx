"use client"
//importing useState (to handle component state) and useEffect (to run code when the component loads or updates).
import { useState, useEffect } from "react"  
//importing two icons: ➕ Plus and 📖 BookOpen from the lucide-react library.
import { Plus, BookOpen } from 'lucide-react'


// Import components
import Navbar from "./components/Navbar"
import AudioCard from "./components/AudioCard"
import ChapterPlayer from "./components/ChapterPlayer"
import AddAudioModal from "./components/AddAudioModal"
import EditAudioModal from "./components/EditAudioModal"
import LoginModal from "./components/LoginModal"

function App() {
  const [darkMode, setDarkMode] = useState(false)  //Tracks whether dark mode is on.
  const [audioBooks, setAudioBooks] = useState([])  //Stores a list of all audiobooks.
  const [currentAudioBook, setCurrentAudioBook] = useState(null)   // //Stores the currently playing audiobook.
  const [showAddModal, setShowAddModal] = useState(false)  //Control the visibility of the Add icon
  const [showEditModal, setShowEditModal] = useState(false)
  const [editingAudioBook, setEditingAudioBook] = useState(null)
    //Control the visibility of the Login and Signup modals.
  const [showLoginModal, setShowLoginModal] = useState(false)
  const [showSignupModal, setShowSignupModal] = useState(false)


  // Load data from localStorage on mount
  //Runs once when the app loads ([] means no dependencies).
  //Loads previously saved dark mode and audiobooks from localStorage.
  useEffect(() => {
    const savedDarkMode = localStorage.getItem("darkMode")
    const savedAudioBooks = localStorage.getItem("audioBooks")

    if (savedDarkMode) {
      setDarkMode(JSON.parse(savedDarkMode))
    }

    if (savedAudioBooks) {
      setAudioBooks(JSON.parse(savedAudioBooks))
    }
  }, [])


  // Save to localStorage when data changes
  //Whenever darkMode changes, it's saved to localStorage.
  useEffect(() => {
    localStorage.setItem("darkMode", JSON.stringify(darkMode))
  }, [darkMode])
  //Whenever audioBooks changes (like adding a new one), it's saved to localStorage
  useEffect(() => {
    localStorage.setItem("audioBooks", JSON.stringify(audioBooks))
  }, [audioBooks])


  // Apply dark mode class to document
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add("dark")
    } else {
      document.documentElement.classList.remove("dark")
    }
  }, [darkMode])

  //Toggles dark mode when a user clicks a button.
  const toggleDarkMode = () => {
    setDarkMode(!darkMode)
  }

  //Takes a new audiobook object, adds a unique ID, and adds it to the audioBooks array.
  const handleAddAudioBook = (newAudioBook) => {
    const audioBook = {
      ...newAudioBook,
      id: `audiobook-${Date.now()}`,
    }
    setAudioBooks([...audioBooks, audioBook])
  }

  const handleEditAudioBook = (updatedAudioBook) => {
    setAudioBooks(audioBooks.map((book) => (book.id === updatedAudioBook.id ? updatedAudioBook : book)))
    setShowEditModal(false)
    setEditingAudioBook(null)
  }

  const handleDeleteAudioBook = (audioBookId) => {
    setAudioBooks(audioBooks.filter((book) => book.id !== audioBookId))
    setShowEditModal(false)
    setEditingAudioBook(null)
  }

  //Sets the selected audiobook to play in the ChapterPlayer.
  const handlePlayAudioBook = (audioBook) => {
    setCurrentAudioBook(audioBook)
  }

  const handleEditClick = (audioBook) => {
    setEditingAudioBook(audioBook)
    setShowEditModal(true)
  }

  return (
    //This is the outer container with light/dark background colors.
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors">
      {/* Navbar */}
      <Navbar
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
        onLoginClick={() => setShowLoginModal(true)}
        onSignupClick={() => setShowSignupModal(true)}
      />

      {/* Main Content */}
      {/* Contains the main app content (header, audiobooks, buttons).*/}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">Your Audio Library</h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            Organize and listen to your audiobooks with chapter-by-chapter playback control
          </p>
        </div>

        {/* Audio Books Grid
        If audiobooks exist, it shows them in a grid using AudioCard.
        If not, it shows a message and a book icon */}
        {audioBooks.length > 0 ? (
          // display audiobooks using <AudioCard />
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6 mb-8">
            {audioBooks.map((audioBook) => (
              <AudioCard
                key={audioBook.id}
                audioBook={audioBook}
                onPlay={handlePlayAudioBook}
                onEdit={handleEditClick}
              />
            ))}
          </div>
        ) : (
          // show empty state using <BookOpen /> icon
          <div className="text-center py-16">
            <BookOpen className="h-24 w-24 text-gray-400 dark:text-gray-600 mx-auto mb-4" />
            <h3 className="text-xl font-medium text-gray-900 dark:text-white mb-2">No audiobooks yet</h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">Get started by adding your first audiobook</p>
          </div>
        )}

        {/* Add New Audio Button */}
        <div className="fixed bottom-8 right-8">
          <button
            onClick={() => setShowAddModal(true)}
            className="bg-blue-600 hover:bg-blue-700 text-white p-4 rounded-full shadow-lg hover:shadow-xl transition-all duration-200 transform hover:scale-105"
            aria-label="Add new audiobook"
          >
            <Plus className="h-6 w-6" />
          </button>
        </div>
      </main>

      {/* Modals
       AddAudioModal for adding audiobooks.
      LoginModal for both login and signup. */}
      <AddAudioModal isOpen={showAddModal} onClose={() => setShowAddModal(false)} onSave={handleAddAudioBook} />

      <EditAudioModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setEditingAudioBook(null)
        }}
        onSave={handleEditAudioBook}
        onDelete={handleDeleteAudioBook}
        audioBook={editingAudioBook}
      />

      <LoginModal isOpen={showLoginModal} onClose={() => setShowLoginModal(false)} isSignup={false} />

      <LoginModal isOpen={showSignupModal} onClose={() => setShowSignupModal(false)} isSignup={true} />
      
      {/* Shows the audio player at the bottom when an audiobook is selected to play.*/}
      <ChapterPlayer audioBook={currentAudioBook} onClose={() => setCurrentAudioBook(null)} />
    </div>
  )
}

export default App
