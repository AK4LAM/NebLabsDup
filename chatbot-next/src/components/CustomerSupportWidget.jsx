'use client';
// CustomerSupportWidget.jsx
import React, { useState , useEffect} from 'react';
import TextInput from './TextInput';
import FileInput from './FileInput';
import SubmitButton from './SubmitButton';
import Chat from './Chat';
import ImagePreview from './ImagePreview';
import './CustomerSupportWidget.css';

// Properties
const Title = "Customer Support Widget";

// Define the URL for OpenAPI server
const OpenAPIurl = "/api/chat/";

// Define the CustomerSupportWidget component
const CustomerSupportWidget = () => {
  const [textInput, setTextInput] = useState('');
  const [files, setFiles] = useState([]);
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
  
  useEffect(() => {
    fetch('/api/test')
      .then(response => response.text())
      .then(data => console.log(data))
      .catch(error => console.error('Error:', error));
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsLoading(true);

    const formData = new FormData();
    formData.append('message', textInput || 'The customer has not provided any text.'); 
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      // Add file size check (e.g., 5MB limit)
      if (file.size > 5 * 1024 * 1024) {
        alert(`File ${file.name} is too large. Please upload files smaller than 5MB.`);
        setIsLoading(false);
        return;
      }
      formData.append('files', file);
    }
    
    // Log FormData contents for debugging
    for (let [key, value] of formData.entries()) {
      console.log(formData)
      if (key === 'files') {
        console.log(key, value.name); // Log the file name
      } else {
        console.log(key, value);
      }
    }

    // Add the user's message to the chat
    setMessages(prevMessages => [
      ...prevMessages, 
      { content: textInput, sender: 'user' }
    ]);

    try {
      const response = await fetch(OpenAPIurl, {
          method: 'POST',
          body: formData,
      });

      if (!response.ok) {
        const errorData = await response.text();
        console.error('Fetch error:', errorData);
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let systemMessage = '';

      while (true) {
        const { value, done } = await reader.read();
        if (done) break;
        
        const chunk = decoder.decode(value);
        const lines = chunk.split('\n\n');
        
        for (const line of lines) {
          if (line.startsWith('data: ')) {
            const content = line.slice(6);  // Remove 'data: ' prefix
            if (content.trim() !== '') {
              systemMessage += content;
              // Optionally, update messages in real-time:
              // setMessages(prevMessages => [...prevMessages, { content, sender: 'system' }]);
            }
          }
        }
      }

      // Update the messages state with the accumulated system message
      if (systemMessage.trim() !== '') {
        setMessages(prevMessages => [
            ...prevMessages,
            { content: systemMessage, sender: 'system' }
        ]);
      }

    } catch (error) {
      console.error('Fetch error:', error);
      setMessages(prevMessages => [
        ...prevMessages,
         { content: `Error: ${error.message}`, sender: 'system' }
      ]);
    } finally {
      setIsLoading(false);
      setTextInput('');
      setFiles([]);
      setImagePreviews([]);
    }
  }

  return (
    <div className="customer-support-widget-container">
      <div className="customer-support-widget-header">
        <h2 className="customer-support-widget-title">{Title}</h2>
      </div>
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