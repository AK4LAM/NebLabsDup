from openai import OpenAI
import openai
import os
import asyncio
from fastapi import UploadFile
from typing import List


openai.api_key = os.environ["OPENAI_API_KEY"]
client = OpenAI()
assetsPath = ""

assistantIDs: list[dict[str, str]] = []
threadIDs: list[str] = []

tokensUsed: int = 0
fileOverview = []

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


def getModels():
    return client.models.list()


def createAssistant(instructions: str = "", 
                    name: str = "Default Name", 
                    description: str = "",
                    tools: list[dict[str, str]] = [{"type": "code_interpreter"}], 
                    model: str = "gpt-4o-2024-05-13"):
    assistant = client.beta.assistants.create(
        instructions=instructions,
        name=name,
        description=description,
        tools=tools,
        model=model,
    )
    assistantIDs.append({assistant.name: assistant.id})
    return assistant


def createThread():
    thread = client.beta.threads.create()
    threadIDs.append(thread.id)
    return thread


def retrieveThread(id: str):
    thread = client.beta.threads.retrieve(id)
    return thread


def uploadDocs(files: List[UploadFile]):
    assistantFiles = []
    # Loop through each file provided
    for file in files:
        # Upload each file
        uploaded_file = client.files.create(
            file = file.file,
            purpose="assistants"
        )
        # Collect each file ID with the specified tool usage
        assistantFiles.append(
            {"file_id": uploaded_file.id, "tools": [{"type": "file_search"}] }
        )
        fileOverview.append([file.filename, uploaded_file.id])
    return assistantFiles


def createMessage(threadID: str, content: str, role: str = "user", attachments = None):
    thread_message = client.beta.threads.messages.create(
        thread_id=threadID,
        role=role,
        content=content,
        attachments=attachments,
            # [{"file_id": uploaded_file.id, "tools": [{"type": "file_search"}]}]
        )
    

async def getAnswer(threadID: str, assistantID: str):
    global tokensUsed

    run = client.beta.threads.runs.create(
            thread_id=threadID,
            assistant_id=assistantID,
            stream=True #remove line to process without streaming
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
        if hasattr(event.data, "usage"):
            if event.data.usage:
                tokensUsed += event.data.usage.total_tokens


async def messageRun(content: str):
    qa = QA(question=content, answer="", sysPrompt="")
    chats[currentChat].append(qa)

    assistant = createAssistant()
    thread = createThread()
    createMessage(threadID=thread.id, content=content)
    print("Assistant >> ", end="")
    async for answer_text in getAnswer(threadID=thread.id, assistantID=assistant.id):
        yield answer_text


async def messageRunDebug():
    content=input("Provide input >> ")
    async for item in messageRun(content):
        print (item, end="")

# asyncio.run(messageRunDebug())