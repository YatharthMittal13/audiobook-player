"use client"

import { useState, useEffect } from "react"
import { X, Upload, Trash2, Plus, Edit3 } from "lucide-react"

//isOpen: Whether modal is shown or not.
//onClose(): Called to close modal.
//onSave(updatedBook): Called when user saves changes.
//onDelete(id): Called when user confirms deletion.
//audioBook: The audiobook to be edited.
const EditAudioModal = ({ isOpen, onClose, onSave, onDelete, audioBook }) => {
  //These manage: Form fields. File uploads. Chapters list. Modal confirmation for deletion.
  const [title, setTitle] = useState("")
  const [audioFile, setAudioFile] = useState(null)
  const [coverImage, setCoverImage] = useState(null)
  const [chapters, setChapters] = useState([])
  const [newChapter, setNewChapter] = useState({ title: "", startTime: 0, endTime: 0 })
  const [audioDuration, setAudioDuration] = useState(0)
  const [editingChapter, setEditingChapter] = useState(null)
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)

  // Initialize form with audioBook data when modal opens
  useEffect(() => {
    if (audioBook && isOpen) {
      setTitle(audioBook.title)
      setChapters([...audioBook.chapters])
      setAudioDuration(audioBook.duration)
      setAudioFile(null) // Reset file inputs
      setCoverImage(null)
    }
  }, [audioBook, isOpen])

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setTitle("")
      setAudioFile(null)
      setCoverImage(null)
      setChapters([])
      setNewChapter({ title: "", startTime: 0, endTime: 0 })
      setAudioDuration(0)
      setEditingChapter(null)
      setShowDeleteConfirm(false)
    }
  }, [isOpen])

  //a. handleAudioFileChange: Reads duration from new audio file
  const handleAudioFileChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setAudioFile(file)
      const url = URL.createObjectURL(file)
      const audio = new Audio(url)
      audio.addEventListener("loadedmetadata", () => {
        setAudioDuration(audio.duration)
      })
    }
  }

  //b. handleCoverImageChange: Just stores the file object.
  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)
    }
  }

  //a. Add new chapter:
  //Only adds if title is present and times are valid.
  //Adds a unique id using Date.now().
  const addChapter = () => {
    if (newChapter.title && newChapter.endTime > newChapter.startTime) {
      const chapterWithId = {
        ...newChapter,
        id: `chapter-${Date.now()}-${chapters.length}`,
      }
      setChapters([...chapters, chapterWithId])
      setNewChapter({ title: "", startTime: 0, endTime: 0 })
    }
  }

  //b. Edit and remove chapter:
  //startEditingChapter(index) → opens edit form.
  //saveChapterEdit(index, updatedChapter) → updates chapter.
  //removeChapter(index) → deletes it from list.
  const removeChapter = (index) => {
    setChapters(chapters.filter((_, i) => i !== index))
  }

  const startEditingChapter = (index) => {
    setEditingChapter(index)
  }

  const saveChapterEdit = (index, updatedChapter) => {
    const updatedChapters = chapters.map((chapter, i) => (i === index ? { ...chapter, ...updatedChapter } : chapter))
    setChapters(updatedChapters)
    setEditingChapter(null)
  }

  const cancelChapterEdit = () => {
    setEditingChapter(null)
  }
  
  //Ensures required fields are filled.
  //Prepares new data and calls onSave.
  const handleSave = () => {
    if (title && chapters.length > 0) {
      const updatedAudioBook = {
        ...audioBook,
        title,
        chapters,
        duration: audioFile ? audioDuration : audioBook.duration,
        audioFile: audioFile ? URL.createObjectURL(audioFile) : audioBook.audioFile,
        coverImage: coverImage ? URL.createObjectURL(coverImage) : audioBook.coverImage,
      }

      onSave(updatedAudioBook)
    }
  }

  
  //✅ 7. Delete Confirmation
  //If user clicks "Delete Book", a small confirmation modal appears asking for confirmation.
  const handleDelete = () => {
    onDelete(audioBook.id)
  }

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isOpen || !audioBook) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-4xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Edit Audiobook</h2>
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
            >
              Delete Book
            </button>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
              aria-label="Close modal"
            >
              <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
            </button>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Book Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
              placeholder="Enter book title"
            />
          </div>

          {/* Audio File Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Replace Audio File (Optional)
            </label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors">
                <Upload className="h-4 w-4 mr-2" />
                Choose New Audio File
                <input type="file" accept=".mp3,.wav,.m4a,.ogg" onChange={handleAudioFileChange} className="hidden" />
              </label>
              {audioFile && (
                <span className="text-sm text-gray-600 dark:text-gray-400">
                  {audioFile.name} ({formatTime(audioDuration)})
                </span>
              )}
            </div>
          </div>

          {/* Cover Image Upload */}
          <div>
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              Replace Cover Image (Optional)
            </label>
            <label className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 cursor-pointer transition-colors">
              <Upload className="h-4 w-4 mr-2" />
              Choose New Cover Image
              <input type="file" accept="image/*" onChange={handleCoverImageChange} className="hidden" />
            </label>
            {coverImage && (
              <span className="text-sm text-gray-600 dark:text-gray-400 mt-2 block">{coverImage.name}</span>
            )}
          </div>

          {/* Chapter Management */}
          <div>
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">Chapters</h3>
              <span className="text-sm text-gray-600 dark:text-gray-400">
                Total Duration: {formatTime(audioFile ? audioDuration : audioBook.duration)}
              </span>
            </div>

            {/* Add New Chapter */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
              <h4 className="text-md font-medium text-gray-900 dark:text-white mb-3">Add New Chapter</h4>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="md:col-span-2">
                  <input
                    type="text"
                    value={newChapter.title}
                    onChange={(e) => setNewChapter({ ...newChapter, title: e.target.value })}
                    placeholder="Chapter title"
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={newChapter.startTime}
                    onChange={(e) =>
                      setNewChapter({ ...newChapter, startTime: Number.parseFloat(e.target.value) || 0 })
                    }
                    placeholder="Start (seconds)"
                    min="0"
                    max={audioFile ? audioDuration : audioBook.duration}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  />
                </div>
                <div>
                  <input
                    type="number"
                    value={newChapter.endTime}
                    onChange={(e) => setNewChapter({ ...newChapter, endTime: Number.parseFloat(e.target.value) || 0 })}
                    placeholder="End (seconds)"
                    min="0"
                    max={audioFile ? audioDuration : audioBook.duration}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <button
                onClick={addChapter}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors flex items-center"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Chapter
              </button>
            </div>

            {/* Existing Chapters List */}
            <div className="space-y-2">
              {chapters.map((chapter, index) => (
                <div
                  key={chapter.id || index}
                  className="p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
                >
                  {editingChapter === index ? (
                    <EditChapterForm
                      chapter={chapter}
                      onSave={(updatedChapter) => saveChapterEdit(index, updatedChapter)}
                      onCancel={cancelChapterEdit}
                      maxDuration={audioFile ? audioDuration : audioBook.duration}
                    />
                  ) : (
                    <div className="flex items-center justify-between">
                      <div>
                        <div className="font-medium text-gray-900 dark:text-white">{chapter.title}</div>
                        <div className="text-sm text-gray-600 dark:text-gray-400">
                          {formatTime(chapter.startTime)} - {formatTime(chapter.endTime)} (
                          {formatTime(chapter.endTime - chapter.startTime)})
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => startEditingChapter(index)}
                          className="p-2 text-blue-600 hover:bg-blue-100 dark:hover:bg-blue-900 rounded-full transition-colors"
                          aria-label="Edit chapter"
                        >
                          <Edit3 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => removeChapter(index)}
                          className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors"
                          aria-label="Remove chapter"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Save Button */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title || chapters.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center p-4 z-60">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-md">
            <div className="p-6">
              <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-4">Delete Audiobook</h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Are you sure you want to delete "{audioBook.title}"? This action cannot be undone.
              </p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-md transition-colors"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

// Component for editing individual chapters
const EditChapterForm = ({ chapter, onSave, onCancel, maxDuration }) => {
  const [title, setTitle] = useState(chapter.title)
  const [startTime, setStartTime] = useState(chapter.startTime)
  const [endTime, setEndTime] = useState(chapter.endTime)

  const handleSave = () => {
    if (title && endTime > startTime) {
      onSave({ title, startTime, endTime })
    }
  }

  return (
    <div className="space-y-3">
      <input
        type="text"
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Chapter title"
        className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
      />
      <div className="grid grid-cols-2 gap-4">
        <input
          type="number"
          value={startTime}
          onChange={(e) => setStartTime(Number.parseFloat(e.target.value) || 0)}
          placeholder="Start (seconds)"
          min="0"
          max={maxDuration}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
        <input
          type="number"
          value={endTime}
          onChange={(e) => setEndTime(Number.parseFloat(e.target.value) || 0)}
          placeholder="End (seconds)"
          min="0"
          max={maxDuration}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div className="flex justify-end space-x-2">
        <button
          onClick={onCancel}
          className="px-3 py-1 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors"
        >
          Save
        </button>
      </div>
    </div>
  )
}

export default EditAudioModal
