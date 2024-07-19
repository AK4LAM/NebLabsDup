# FastAPI.py
from fastapi import FastAPI, HTTPException, UploadFile, File, Form
from typing import List, Optional
from pydantic import BaseModel
from starlette.responses import StreamingResponse
from OpenAiRequests import messageRun, uploadDocs
import logging
import asyncio
import base64

app = FastAPI()

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