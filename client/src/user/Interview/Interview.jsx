"use client";
import { useEffect, useRef, useState } from "react";
import io from "socket.io-client";
import * as faceapi from "face-api.js";
import { Loader2 } from "lucide-react";

const socket = io("http://localhost:3001"); // Update with your socket server URL

export default function Interview() {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const [faceCount, setFaceCount] = useState(0);
  const [verified, setVerified] = useState(false);
  const [loading, setLoading] = useState(true);

  // Load face detection models
  useEffect(() => {
    const loadModels = async () => {
      const MODEL_URL = "/models"; // Serve models from public/models
      await faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL);
      setLoading(false);
    };
    loadModels();
  }, []);

  // Start webcam
  useEffect(() => {
    const startVideo = async () => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({ video: true });
        videoRef.current.srcObject = stream;
      } catch (err) {
        console.error("Camera error:", err);
      }
    };
    startVideo();
  }, []);

  // Face detection loop
  useEffect(() => {
    if (loading) return;

    const interval = setInterval(async () => {
      if (!videoRef.current) return;

      const detections = await faceapi.detectAllFaces(
        videoRef.current,
        new faceapi.TinyFaceDetectorOptions()
      );

      setFaceCount(detections.length);
      setVerified(detections.length === 1);

      const canvas = canvasRef.current;
      const displaySize = {
        width: videoRef.current.videoWidth,
        height: videoRef.current.videoHeight,
      };

      faceapi.matchDimensions(canvas, displaySize);
      const resizedDetections = faceapi.resizeResults(detections, displaySize);
      canvas.getContext("2d").clearRect(0, 0, canvas.width, canvas.height);
      faceapi.draw.drawDetections(canvas, resizedDetections);
    }, 1000);

    return () => clearInterval(interval);
  }, [loading]);

  // Socket connection + room join
  useEffect(() => {
    const roomId = "interview-room";
    socket.emit("joinRoom", { room: roomId });

    return () => {
      socket.disconnect();
    };
  }, []);

  return (
    <div className="p-6 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-4">AI Interview Room</h1>

      <div className="grid md:grid-cols-2 gap-6">
        {/* Video Section */}
        <div className="relative">
          <video ref={videoRef} autoPlay muted playsInline className="rounded-xl shadow w-full" />
          <canvas ref={canvasRef} className="absolute top-0 left-0 z-10" />
          {loading && (
            <div className="absolute inset-0 bg-white/60 flex items-center justify-center rounded-xl">
              <Loader2 className="animate-spin w-8 h-8 text-blue-600" />
            </div>
          )}
        </div>

        {/* Interview UI */}
        <div className="bg-white rounded-xl p-6 shadow border space-y-4">
          <div className="flex items-center gap-4">
            <img src="/bot.png" alt="AI Bot" className="w-16 h-16 rounded-full" />
            <div>
              <h2 className="font-semibold text-lg">AI Interviewer</h2>
              <p className="text-sm text-gray-500">Virtual assistant</p>
            </div>
          </div>

          <div className="border p-4 rounded-md h-40 overflow-y-auto bg-gray-50 text-gray-700">
            {verified ? (
              <p>Welcome! I’ll begin the interview shortly.</p>
            ) : faceCount > 1 ? (
              <p className="text-red-500">Multiple faces detected. Please ensure only one person is visible.</p>
            ) : (
              <p className="text-yellow-500">No clear face detected. Please position yourself in front of the camera.</p>
            )}
          </div>

          <button
            disabled={!verified}
            className={`w-full py-2 px-4 rounded ${
              verified ? "bg-blue-600 text-white" : "bg-gray-300 text-gray-500"
            }`}
          >
            {verified ? "Start Interview" : "Waiting for Face Verification..."}
          </button>
        </div>
      </div>
    </div>
  );
}
