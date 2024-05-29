### Launch FastAPI

To launch the FastAPI application, follow these steps:

1. **Install Uvicorn**: If you are setting up your environment for the first time, you need to install Uvicorn, which is an ASGI server. Run the following command:
   ```bash
   pip install uvicorn
   ```

2. **Run the FastAPI application**: To start the FastAPI server, use the command below. The `--reload` flag enables auto-reloading so the server will restart after code changes.
   ```bash
   uvicorn FastAPI:app --reload
   ```

3. **Access Auto-generated Documentation**: Once the server is running, you can view the auto-generated documentation by navigating to:
   [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)
