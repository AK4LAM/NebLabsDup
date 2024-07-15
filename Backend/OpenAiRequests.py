# OpenAiRequests.py
from openai import OpenAI
import os
import asyncio
from fastapi import UploadFile, HTTPException, Form
from typing import List
import base64
import requests

# Try to get the API key from the environment variable
api_key = os.environ.get("OPENAI_API_KEY")

if not api_key:
    raise ValueError("No OpenAI API key found. Please set the OPENAI_API_KEY environment variable.")

# Create the client with the API key
client = OpenAI(api_key=api_key)

class QA():
    """A question and answer pair."""
    def __init__(self, question: str, answer: str, sysPrompt: str = ""):
        self.question = question
        self.answer = answer
        self.sysPrompt = sysPrompt

chats: dict[str, list[QA]] = {
    "Chat1": [],
    }

currentChat = "Chat1"

### TODO: add instructions to tailor assistant to specific site?
def createAssistant(instructions: str = "", 
                    name: str = "Default Name", 
                    description: str = "",
                    tools: list[dict[str, str]] = [{"type": "code_interpreter"}], 
                    model: str = "gpt-4o"):
    assistant = client.beta.assistants.create(
        instructions=instructions,
        name=name,
        description=description,
        tools=tools,
        model=model,
    )
    return assistant

async def uploadMessageWithImages(message: str, files: List[UploadFile]):
    try:
        messages = [{"role": "user", "content": message}]
        
        for file in files:
            image_content = await file.read()
            base64_image = base64.b64encode(image_content).decode('utf-8')
            messages.append({
                "role": "user",
                "content": f"data:image/jpeg;base64,{base64_image}"
            })
        
        # Include previous messages in the current chat
        previous_messages = []
        for qa in chats[currentChat]:
            previous_messages.append({"role": "user", "content": qa.question})
            previous_messages.append({"role": "assistant", "content": qa.answer})
        
        messages = previous_messages + messages

        headers = {
            "Content-Type": "application/json",
            "Authorization": f"Bearer {api_key}"
        }

        payload = {
            "model": "gpt-4o",
            "messages": messages,
            "max_tokens": 1000
        }

        response = requests.post("https://api.openai.com/v1/chat/completions", headers=headers, json=payload)
        if response.status_code == 200:
            result = extractMessage(response.json())
            # Add the current question and answer to the chat history
            chats[currentChat].append(QA(question=message, answer=result))
            return result
        else:
            raise HTTPException(status_code=response.status_code, detail=response.text)
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

def extractMessage(chat_completion):
    try:
        message = chat_completion["choices"][0]["message"]["content"]
        return message
    except (KeyError, IndexError) as e:
        return "extraction failed"

async def messageRun(content: str):
    qa = QA(question=content, answer="", sysPrompt="")
    chats[currentChat].append(qa)

    assistant = createAssistant()
    thread = client.beta.threads.create()
    client.beta.threads.messages.create(
        thread_id=thread.id,
        role="user",
        content=content
    )
    print("Assistant >> ", end="")
    run = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant.id,
            stream=True  # remove line to process without streaming
        )

    for event in run:
        # Check if 'delta' is present and it has 'content'
        if hasattr(event.data, "delta"):
            if hasattr(event.data.delta, "content"):
                if hasattr(event.data.delta.content[0].text, "value"):
                    answer_text = event.data.delta.content[0].text.value  # Extract the text value
                    # Ensure answer_text is not None before concatenation
                    if answer_text:
                        yield answer_text
                        chats[currentChat][-1].answer += answer_text
                    else:
                        chats[currentChat][-1].answer += ""

async def messageRunDebug():
    content = input("Provide input >> ")
    async for item in messageRun(content):
        print(item, end="")