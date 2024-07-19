// CustomerSupportWidget.jsx
import React, { useState, useRef } from 'react';
import TextInput from './TextInput';
import FileInput from './FileInput';
import SubmitButton from './SubmitButton';
import Chat from './Chat';
import ImagePreview from './ImagePreview';
import './CustomerSupportWidget.css';

// Properties
const Title = "Customer Support Widget";

// Ensure this URL points to your FastAPI server
const OpenAPIurl = "/api"; 

// Get the API Key from environment variables
// const api_key = import.meta.env.VITE_OPENAI_API_KEY;

const CustomerSupportWidget = () => {
  const [textInput, setTextInput] = useState('');
  const [files, setFiles] = useState([]);
  const [result, setResult] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [imagePreviews, setImagePreviews] = useState([]);

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleFileChange = (e) => {
    const filesArray = Array.from(e.target.files);
    
    // Map each file to its corresponding URL and store in an array
    const newImagePreviews = filesArray.map(file => URL.createObjectURL(file));
    
    setFiles(prevFiles => [...prevFiles, ...filesArray]);
    setImagePreviews(prevPreviews => [...prevPreviews, ...newImagePreviews]);
  };

  const removeImagePreview = (index) => {
    setImagePreviews(prevPreviews => prevPreviews.filter((_, i) => i !== index));
    setFiles(prevFiles => prevFiles.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult('');

    try {
      if (textInput && files.length === 0) {
        setMessages(prev => [...prev, { sender: 'user', text: textInput }]);
        const textResponse = await fetch(`${OpenAPIurl}/message/`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ content: textInput }),
        });
        if (!textResponse.ok) {
          throw new Error(`Text submission failed: ${textResponse.statusText}`);
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
        setMessages(prev => [...prev, { sender: 'system', text: resultText }]);
      }

      if (files.length > 0) {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
        if (textInput) {
          formData.append('message', textInput);
          setMessages(prev => [...prev, { sender: 'user', text: textInput }]);
        }
        const fileResponse = await fetch(`${OpenAPIurl}/uploadfiles/`, {
          method: 'POST',
          body: formData,
        });
        if (!fileResponse.ok) {
          throw new Error(`File upload failed: ${fileResponse.statusText}`);
        }
        const fileResult = await fileResponse.json();
        setResult(prev => prev + '\n' + JSON.stringify(fileResult, null, 2));
        setMessages(prev => [...prev, { sender: 'system', text: JSON.stringify(fileResult, null, 2) }]);
      }
    } catch (error) {
      console.error('Error:', error);
      setResult(`An error occurred: ${error.message}`);
      setMessages(prev => [...prev, { sender: 'system', text: `An error occurred: ${error.message}` }]);
    } finally {
      setIsLoading(false);
      setTextInput('');
      setFiles([]);
      setImagePreviews([]);
    }
  };


  return (
    <div className="customer-support-widget-container">
      <h2 className="customer-support-widget-title">{Title}</h2>
      <div className="customer-support-widget-content">
        <Chat messages={messages} />
      </div>
      <form onSubmit={handleSubmit} className="customer-support-widget-form">
        <div className="customer-support-widget-input-container">
          <div className="customer-support-widget-image-preview-container">
            {imagePreviews.map((preview, index) => (
              <ImagePreview
                key={index}
                imagePreview={preview}
                setImagePreview={() => removeImagePreview(index)}
              />
            ))}
          </div>
          <div className="customer-support-widget-controls">
            <FileInput
              handleFileChange={handleFileChange}
              className="customer-support-widget-file-input"
            />
            <TextInput
              textInput={textInput}
              handleTextChange={handleTextChange}
              className="customer-support-widget-input"
            />
            <SubmitButton
              isLoading={isLoading}
              className="customer-support-widget-submit-button"
            />
          </div>
        </div>
      </form>
    </div>
  );
};

export default CustomerSupportWidget;
