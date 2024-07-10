// CustomerSupportWidget.jsx
import React, { useState } from 'react';
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
  const [imagePreview, setImagePreview] = useState(null);

  const handleTextChange = (e) => {
    setTextInput(e.target.value);
  };

  const handleFileChange = (e) => {
    setFiles(Array.from(e.target.files));
    setImagePreview(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setResult('');

    try {
      // Handle text input submission
      if (textInput) {
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

      // Handle file submission
      if (files.length > 0) {
        const formData = new FormData();
        files.forEach(file => formData.append('files', file));
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
      setImagePreview(null);
    }
  };

  return (
    <div className={`customer-support-widget-container ${imagePreview ? 'customer-support-widget-extended' : ''}`}>
      <h2 className="customer-support-widget-title">{ Title }</h2>
      <div className="customer-support-widget-content">
        <Chat messages={messages} />
      </div>
      <div className="customer-support-widget-image-preview">
        <ImagePreview imagePreview={imagePreview} setImagePreview={setImagePreview} />
      </div>
      <form onSubmit={handleSubmit} className="customer-support-widget-form">
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
      </form>
    </div>
  );
};

export default CustomerSupportWidget;