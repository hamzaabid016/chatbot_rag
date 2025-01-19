# FastAPI Application with OpenAI API Integration

## Setup Instructions

1. **Copy Environment File**
   ```bash
   cp .env.sample .env
   ```

2. **Add Your OpenAI API Key**
   Open the `.env` file and replace `YOUR_API_KEY` with your OpenAI API key:
   ```plaintext
   OPENAI_API_KEY=YOUR_API_KEY
   ```

3. **Run the Application**
   Use Docker Compose to build and start the application:
   ```bash
   docker-compose up --build
   ```

4. **Access the Application**
   Once the container starts, the FastAPI app will be running. By default, you can access it at:
   - **Local**: `http://localhost:8000`

   API documentation is available at:
   - `http://localhost:8000/docs` (Swagger UI)
   - `http://localhost:8000/redoc` (ReDoc)

## Notes
- Ensure you have Docker and Docker Compose installed on your machine.
- If you encounter any issues, ensure your API key is valid and the `.env` file is properly configured.
