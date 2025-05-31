// src/components/FileUpload.jsx
import React, { useState } from 'react';

function FileUpload({ onFileSelect }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [error, setError] = useState('');

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const allowedTypes = [
        'text/csv',
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
        'application/vnd.ms-excel', // .xls (older excel)
        'text/plain',
        'application/pdf',
      ];
      const fileExtension = file.name.split('.').pop().toLowerCase();
      const validExtensions = ['csv', 'xlsx', 'txt', 'pdf'];

      // Check by extension first as MIME types can be tricky
      if (validExtensions.includes(fileExtension) || allowedTypes.includes(file.type)) {
        setSelectedFile(file);
        onFileSelect(file); // Pass the file to the parent component
        setError('');
      } else {
        setSelectedFile(null);
        onFileSelect(null);
        setError('Invalid file type. Please upload CSV, XLSX, TXT, or PDF.');
        alert('Invalid file type. Please upload CSV, XLSX, TXT, or PDF.');
      }
    }
  };

  return (
    <div className="card mb-3">
      <div className="card-body">
        <h5 className="card-title">Upload Data File</h5>
        <div className="mb-3">
          <input
            type="file"
            className="form-control"
            accept=".csv,.xlsx,.txt,.pdf"
            onChange={handleFileChange}
          />
        </div>
        {selectedFile && (
          <p className="text-success">
            File selected: <strong>{selectedFile.name}</strong>
          </p>
        )}
        {error && <p className="text-danger">{error}</p>}
      </div>
    </div>
  );
}

export default FileUpload;