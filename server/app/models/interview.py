from fastapi import APIRouter, UploadFile, File, WebSocket, WebSocketDisconnect, Query
from fastapi.responses import HTMLResponse
from app.services import speech

router = APIRouter()


# === Resume Upload ===
@router.post("/uploadResumeAndDetails")
async def upload_resume_and_details(
    resume: UploadFile = File(...),
    name: str = Query(...),
    email: str = Query(...),
    phone: str = Query(""),
    position: str = Query(""),
):
    # Save resume logic or cloud upload here
    content = await resume.read()
    print(f"Received resume from {name} ({email}) for {position}")
    # You would upload to Cloudinary & store in MongoDB here
    return {"message": "Resume uploaded successfully"}


# === Audio Upload Endpoint ===
@router.post("/upload-audio")
async def upload_audio(file: UploadFile = File(...)):
    result = await speech.process_audio(file)
    return {"transcript": result}


# === WebSocket Real-time Interview ===
@router.websocket("/ws/interview")
async def interview_socket(websocket: WebSocket, name: str = Query(...), email: str = Query(...)):
    await websocket.accept()
    try:
        await websocket.send_text(f"👋 Welcome {name}! Let's begin your interview.")
        while True:
            message = await websocket.receive_text()
            print(f"Message from {name} ({email}): {message}")

            # Placeholder AI response logic
            ai_response = f"🤖 AI: You said '{message}'. Can you tell me more?"
            await websocket.send_text(ai_response)

    except WebSocketDisconnect:
        print(f"{name} disconnected.")
