# FastAPI.py
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from typing import List
from pydantic import BaseModel
from starlette.responses import StreamingResponse
from OpenAiRequests import *
import logging

### LAUNCH FASTAPI ###
# Install uvicorn if in new environment 
# pip install uvicorn
# Run the FastAPI application
# uvicorn FastAPI:app --reload
# Access auto-generated documentation at http://127.0.0.1:8000/docs
# Also acts as a test for whether server is up and running or not
app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define Pydantic models for the request bodies
class MessageRequest(BaseModel):
    content: str

class ImageMessageRequest(BaseModel):
    message: str

# Server Test
# @app.get("/")
# async def root():
#     return {"message": "Hello World"}

# Endpoint for message requests
@app.post("/message/")
async def message_user(request: MessageRequest):
    return StreamingResponse(messageRun(request.content), media_type="text/plain")

# Endpoint for file uploads with message
@app.post("/uploadfiles/")
async def create_upload_file(
    message: str = Form(""), 
    files: List[UploadFile] = File(...)
):
    try:
        # Process each file using the uploadImage function
        results = []
        for file in files:
            result = await uploadImage(file, message)
            results.append(result)
        return results
    except Exception as e:
        logger.error(f"Error processing image: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))
