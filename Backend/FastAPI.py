# FastAPI.py
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from typing import List, Optional
from pydantic import BaseModel
from starlette.responses import StreamingResponse
from OpenAiRequests import messageRun, uploadDocs
import logging
import asyncio
import base64
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

# Define Pydantic models for the request bodies
#class MessageRequest(BaseModel):
#    content: str

# Endpoint for chat messages with file uploads
@app.post("/chat/")
async def chat_endpoint(
    message: str = Form(...), 
    files: List[UploadFile] = File([])
):

    logger.info(f"Received message: {message}")
    logger.info(f"Received files: {[file.filename for file in files]}")

    processed_files = []
    for file in files:
        contents = await file.read()
        encoded_contents = base64.b64encode(contents).decode('utf-8')
        processed_files.append({
            "filename": file.filename,
            "content_type": file.content_type,
            "content": encoded_contents
        })
    
    logger.info(f"Processed files: {[f['filename'] for f in processed_files]}")
    
    async def event_stream():
        try:
            async for response in messageRun(message, files=processed_files):
                if isinstance(response, str):
                    yield f"data: {response}\n\n"
                else:
                    logger.error(f"Invalid response type: {type(response)}")
                    yield f"data: [Invalid response type]\n\n"
        except asyncio.CancelledError:
            logger.warning("Streaming response cancelled.")
            raise

    return StreamingResponse(event_stream(), media_type="text/event-stream")

@app.get("/test")
async def test():
    return {"message": "Test successful"}