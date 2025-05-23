
from fastapi import APIRouter, UploadFile, File
from app.services import speech

router = APIRouter()


# Configure Cloudinary
cloudinary.config(
    cloud_name=os.getenv("CLOUDINARY_CLOUD_NAME"),
    api_key=os.getenv("CLOUDINARY_API_KEY"),
    api_secret=os.getenv("CLOUDINARY_API_SECRET")
)


@router.post("/api/submit")
async def submit_candidate(
    first_name: str = Form(...),
    last_name: str = Form(...),
    email: str = Form(...),
    job_id: str = Form(...),
    job_title: str = Form(...),
    resume: UploadFile = File(...)
):
    try:
        # Upload resume to Cloudinary
        upload_result = cloudinary.uploader.upload(resume.file, resource_type="raw")
        resume_url = upload_result.get("secure_url")
        resume_public_id = upload_result.get("public_id")

        # Reset file pointer to beginning
        resume.file.seek(0)

        # Parse PDF to extract text
        pdf_reader = PdfReader(resume.file)
        text = ""
        for page in pdf_reader.pages:
            text += page.extract_text() or ""

        if not text:
            raise HTTPException(status_code=400, detail="Failed to extract text from PDF.")

        # Split text into chunks
        splitter = RecursiveCharacterTextSplitter(chunk_size=1000, chunk_overlap=200)
        chunks = splitter.split_text(text)

        # Generate embeddings using OpenAI
        embeddings_model = OpenAIEmbeddings(openai_api_key=os.getenv("OPENAI_API_KEY"))
        embeddings = embeddings_model.embed_documents(chunks)

        # Prepare document for MongoDB
        candidate_id = str(uuid.uuid4())
        document = {
            "_id": candidate_id,
            "first_name": first_name,
            "last_name": last_name,
            "email": email,
            "job_id": job_id,
            "job_title": job_title,
            "resume_url": resume_url,
            "resume_public_id": resume_public_id,
            "resume_chunks": chunks,
            "resume_embeddings": embeddings
        }

        # Insert document into MongoDB
        collection.insert_one(document)

        return {"message": "Candidate submitted successfully", "candidate_id": candidate_id}

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

