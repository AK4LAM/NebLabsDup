// FastAPIInteraction.jsx
import React, { useState } from 'react';
import TextInput from '../components/TextInput';
import FileInput from '../components/FileInput';
import ResultDisplay from '../components/ResultDisplay';

const OpenAPIurl = "http://127.0.0.1:8000"; // Ensure this URL points to your FastAPI server

const FastAPIInteraction = () => {
  const [textInput, setTextInput] = useState('');
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult('');
  
    try {
      // Handle text input submission
      if (textInput) {
        const textResponse = await fetch(`${OpenAPIurl}/message/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: textInput }),
        });
  
        if (!textResponse.ok) {
          throw new Error(`HTTP error! status: ${textResponse.status}`);
        }
  
        const reader = textResponse.body.getReader();
        const decoder = new TextDecoder();
  
        let resultText = '';
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          resultText += decoder.decode(value);
          setResult(prev => prev + resultText);
        }
      }
  
      // Handle file input submission
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
  
        const fileResponse = await fetch(`${OpenAPIurl}/uploadfiles/`, {
          method: 'POST',
          body: formData,
        });
  
        if (!fileResponse.ok) {
          throw new Error(`HTTP error! status: ${fileResponse.status}`);
        }
  
        const fileResult = await fileResponse.json();
        setResult(prev => prev + '\n' + JSON.stringify(fileResult, null, 2)); // Pretty print JSON
      }
    } catch (error) {
      console.error('Error:', error);
      setResult(`An error occurred: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-md mx-auto bg-gray-50 rounded-3xl shadow-lg transition-all duration-300 hover:shadow-xl">
      <h2 className="text-3xl font-light mb-6 text-gray-800">FastAPI Interaction</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <TextInput textInput={textInput} handleTextChange={handleTextChange} />
        <FileInput handleFileChange={handleFileChange} />
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
      <ResultDisplay result={result} />
    </div>
  );
};

export default FastAPIInteraction;