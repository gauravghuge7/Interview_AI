from fastapi import APIRouter, UploadFile, File
from ...services import speech

router = APIRouter()

router.post("/uploadResumeAndDetails")
async def upload_resume_and_details(
    resume: UploadFile = File(...),
    name: str = "",
    email: str = "",
    phone: str = "",
    position: str = "",
):
    """
        Upload a resume and candidate details.
    """
    

@router.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    result = await speech.process_audio(file)git add .
    
    return {"transcript": result}

