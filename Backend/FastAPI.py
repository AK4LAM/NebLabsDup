# FastAPI.py
from fastapi import FastAPI, HTTPException, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
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

app = FastAPI()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app.add_middleware(
    CORSMiddleware, 
    allow_origins=["http://localhost:5137"], 
    allow_credentials=True,
    allow_methods=["*"], 
    allow_headers=["*"])

# Define a Pydantic model for the request body
class MessageRequest(BaseModel):
    content: str

#@app.get("/")
#async def root():
#    return {"message": "Hello World"}

# Endpoint for message requests
@app.post("/message/")
async def message_user(request: MessageRequest):
    # Implement the messageRun function or logic here
    # async def messageRun(content: str):
    #    yield f"Processing message: {content}"
    
    return StreamingResponse(messageRun(request.content), media_type="text/plain")

# Endpoint for file uploads
@app.post("/uploadfiles/")
async def create_upload_file(files: List[UploadFile] = File(...)):
    # Implement the uploadDocs function or logic here
    # def uploadDocs(files: List[UploadFile]):
    #    return {"filenames": [file.filename for file in files]}
    
    return uploadDocs(files)