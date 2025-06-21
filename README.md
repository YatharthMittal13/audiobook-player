# AudioChapter - Modern Audiobook Player

A modern, responsive audiobook player built with React and Tailwind CSS that allows you to organize and listen to your audiobooks with chapter-by-chapter playback control.

## ✨ Features

### 🎵 Audio Management
- **Add Audiobooks**: Upload audio files with custom cover images
- **Chapter Organization**: Define custom chapters with start/end times
- **Edit Functionality**: Modify audiobook details, add/edit/delete chapters
- **Delete Audiobooks**: Remove audiobooks with confirmation dialog

### 🎮 Playback Controls
- **Chapter-by-Chapter Playback**: Listen to specific chapters with time restrictions
- **Advanced Controls**: Play, pause, skip chapters, volume control
- **Playback Speed**: Adjustable speed (0.5x to 2x)
- **Progress Tracking**: Visual progress bar for each chapter

### 🎨 User Interface
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Dark/Light Mode**: Toggle between themes with persistent settings
- **Modern UI**: Clean, intuitive interface with smooth animations
- **Accessibility**: Screen reader support and keyboard navigation

### 💾 Data Persistence
- **Local Storage**: All data saved locally in your browser
- **No Server Required**: Fully client-side application

## 🚀 Quick Start

### Prerequisites
- Node.js (version 16 or higher)
- npm or yarn package manager

### Installation

1. **Clone or Download the Project**
   ```bash
   mkdir audiobook-player-react
   cd audiobook-player-react
   ```

2. **Initialize the Project**
   ```bash
   npm init -y
   ```

3. **Install Dependencies**
   ```bash
   # Core dependencies
   npm install react react-dom lucide-react
   
   # Development dependencies
   npm install -D vite @vitejs/plugin-react tailwindcss postcss autoprefixer
   ```

4. **Create Project Structure**
   ```bash
   mkdir src src/components
   ```

5. **Copy Project Files**
   Copy all the provided files to their respective directories according to the folder structure below.

6. **Start Development Server**
   ```bash
   npm run dev
   ```

7. **Open in Browser**
   Navigate to `http://localhost:3000`

## 📁 Project Structure

```
audiobook-player-react/
├── public/
│   └── vite.svg
├── src/
│   ├── components/
│   │   ├── Navbar.jsx              # Navigation bar with theme toggle
│   │   ├── AudioCard.jsx           # Audiobook card with 3-dot menu
│   │   ├── ChapterPlayer.jsx       # Main audio player component
│   │   ├── AddAudioModal.jsx       # Modal for adding new audiobooks
│   │   ├── EditAudioModal.jsx      # Modal for editing audiobooks
│   │   └── LoginModal.jsx          # Login/signup modal (UI only)
│   ├── App.jsx                     # Main application component
│   ├── main.jsx                    # React entry point
│   └── index.css                   # Global styles and Tailwind imports
├── index.html                      # HTML template
├── package.json                    # Project dependencies and scripts
├── vite.config.js                  # Vite configuration
├── tailwind.config.js              # Tailwind CSS configuration
├── postcss.config.js               # PostCSS configuration
└── README.md                       # This file
```

## 🎯 Usage Guide

### Adding Your First Audiobook

1. **Click the + Button**: Located in the bottom-right corner
2. **Fill in Details**:
   - Enter the audiobook title
   - Upload an audio file (.mp3, .wav, .m4a, .ogg)
   - Optionally upload a cover image
3. **Add Chapters**:
   - Enter chapter title
   - Set start time (in seconds)
   - Set end time (in seconds)
   - Click "Add Chapter"
4. **Save**: Click "Save Audiobook"

### Playing Audiobooks

1. **Select Audiobook**: Click the "Play" button on any audiobook card
2. **Choose Chapter**: Click on any chapter in the left sidebar
3. **Use Controls**:
   - Play/Pause button in the center
   - Skip to previous/next chapter
   - Adjust volume with the slider
   - Change playback speed (0.5x to 2x)
   - Seek within the current chapter

