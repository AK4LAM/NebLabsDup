import React, { useState } from 'react';

const FastAPIInteraction = () => {
  // State variables for managing input, files, result, and loading status
  const [textInput, setTextInput] = useState('');
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  // Handler of changes in text input field
  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  // Handler of changes in file input field
  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  // Handler of form submission
  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevent default form submission
    setIsLoading(true); // Set loading state to true
    setResult(''); // Clear previous result

    try {
      // Send text input if provided
      if (textInput) {
        const textResponse = await fetch('/message', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: textInput }),
        });

        if (!textResponse.ok) {
          throw new Error(`HTTP error! status: ${textResponse.status}`);
        }

        // Stream the response
        const reader = textResponse.body.getReader();
        const decoder = new TextDecoder();

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          setResult(prev => prev + decoder.decode(value));
        }
      }

      // Upload files if any are selected
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));

        const fileResponse = await fetch('/uploadfiles/', {
          method: 'POST',
          body: formData,
        });

        if (!fileResponse.ok) {
          throw new Error(`HTTP error! status: ${fileResponse.status}`);
        }

        const fileResult = await fileResponse.json();
        setResult(prev => prev + '\n' + JSON.stringify(fileResult));
      }
    } catch (error) {
      console.error('Error:', error);
      setResult('An error occurred. Please try again.');
    } finally {
      setIsLoading(false); // Reset loading state
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-gray-50 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-3xl font-light mb-6 text-gray-800">FastAPI Interaction</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="transition-all duration-300 focus-within:scale-105">
          <label htmlFor="textInput" className="block text-sm font-medium text-gray-600 mb-1">
            Text Input
          </label>
          <input
            type="text"
            id="textInput"
            value={textInput}
            onChange={handleTextChange}
            className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:border-blue-500 focus:ring focus:ring-blue-200 focus:ring-opacity-50 transition-all duration-300"
            placeholder="Enter your message"
          />
        </div>
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
        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-lg text-sm font-medium text-white bg-blue-500 hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition-all duration-300 ${
            isLoading ? 'opacity-50 cursor-not-allowed' : ''
          }`}
        >
          {isLoading ? 'Processing...' : 'Submit'}
        </button>
      </form>
      {result && (
        <div className="mt-6 transition-all duration-300">
          <h3 className="text-lg font-medium text-gray-800 mb-2">Result:</h3>
          <pre className="whitespace-pre-wrap bg-white p-4 rounded-lg border border-gray-200 text-sm text-gray-600 overflow-auto max-h-60">
            {result}
          </pre>
        </div>
      )}
    </div>
  );
};

export default FastAPIInteraction;
