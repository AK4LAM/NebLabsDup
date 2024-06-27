import React from 'react';

const FileInput = ({ handleFileChange }) => {
  return (
    <div className="transition-all duration-300 focus-within:scale-105">
      <label htmlFor="fileInput" className="block text-sm font-medium text-gray-600 mb-1">
        Upload Files
      </label>
      <input
        type="file"
        id="fileInput"
        onChange={handleFileChange}
        multiple
        className="w-full text-sm text-gray-500
          file:mr-4 file:py-2 file:px-4
          file:rounded-full file:border-0
          file:text-sm file:font-medium
          file:bg-blue-50 file:text-blue-700
          hover:file:bg-blue-100 transition-colors duration-300"
      />
    </div>
  );
};

export default FileInput;