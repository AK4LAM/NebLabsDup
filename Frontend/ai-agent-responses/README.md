# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

## Available Plugins

Currently, two official plugins are available:

## Setup Instructions

### 1. Launch Virtual Environment

To activate the virtual environment, run the following command:

$ source venv/bin/activate

### 2. Set OpenAI API Key

1. Run the following command in your terminal, replacing `yourkey` with your API key:

$ echo "export OPENAI_API_KEY='yourkey'" >> ~/.zshrc

2. Update the shell with the new variable:

$ source ~/.zshrc

3. Confirm that you have set your environment variable using the following command:

$ echo $OPENAI_API_KEY

### 3. Install Dependencies

Navigate to the `Frontend/ai-agent-responses` directory and install the necessary dependencies:

$ npm install

### 4. Run the Development Server

To start the development server, use the following command:

$ npm run dev

### 5. Build for Production

To create a production build, run:

$ npm run build

### 6. Lint the Code

To lint the codebase, use:

$ npm run lint

### 7. Preview the Production Build

To preview the production build, run:

$ npm run preview

### 8. FastAPI Interaction

The `FastAPIInteraction` component handles interactions with the FastAPI backend. It includes state management for text input, file uploads, and result display. The form submission is handled asynchronously, sending text input and files to the backend and streaming the response.

### 9. OpenAI Integration

The project integrates with OpenAI using the `openai` package. Ensure your API key is set correctly in your environment variables.

### 10. FastAPI Backend

The FastAPI backend handles message requests and file uploads. To launch the FastAPI application, follow these steps:

1. **Install Uvicorn**: If you are setting up your environment for the first time, you need to install Uvicorn, which is an ASGI server. Run the following command:

$ pip install uvicorn

2. **Run the FastAPI application**: To start the FastAPI server, use the command below. The `--reload` flag enables auto-reloading so the server will restart after code changes.

$ uvicorn FastAPI:app --reload

3. **Access Auto-generated Documentation**: Once the server is running, you can view the auto-generated documentation by navigating to:
   [http://127.0.0.1:8000/docs](http://127.0.0.1:8000/docs)

For more details, refer to the `FastAPI.py` file

### 11. Git Ignore

Ensure sensitive files and directories are ignored by Git. Refer to the `.gitignore` file for the current configuration

### 12. ESLint Configuration

The project uses ESLint for code linting. The configuration is defined in the `.eslintrc.cjs` file

### 13. Tailwind CSS

The project uses Tailwind CSS for styling. Ensure you have the necessary configuration in place. Refer to the `tailwind.config.ts` file

### 14. TypeScript Configuration

The project uses TypeScript. Ensure the `tsconfig.json` file is correctly configured

### 15. Next.js Configuration

For projects using Next.js, ensure the `next.config.mjs` file is correctly configured

### 16. PostCSS Configuration

Ensure the PostCSS configuration is correctly set up in the `postcss.config.mjs` file

### 17. Workspace Configuration

For VSCode workspace settings, refer to the `NebulaCore.code-workspace` file

### 18. Additional Information

For more details on the project setup and configuration, refer to the respective files and documentation.
