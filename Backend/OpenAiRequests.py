# OpenAiRequests.py
from openai import OpenAI
import os
import asyncio
import base64
import io
from fastapi import UploadFile
from typing import List, Union
from pathlib import Path

client = OpenAI(api_key=os.environ["OPENAI_API_KEY"])
assetsPath = ""
assistantIDs: list[dict[str, str]] = []
threadIDs: list[str] = []
tokensUsed: int = 0
fileOverview = []

class QA:
    """A question and answer pair."""
    def __init__(self, question: str, answer: str, sysPrompt: str = ""):
        self.question = question
        self.answer = answer
        self.sysPrompt = sysPrompt

class Chat:
    def __init__(self):
        self.assistant = None
        self.thread = None
        self.messages = []

chats: dict[str, Chat] = {"Chat1": Chat()}
current_chat_id = "Chat1"


def getModels():
    return client.models.list()

def createAssistant(instructions: str = "You are a customer support chatbot, in an e-commerce store that sells clothes. Give text only answers, without text styling and in concise and simple English. Do not list extensively, and ask further questions where necessary.", 
                    name: str = "Customer Support Chatbot", 
                    description: str = "Customer Support Chatbot",
                    tools: list[dict[str, str]] = [{"type": "code_interpreter"}], 
                    model: str = "gpt-4o-mini"):
    assistant = client.beta.assistants.create(
        instructions=instructions,
        name=name,
        description=description,
        tools=tools,
        model=model,
    )
    return assistant

def createThread():
    return client.beta.threads.create()

def retrieveThread(id: str):
    thread = client.beta.threads.retrieve(id)
    return thread

def uploadDocs(files: Union[List[dict], None]):
    if not files:
        return None

    assistantFiles = []
    for file in files:
        if isinstance(file, dict) and all(key in file for key in ['filename', 'content_type', 'content']):
            file_name = file['filename']
            file_type = file['content_type']
            file_content = base64.b64decode(file['content'])

            # Create a file-like object from the content
            file_like = io.BytesIO(file_content)

            uploaded_file = client.files.create(
                file=(file_name, file_like, file_type),
                purpose="assistants"
            )
            assistantFiles.append(
                {"file_id": uploaded_file.id, "tools": [{"type": "file_search"}]}
            )
            fileOverview.append([file_name, uploaded_file.id])
        else:
            print(f"Skipping invalid file: {file}")
    return assistantFiles


def createMessage(threadID, content, role, files=None):
    message_content = [{"type": "text", "text": content}]
    
    if files:
        for file in files:
            message_content.append({
                "type": "image_file",
                "image_file": {"file_id": file['file_id']}
            })
    
    print(f"Message content being sent: {message_content}")
    return client.beta.threads.messages.create(
        thread_id=threadID,
        role=role,
        content=message_content
    )


async def getAnswer(threadID: str, assistantID: str):
    run = client.beta.threads.runs.create(
        thread_id=threadID,
        assistant_id=assistantID,
        stream=True
    )
    for event in run:
        if hasattr(event, "data") and hasattr(event.data, "delta"):
            delta = event.data.delta
            if hasattr(delta, "content") and delta.content:
                for content_item in delta.content:
                    if hasattr(content_item, "text") and hasattr(content_item.text, "value"):
                        answer_text = content_item.text.value
                        if answer_text:
                            yield answer_text


async def messageRun(content: str, files: Union[List[dict], None] = None):
    global current_chat_id
    chat = chats[current_chat_id]
    
    if chat.assistant is None:
        chat.assistant = createAssistant()
    
    if chat.thread is None:
        chat.thread = createThread()
    
    qa = QA(question=content, answer="")
    chat.messages.append(qa)
    
    role = "user"
    assistant_files = uploadDocs(files) if files else None
    createMessage(threadID=chat.thread.id, content=content, role=role, files=assistant_files)
    
    print("Assistant >> ", end="")
    async for answer_text in getAnswer(threadID=chat.thread.id, assistantID=chat.assistant.id):
        chat.messages[-1].answer += answer_text
        yield answer_text

async def messageRunDebug():
    content = input("Provide input >> ")
    async for item in messageRun(content):
        print(item, end="")

# Uncomment the line below to run the debug function
# asyncio.run(messageRunDebug())