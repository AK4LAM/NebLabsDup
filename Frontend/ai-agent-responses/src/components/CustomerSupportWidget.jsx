// CustomerSupportWidget.jsx
import React, { useState } from 'react';
import TextInput from './TextInput';
import FileInput from './FileInput';
import SubmitButton from './SubmitButton';
import Chat from './Chat';
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
        setMessages(prev => [...prev, { sender: 'user', text: textInput }]);
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
        setMessages(prev => [...prev, { sender: 'system', text: resultText }]);
      }
      //
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
    }
  };

  return (
    <div className="customer-support-widget-container">
      <h2 className="customer-support-widget-title">{ Title}</h2>
      <form onSubmit={handleSubmit} className="space-y-6">
        <TextInput textInput={textInput} handleTextChange={handleTextChange} />
        <FileInput handleFileChange={handleFileChange} />
        <SubmitButton isLoading={isLoading} />
      </form>
      <div className="customer-support-widget-content">
        <Chat messages={messages} />
      </div>
    </div>
  );
};

export default CustomerSupportWidget;