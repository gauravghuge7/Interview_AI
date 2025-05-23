from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from dotenv import load_dotenv
from .api.routes import interview, pdfread
import os

# Load environment variables
load_dotenv()



# Initialize MongoDB client
client = MongoClient(os.getenv("MONGODB_URI"))
db = client["interview_db"]
collection = db["candidates"]

# Initialize FastAPI app
app = FastAPI()

# Configure CORS (adjust origins as needed)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Replace with specific origins in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

    

app.get("/get")
async def root():
    return {"message": "Welcome to the Interview Preparation API!"}

app.include_router(interview.router)
app.include_router(pdfread.router)

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 