### Editing Audiobooks

1. **Access Edit Menu**: Click the 3-dot menu (⋮) in the top-right corner of any audiobook card
2. **Select "Edit Book"**: Opens the edit modal
3. **Modify Details**:
   - Change title
   - Replace audio file (optional)
   - Replace cover image (optional)
   - Add new chapters
   - Edit existing chapters
   - Delete chapters
4. **Save Changes**: Click "Save Changes"

### Deleting Audiobooks

1. **Open Edit Modal**: Click 3-dot menu → "Edit Book"
2. **Click "Delete Book"**: Red button in the modal header
3. **Confirm Deletion**: Click "Delete" in the confirmation dialog

## ⚙️ Configuration

### Supported Audio Formats
- MP3 (.mp3)
- WAV (.wav)
- M4A (.m4a)
- OGG (.ogg)

### Supported Image Formats
- JPEG (.jpg, .jpeg)
- PNG (.png)
- GIF (.gif)
- WebP (.webp)

### Browser Compatibility
- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🛠️ Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Run linter
npm run lint
```

### Development Server
- **URL**: http://localhost:3000
- **Hot Reload**: Enabled
- **Port**: 3000 (configurable in vite.config.js)

### Building for Production

```bash
npm run build
```

This creates a `dist` folder with optimized files ready for deployment.

## 🎨 Customization

### Themes
The app supports both light and dark themes. The theme preference is automatically saved and restored.

### Colors
To customize colors, edit the Tailwind configuration in `tailwind.config.js`:

```javascript
theme: {
  extend: {
    colors: {
      // Add your custom colors here
      primary: '#your-color',
    }
  }
}
```

### Styling
Global styles are defined in `src/index.css`. Component-specific styles use Tailwind CSS classes.

## 📱 Responsive Design

The application is fully responsive and works on:
- **Desktop**: Full feature set with sidebar layout
- **Tablet**: Adapted layout with collapsible sections
- **Mobile**: Touch-optimized interface with stacked layout

## 🔒 Privacy & Data

- **Local Storage Only**: All data is stored locally in your browser
- **No External Servers**: No data is sent to external servers
- **No Tracking**: No analytics or tracking implemented
- **File Privacy**: Audio files are processed locally using browser APIs

## 🐛 Troubleshooting

### Common Issues

**Audio not playing:**
- Check if the audio file format is supported
- Ensure the browser allows audio playback
- Try refreshing the page

**Chapters not working:**
- Verify start time is less than end time
- Check that times are within the audio file duration
- Ensure times are in seconds, not minutes

**Dark mode not persisting:**
- Check if localStorage is enabled in your browser
- Clear browser cache and try again

**Files not uploading:**
- Check file size (browsers have limits)
- Ensure file format is supported
- Try a different file

### Performance Tips

- **Large Files**: For better performance, consider using compressed audio formats
- **Many Audiobooks**: The app handles hundreds of audiobooks efficiently
- **Chapter Count**: No limit on chapters per audiobook

## 🤝 Contributing

This is an open-source project. Feel free to:
- Report bugs
- Suggest features
- Submit improvements
- Share your experience

## 📄 License

This project is open source and available under the MIT License.

## 🙏 Acknowledgments

- **React**: UI framework
- **Tailwind CSS**: Styling framework
- **Lucide React**: Icon library
- **Vite**: Build tool

## 📞 Support

If you encounter any issues or have questions:
1. Check the troubleshooting section above
2. Review the usage guide
3. Check browser console for error messages

---

**Enjoy your audiobook listening experience with AudioChapter!** 🎧📚
```

This comprehensive README file includes:

- **Complete setup instructions** with all commands
- **Detailed usage guide** for all features
- **Project structure** explanation
- **Troubleshooting section** for common issues
- **Development information** for contributors
- **Configuration options** and customization
- **Browser compatibility** information
- **Privacy and data handling** details

The file is well-structured with clear sections, code examples, and emoji icons for better readability.