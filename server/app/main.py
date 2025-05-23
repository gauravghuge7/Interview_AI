from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pymongo import MongoClient
from dotenv import load_dotenv
import os
import sys

# Load environment variables
load_dotenv()

# Extend Python path for module import
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Import routers
from api.routes import interview, pdfread

# Initialize FastAPI app
app = FastAPI(title="AI Interview Preparation API")

# MongoDB setup (available globally if needed)
client = MongoClient(os.getenv("MONGODB_URI"))
db = client["interview_db"]
collection = db["candidates"]

# CORS setup (adjust for security in production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Change to specific origin in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Test route
@app.get("/get")
async def root():
    return {"message": "Welcome to the Interview Preparation API!"}

# Include routers
app.include_router(interview.router, prefix="/interview")
app.include_router(pdfread.router, prefix="/resume")

# Optional: Add more prefixes to separate concerns
