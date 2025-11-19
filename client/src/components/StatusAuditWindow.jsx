import React from 'react';
import { UploadIcon } from './Icons';

export default function StatusAuditWindow({ status, auditLog, onFileUpload, isProcessing }) {

  // Configuration for different statuses
  const statusConfig = {
    pending: {
      text: 'Pending Verification',
      bgColor: 'bg-yellow-100',
      textColor: 'text-yellow-800',
      borderColor: 'border-yellow-300',
      icon: <div className="w-3 h-3 rounded-full bg-yellow-500 animate-pulse"></div>,
    },
    approved: {
      text: 'Verification Approved',
      bgColor: 'bg-green-100',
      textColor: 'text-green-800',
      borderColor: 'border-green-300',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 16 16" fill="currentColor" className="w-4 h-4 text-green-600">
          <path fillRule="evenodd" d="M8 15A7 7 0 1 0 8 1a7 7 0 0 0 0 14Zm3.84-8.4-3.28 3.28a.75.75 0 0 1-1.06 0L5.16 7.54a.75.75 0 0 1 1.06-1.06L7.5 8.19l2.72-2.72a.75.75 0 0 1 1.06 1.06Z" clipRule="evenodd" />
        </svg>
      ),
    },
    rejected: {
      text: 'Verification Failed',
      bgColor: 'bg-red-100',
      textColor: 'text-red-800',
      borderColor: 'border-red-300',
      icon: (
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-red-600">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.28 7.22a.75.75 0 00-1.06 1.06L8.94 10l-1.72 1.72a.75.75 0 101.06 1.06L10 11.06l1.72 1.72a.75.75 0 101.06-1.06L11.06 10l1.72-1.72a.75.75 0 00-1.06-1.06L10 8.94 8.28 7.22z" clipRule="evenodd" />
        </svg>
      ),
    },
  };

  const currentStatus = statusConfig[status] || statusConfig.pending;

  return (
    <>
      {/* Card 1: Verification Status + Upload */}
      <div className="bg-white rounded-lg shadow-lg border border-slate-200">
        <div className="p-4 border-b border-slate-200 flex justify-between items-center">
          <h3 className="text-lg font-semibold text-slate-900">Verification Status</h3>
        </div>
        <div className="p-6 space-y-4">
          {/* Status Badge */}
          <div className={`flex items-center space-x-3 p-4 rounded-lg ${currentStatus.bgColor} border ${currentStatus.borderColor}`}>
            <span className="flex-shrink-0">{currentStatus.icon}</span>
            <span className={`font-medium ${currentStatus.textColor}`}>
              {currentStatus.text}
            </span>
          </div>

          {/* Upload Button Area (Show only if pending OR rejected so they can retry) */}
          {(status === 'pending' || status === 'rejected') && (
             <div className="mt-4">
                <label 
                  className={`flex items-center justify-center w-full px-4 py-3 rounded-lg border-2 border-dashed border-slate-300 cursor-pointer hover:border-blue-500 hover:bg-blue-50 transition-all ${isProcessing ? 'opacity-50 cursor-not-allowed' : ''}`}
                >
                  {isProcessing ? (
                    <div className="flex items-center space-x-2 text-slate-500">
                      <svg className="animate-spin h-5 w-5 text-blue-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      <span>Processing...</span>
                    </div>
                  ) : (
                    <div className="flex items-center space-x-2 text-slate-600">
                      <UploadIcon />
                      <span>{status === 'rejected' ? 'Try Uploading Again' : 'Upload ID Document'}</span>
                    </div>
                  )}
                  <input 
                    type="file" 
                    className="hidden" 
                    accept="image/*"
                    onChange={onFileUpload}
                    disabled={isProcessing}
                  />
                </label>
             </div>
          )}
        </div>
      </div>

      {/* Card 2: Audit Trail */}
      <div className="bg-white rounded-lg shadow-lg border border-slate-200 mt-6">
        <div className="p-4 border-b border-slate-200">
          <h3 className="text-lg font-semibold text-slate-900">Audit Trail</h3>
        </div>
        <div className="p-6">
          <div className="space-y-3 text-sm text-slate-600 h-48 overflow-y-auto pr-2">
            {auditLog.slice().reverse().map((item, index) => (
              <div key={index} className="flex justify-between items-center pb-2 border-b border-slate-100 last:border-b-0">
                <span>{item.message}</span>
                <span className="text-xs text-slate-400 flex-shrink-0 ml-2">
                  {item.time.toLocaleTimeString()}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}