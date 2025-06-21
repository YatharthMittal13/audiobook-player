import { useState } from "react"
import { X, Upload, Trash2 } from 'lucide-react'

//isOpen: Boolean → whether the modal is open or hidden.
//onClose: Function to close the modal.
//onSave: Function to handle saving the new audiobook.
const AddAudioModal = ({ isOpen, onClose, onSave }) => {
  const [title, setTitle] = useState("")  //title: Audiobook name.
  const [audioFile, setAudioFile] = useState(null)  //audioFile: Actual audio file uploaded by the user.
  const [coverImage, setCoverImage] = useState(null)  //coverImage: Optional cover file.
  const [chapters, setChapters] = useState([])   //chapters: List of chapter objects.
  const [newChapter, setNewChapter] = useState({ title: "", startTime: 0, endTime: 0 })  //newChapter: Temporary chapter while user is entering it.
  const [audioDuration, setAudioDuration] = useState(0)   //audioDuration: Duration of audio file (auto-fetched using JS).

  
  // Handle Audio File Upload
  //Creates a temporary URL to the uploaded file.
  //Loads metadata to get its total duration in seconds.
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


  //Just stores the uploaded image in coverImage.
  const handleCoverImageChange = (e) => {
    const file = e.target.files?.[0]
    if (file) {
      setCoverImage(file)
    }
  }


  // Add New Chapter
  //Only allows chapters with: A title. endTime > startTime.
  //It adds the chapter to chapters array and resets the newChapter input.
  const addChapter = () => {
    if (newChapter.title && newChapter.endTime > newChapter.startTime) {
      setChapters([...chapters, { ...newChapter }])
      setNewChapter({ title: "", startTime: 0, endTime: 0 })
    }
  }


  //Removes the chapter at a specific index using:
  const removeChapter = (index) => {
    setChapters(chapters.filter((_, i) => i !== index))
  }


  //Checks that required fields (title, audioFile, at least 1 chapter) are filled.
  //Prepares an audiobook object with file URLs and chapter list.
  //Calls onSave to pass the new book to the parent.
  //Resets all fields and closes the modal.
  const handleSave = () => {
    if (title && audioFile && chapters.length > 0) {
      const audioUrl = URL.createObjectURL(audioFile)
      const coverUrl = coverImage ? URL.createObjectURL(coverImage) : ""

      onSave({
        title,
        audioFile: audioUrl,
        coverImage: coverUrl,
        duration: audioDuration,
        chapters: chapters.map((chapter, index) => ({
          ...chapter,
          id: `chapter-${Date.now()}-${index}`,
        })),
      })

      // Reset form
      setTitle("")
      setAudioFile(null)
      setCoverImage(null)
      setChapters([])
      setNewChapter({ title: "", startTime: 0, endTime: 0 })
      onClose()
    }
  }


  //Formats raw seconds (like 125) into "2:05".
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, "0")}`
  }

  if (!isOpen) return null

  return (
    //Covers entire screen.
    //Adds a dark semi-transparent background.
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200 dark:border-gray-700">
          <h2 className="text-xl font-bold text-gray-900 dark:text-white">Add New Audiobook</h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-full transition-colors"
            aria-label="Close modal"
          >
            <X className="h-6 w-6 text-gray-600 dark:text-gray-400" />
          </button>
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
            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Audio File</label>
            <div className="flex items-center space-x-4">
              <label className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 cursor-pointer transition-colors">
                <Upload className="h-4 w-4 mr-2" />
                Choose Audio File
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
              Cover Image (Optional)
            </label>
            <label className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 cursor-pointer transition-colors">
              <Upload className="h-4 w-4 mr-2" />
              Choose Cover Image
              <input type="file" accept="image/*" onChange={handleCoverImageChange} className="hidden" />
            </label>
            {coverImage && (
              <span className="text-sm text-gray-600 dark:text-gray-400 mt-2 block">{coverImage.name}</span>
            )}
          </div>

          {/* Chapter Management */}
          <div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4">Chapters</h3>

            {/* Add New Chapter */}
            <div className="bg-gray-50 dark:bg-gray-700 p-4 rounded-lg mb-4">
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
                    max={audioDuration}
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
                    max={audioDuration}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-600 dark:text-white"
                  />
                </div>
              </div>
              <button
                onClick={addChapter}
                className="mt-3 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
              >
                Add Chapter
              </button>
            </div>

            {/* Chapter List */}
            <div className="space-y-2">
              {chapters.map((chapter, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between p-3 bg-white dark:bg-gray-600 rounded-lg border border-gray-200 dark:border-gray-500"
                >
                  <div>
                    <div className="font-medium text-gray-900 dark:text-white">{chapter.title}</div>
                    <div className="text-sm text-gray-600 dark:text-gray-400">
                      {formatTime(chapter.startTime)} - {formatTime(chapter.endTime)} (
                      {formatTime(chapter.endTime - chapter.startTime)})
                    </div>
                  </div>
                  <button
                    onClick={() => removeChapter(index)}
                    className="p-2 text-red-600 hover:bg-red-100 dark:hover:bg-red-900 rounded-full transition-colors"
                    aria-label="Remove chapter"
                  >
                    <Trash2 className="h-4 w-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

          {/* Save Button  Only enabled when:  Title is filled.
            Audio is uploaded.
            At least 1 chapter exists. */}
          <div className="flex justify-end space-x-4">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-600 dark:text-gray-400 hover:text-gray-800 dark:hover:text-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={!title || !audioFile || chapters.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              Save Audiobook
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddAudioModal