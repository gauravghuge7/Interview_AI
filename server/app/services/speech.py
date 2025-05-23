import tempfile
from fastapi import UploadFile
import whisper

model = whisper.load_model("base")

async def process_audio(file: UploadFile):
    with tempfile.NamedTemporaryFile(delete=False, suffix=".mp3") as tmp:
        content = await file.read()
        tmp.write(content)
        tmp_path = tmp.name

    result = model.transcribe(tmp_path)
    return result.get("text", "")
