// src/components/DataPreview.jsx
import React, { useState, useEffect } from 'react';
import Papa from 'papaparse';
import * as XLSX from 'xlsx';

function DataPreview({ file }) {
  const [previewData, setPreviewData] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!file) {
      setPreviewData(null);
      setError('');
      return;
    }

    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const fileExtension = file.name.split('.').pop().toLowerCase();
        if (fileExtension === 'csv') {
          Papa.parse(e.target.result, {
            header: true,
            skipEmptyLines: true,
            complete: (results) => {
              setPreviewData({ type: 'csv', data: results.data.slice(0, 10) }); // Show first 10 rows
            },
            error: (err) => setError(`CSV Parsing Error: ${err.message}`),
          });
        } else if (fileExtension === 'xlsx') {
          const data = new Uint8Array(e.target.result);
          const workbook = XLSX.read(data, { type: 'array' });
          const firstSheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[firstSheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 }); // Array of arrays
          setPreviewData({ type: 'excel', data: jsonData.slice(0, 10) }); // Show first 10 rows
        } else if (fileExtension === 'txt') {
          setPreviewData({ type: 'txt', data: e.target.result.substring(0, 1000) }); // Show first 1000 chars
        } else if (fileExtension === 'pdf') {
          // For PDF, we'll show an embed or a message. Full text extraction is more complex.
          // For now, let's create a data URL to embed the PDF for viewing.
          setPreviewData({ type: 'pdf', dataUrl: URL.createObjectURL(file), fileName: file.name });
        } else {
          setError('Unsupported file type for preview.');
          setPreviewData(null);
        }
      } catch (err) {
        setError(`Error processing file: ${err.message}`);
        setPreviewData(null);
      }
    };

    reader.onerror = () => {
      setError('Failed to read file.');
      setPreviewData(null);
    };

    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' || file.name.endsWith('.xlsx')) {
      reader.readAsArrayBuffer(file); // XLSX needs array buffer
    } else if (file.type === 'application/pdf' || file.name.endsWith('.pdf')) {
       // For PDF, we don't read its content here for text preview, just prepare for embed
       // The useEffect logic will handle creating object URL
       // No explicit reader.readAs... here if we only pass the file object for PDF.
       // Actually, for embedding, we might need a data URL or object URL.
       // Let's re-use the onload logic for PDF to create an Object URL
       reader.onload = (e) => { // Re-define onload specifically for PDF if needed or handle in main one
            setPreviewData({ type: 'pdf', dataUrl: URL.createObjectURL(file), fileName: file.name });
       };
       reader.readAsDataURL(file); // This will trigger onload for PDF.

    } else {
      reader.readAsText(file); // For CSV, TXT
    }

     // Cleanup Object URL for PDF when component unmounts or file changes
    return () => {
        if (previewData && previewData.type === 'pdf' && previewData.dataUrl) {
            URL.revokeObjectURL(previewData.dataUrl);
        }
    };

  }, [file]); // Re-run when file changes

  if (error) {
    return <div className="alert alert-danger">Error: {error}</div>;
  }

  if (!previewData) {
    return <p className="text-muted">Select a file to see a preview.</p>;
  }

  const renderTable = (dataArray, isExcel = false) => {
    if (!dataArray || dataArray.length === 0) return <p>No data to display or file is empty.</p>;
    
    let headers = [];
    let rows = [];

    if (isExcel) { // Excel data is array of arrays
        headers = dataArray[0] || [];
        rows = dataArray.slice(1);
    } else { // CSV data is array of objects
        headers = Object.keys(dataArray[0] || {});
        rows = dataArray.map(row => headers.map(header => row[header]));
    }

    return (
      <div className="table-responsive" style={{ maxHeight: '300px', overflowY: 'auto' }}>
        <table className="table table-striped table-bordered table-sm">
          <thead className="thead-dark">
            <tr>
              {headers.map((header, index) => (
                <th key={index}>{header}</th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((row, rowIndex) => (
              <tr key={rowIndex}>
                {row.map((cell, cellIndex) => (
                  <td key={cellIndex}>{typeof cell === 'object' ? JSON.stringify(cell) : cell}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    );
  };

  return (
    <div className="card">
      <div className="card-body">
        <h5 className="card-title">Data Preview (First 10 rows or 1000 characters)</h5>
        {previewData.type === 'csv' && renderTable(previewData.data)}
        {previewData.type === 'excel' && renderTable(previewData.data, true)}
        {previewData.type === 'txt' && (
          <pre style={{ maxHeight: '300px', overflowY: 'auto', whiteSpace: 'pre-wrap', wordBreak: 'break-all' }}>
            {previewData.data}
          </pre>
        )}
        {previewData.type === 'pdf' && (
          <div>
            <p>PDF Preview: <strong>{previewData.fileName}</strong></p>
            <p><em>PDF content preview is best viewed by downloading or specific PDF viewers. Below is an embedded view if your browser supports it. Full text analysis will happen on the backend.</em></p>
            <embed src={previewData.dataUrl} type="application/pdf" width="100%" height="400px" />
          </div>
        )}
      </div>
    </div>
  );
}

export default DataPreview;