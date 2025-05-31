// src/App.jsx
import React, { useState } from 'react';
import FileUpload from './components/FileUpload';
import DataPreview from './components/DataPreview';
import ChatInterface from './components/ChatInterface';
import './App.css';

function App() {
  const [uploadedFile, setUploadedFile] = useState(null);
  const [filePreviewKey, setFilePreviewKey] = useState(0); // To force re-render of preview

  const handleFileSelected = (file) => {
    setUploadedFile(file);
    setFilePreviewKey(prevKey => prevKey + 1); // Change key to re-mount DataPreview
  };

  return (
    <div className="container d-flex flex-column py-4">
      <header className="text-center mb-4">
        <h1>AI Data Analyzer <small className="text-body-secondary">(with Groq)</small></h1>
        <p className="lead">
          Upload your data files (CSV, Excel, TXT, PDF) and ask questions using natural language.
        </p>
      </header>

      <main className="row g-4 flex-grow-1">
        <div className="col-md-5 d-flex flex-column">
          <FileUpload onFileSelect={handleFileSelected} />
          {uploadedFile && (
            <div className="mt-3 flex-grow-1 d-flex flex-column">
              <DataPreview file={uploadedFile} key={filePreviewKey} />
            </div>
          )}
        </div>
        <div className="col-md-7 d-flex flex-column">
          <ChatInterface uploadedFile={uploadedFile} />
        </div>
      </main>

      <footer className="text-center text-muted mt-auto pt-4 pb-2"> {/* mt-auto pushes footer down */}
        <p>© {new Date().getFullYear()} My Data Analyzer Project</p>
      </footer>
    </div>
  );
}

export default App;