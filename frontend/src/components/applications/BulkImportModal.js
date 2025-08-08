import React, { useState, useRef, useEffect, useCallback } from 'react';
import ReactDOM from 'react-dom';
import { 
  XMarkIcon, DocumentArrowUpIcon, DocumentTextIcon, ArrowDownTrayIcon 
} from '@heroicons/react/24/outline';
import apiService from '../../services/api';

const BulkImportModal = ({ isOpen, onClose, onImportComplete }) => {
  const [activeTab, setActiveTab] = useState('file');
  const [isUploading, setIsUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [importResult, setImportResult] = useState(null);
  const [error, setError] = useState(null);
  const [jsonData, setJsonData] = useState('');
  const fileInputRef = useRef(null);

  // Lock body scroll while open
  useEffect(() => {
    if (!isOpen) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = prev; };
  }, [isOpen]);

  // Close on ESC
  const onKeyDown = useCallback((e) => {
    if (e.key === 'Escape') handleClose();
  }, []);
  useEffect(() => {
    if (!isOpen) return;
    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [isOpen, onKeyDown]);

  const handleFileUpload = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    setError(null);
    setImportResult(null);
    setUploadProgress(0);

    try {
      const formData = new FormData();
      formData.append('file', file);

      const response = await apiService.bulkImportApplications(formData, {
        // If your apiService supports it, this will animate the bar
        onUploadProgress: (evt) => {
          if (!evt.total) return;
          setUploadProgress(Math.round((evt.loaded / evt.total) * 100));
        }
      });

      setImportResult(response);
      onImportComplete?.(response);
    } catch (err) {
      setError(err?.message || 'Import failed. Please try again.');
    } finally {
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleJsonImport = async () => {
    if (!jsonData.trim()) {
      setError('Please enter JSON data');
      return;
    }
    setIsUploading(true);
    setError(null);
    setImportResult(null);

    try {
      let applications = JSON.parse(jsonData);
      if (!Array.isArray(applications)) applications = { applications };
      const response = await apiService.bulkImportApplicationsJson(applications);
      setImportResult(response);
      onImportComplete?.(response);
    } catch (err) {
      setError(err?.message || 'Import failed. Please try again.');
    } finally {
      setIsUploading(false);
    }
  };

  const handleDownloadTemplate = async () => {
    try {
      const response = await apiService.getSampleTemplate();
      const blob = new Blob([response.csv_content], { type: 'text/csv' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = response.filename || 'applications_template.csv';
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);
    } catch {
      setError('Failed to download template');
    }
  };

  const handleClose = () => {
    setActiveTab('file');
    setError(null);
    setImportResult(null);
    setJsonData('');
    setUploadProgress(0);
    onClose?.();
  };

  if (!isOpen) return null;

  // Backdrop + modal content (in a portal so it escapes parent stacking contexts)
  return ReactDOM.createPortal(
    <div
      className="fixed inset-0 z-[1000] flex items-center justify-center"
      aria-modal="true"
      role="dialog"
      aria-labelledby="import-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/50 backdrop-blur-[1px]"
        onClick={handleClose}
      />

             {/* Dialog */}
       <div className="relative bg-white rounded-xl shadow-2xl max-w-3xl w-[min(96vw,820px)] mx-4 max-h-[85vh] overflow-y-auto ring-1 ring-black/5">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <h2 id="import-modal-title" className="text-lg font-semibold text-gray-900">
            Import Applications from File
          </h2>
          <button
            onClick={handleClose}
            className="text-gray-400 hover:text-gray-600 p-1 rounded-md hover:bg-gray-100"
            aria-label="Close"
          >
            <XMarkIcon className="h-6 w-6" />
          </button>
        </div>

        {/* Tabs */}
        <div className="border-b border-gray-200 px-6">
          <nav className="flex gap-6">
            <button
              onClick={() => {
                setActiveTab('file');
                setImportResult(null);
                setError(null);
              }}
              className={`py-3 border-b-2 -mb-px text-sm font-medium transition-colors ${
                activeTab === 'file'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <DocumentArrowUpIcon className="h-5 w-5 inline mr-2" />
              File Upload
            </button>
            <button
              onClick={() => {
                setActiveTab('json');
                setImportResult(null);
                setError(null);
              }}
              className={`py-3 border-b-2 -mb-px text-sm font-medium transition-colors ${
                activeTab === 'json'
                  ? 'border-blue-600 text-blue-700'
                  : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              <DocumentTextIcon className="h-5 w-5 inline mr-2" />
              JSON Data
            </button>
          </nav>
        </div>

        {/* Scrollable content */}
        <div className="p-6 space-y-4 overflow-y-auto">
          {activeTab === 'file' && (
            <div className="space-y-4">
                              <div className="text-sm text-gray-600 space-y-1">
                  <p>Ready to import your applications? Upload a CSV or Excel file to get started.</p>
                  <p><strong>Required columns:</strong> company, position, status</p>
                  <p><strong>Optional columns:</strong> applied_date, notes</p>
                  <p><strong>Supported formats:</strong> CSV, Excel (.xlsx, .xls)</p>
                  <p><strong>Status options:</strong> Applied, Interviewing, Offer, Rejected, Ghosted, Withdrawn</p>
                  <p><strong>Date format:</strong> YYYY-MM-DD, MM/DD/YYYY, or MM/DD (defaults to current year)</p>
                </div>

              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center">
                <DocumentArrowUpIcon className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                <p className="text-sm text-gray-600 mb-3">
                  {isUploading ? 'Uploading…' : 'Drag & drop your file here or click to browse'}
                </p>

                {isUploading && (
                  <div className="w-full bg-gray-200 rounded-full h-2 mb-3">
                    <div
                      className="bg-blue-600 h-2 rounded-full transition-all"
                      style={{ width: `${uploadProgress}%` }}
                    />
                  </div>
                )}

                <button
                  onClick={() => fileInputRef.current?.click()}
                  disabled={isUploading}
                  className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                  Choose File
                </button>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".csv,.xlsx,.xls"
                  onChange={handleFileUpload}
                  className="hidden"
                />
              </div>

              <div className="flex items-center justify-center">
                <button
                  onClick={handleDownloadTemplate}
                  className="inline-flex items-center text-sm text-blue-600 hover:text-blue-700"
                >
                  <ArrowDownTrayIcon className="h-4 w-4 mr-1" />
                  Download Sample Template
                </button>
              </div>
            </div>
          )}

          {activeTab === 'json' && (
            <div className="space-y-4">
              <div className="text-sm text-gray-600">
                <p className="mb-2">Paste JSON data with your applications.</p>
                <p className="mb-4">Format: Array of objects with <code>company</code>, <code>position</code>, <code>status</code> fields.</p>
              </div>

              <textarea
                value={jsonData}
                onChange={(e) => setJsonData(e.target.value)}
                placeholder={`[
  {"company":"Google","position":"Software Engineer Co-op","status":"Applied","applied_date":"2024-01-15","notes":"Applied through LinkedIn"}
]`}
                rows={12}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm"
              />

              <div className="flex justify-end">
                <button
                  onClick={handleJsonImport}
                  disabled={isUploading || !jsonData.trim()}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-60"
                >
                  {isUploading ? 'Importing…' : 'Import JSON'}
                </button>
              </div>
            </div>
          )}

          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <p className="text-red-800 text-sm">{error}</p>
            </div>
          )}

          {importResult && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="text-green-800 font-medium mb-2">Import Complete!</h3>
              <div className="text-sm text-green-700 space-y-1">
                <p>✅ {importResult.summary.successful} applications imported successfully</p>
                {!!importResult.summary.failed && <p>❌ {importResult.summary.failed} applications failed to import</p>}
                {!!importResult.duplicates_skipped && <p>⚠️ {importResult.duplicates_skipped} duplicates skipped</p>}
                {!!importResult.total_xp_gained && <p>🎉 +{importResult.total_xp_gained} XP gained</p>}
                {!!importResult.new_achievements?.length && <p>🏆 {importResult.new_achievements.length} new achievements unlocked</p>}
                {!!importResult.summary.total_processed && <p>📊 Total processed: {importResult.summary.total_processed} rows</p>}
              </div>

              {!!importResult.failed_imports?.length && (
                <details className="mt-3">
                  <summary className="text-sm font-medium text-green-800 cursor-pointer">
                    View failed imports
                  </summary>
                  <div className="mt-2 text-xs space-y-1">
                    {importResult.failed_imports.map((failed, i) => (
                      <div key={i} className="bg-red-100 p-2 rounded">
                        <p className="font-medium">Row {failed.row}:</p>
                        <ul className="list-disc list-inside">
                          {failed.errors.map((e, j) => <li key={j}>{e}</li>)}
                        </ul>
                      </div>
                    ))}
                  </div>
                </details>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            onClick={handleClose}
            className="px-4 py-2 text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200"
          >
            Close
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default BulkImportModal;
