import React, { useEffect, useRef, useState, useReducer, useCallback } from 'react';
    import { createRoot } from 'react-dom/client';
    import { BrowserRouter, Routes, Route, useParams } from 'react-router-dom';
    import * as faceapi from 'face-api.js';
    import axios from 'axios';

    // Reducer for face verification state
    const initialState = {
      cameraError: '',
      faceCount: 0,
      modelsLoaded: false,
      cameraLoading: true,
      isFaceVerified: false,
      isVerifyingFace: false,
      faceMismatch: false,
      noFaceRetries: 0,
    };

    const faceReducer = (state, action) => {
      switch (action.type) {
        case 'SET_CAMERA_ERROR': return { ...state, cameraError: action.payload, cameraLoading: false };
        case 'SET_FACE_COUNT': return { ...state, faceCount: action.payload };
        case 'SET_MODELS_LOADED': return { ...state, modelsLoaded: true };
        case 'SET_CAMERA_LOADING': return { ...state, cameraLoading: action.payload };
        case 'SET_FACE_VERIFIED': return { ...state, isFaceVerified: action.payload, isVerifyingFace: false };
        case 'SET_VERIFYING_FACE': return { ...state, isVerifyingFace: action.payload };
        case 'SET_FACE_MISMATCH': return { ...state, faceMismatch: action.payload };
        case 'SET_NO_FACE_RETRIES': return { ...state, noFaceRetries: action.payload };
        default: return state;
      }
    };

    // Toaster Component
    const Toaster = ({ show, message, type }) => {
      if (!show) return null;
      return (
        <div
          className={`fixed top-4 right-4 px-4 py-2 rounded-md shadow-md text-white z-50 ${
            type === 'success' ? 'bg-emerald-600' : type === 'error' ? 'bg-red-600' : 'bg-yellow-600'
          }`}
        >
          {message}
        </div>
      );
    };

    // Header Component
    const Header = () => (
      <header className="mb-4 md:mb-6 text-center w-full">
        <h1 className="text-2xl md:text-3xl font-bold text-blue-800">AI Interview Interface</h1>
        <p className="text-sm md:text-base text-gray-600">Interact with Hitesh Sir below</p>
      </header>
    );

    // Transcript Display Component
    const TranscriptDisplay = ({ transcription, interimTranscription }) => (
      <div className="bg-gray-50 rounded-lg shadow-sm p-3 md:p-4 h-32 md:h-40 overflow-y-auto">
        {interimTranscription || transcription ? (
          <div>
            <p className="text-xs text-gray-600">
              {transcription ? transcription.timestamp : new Date().toLocaleTimeString()}
            </p>
            <p className="text-xs text-gray-800">
              {interimTranscription || (transcription ? transcription.text : '')}
            </p>
          </div>
        ) : (
          <p className="text-xs text-gray-500">No speech detected yet.</p>
        )}
      </div>
    );

    // Interviewer Card Component
    const InterviewerCard = ({ transcription, interimTranscription }) => (
      <div className="bg-white p-3 md:p-4 rounded-xl shadow flex flex-col h-[30rem] md:h-[40rem]">
        <div className="relative w-full rounded-lg h-[20rem] md:h-[28rem] overflow-hidden bg-gradient-to-br from-white to-blue-100 shadow-lg border border-gray-200">
          <div className="flex flex-col items-center justify-center h-full p-4">
            <img
              src="/hitesh_choudhary.webp"
              alt="Hitesh Choudhary Bot"
              className="w-24 h-24 md:w-32 md:h-32 rounded-full border-4 border-blue-500 shadow-lg object-cover"
            />
            <h3 className="font-semibold text-xl md:text-2xl text-gray-800 mt-4 md:mt-6">Hitesh Choudhary</h3>
            <p className="text-blue-600 mt-1 md:mt-2 text-sm md:text-base">AI Assistant</p>
          </div>
        </div>
        <div className="flex-1 mt-3 md:mt-4">
          <h3 className="text-xs md:text-sm font-semibold text-gray-800 mb-1 md:mb-2">Interviewer Transcript</h3>
          <TranscriptDisplay transcription={transcription} interimTranscription={interimTranscription} />
        </div>
      </div>
    );

    // Candidate Card Component
    const CandidateCard = ({
      videoRef,
      canvasRef,
      cameraLoading,
      isVerifyingFace,
      isFaceVerified,
      faceCount,
      faceMismatch,
      transcription,
      interimTranscription,
    }) => {
      const isInvalidFaceCount = faceCount === 0 || faceCount > 1 || !isFaceVerified || faceMismatch;
      return (
        <div className="bg-white p-3 md:p-4 rounded-xl shadow flex flex-col h-[30rem] md:h-[40rem]">
          <div className="relative w-full h-[20rem] md:h-[28rem] rounded-lg overflow-hidden border-2 bg-gradient-to-br from-gray-800 to-gray-900 shadow aspect-video">
            <video ref={videoRef} autoPlay playsInline muted className="w-full h-full object-cover" />
            <canvas ref={canvasRef} className="absolute top-0 left-0 w-full h-full pointer-events-none" />
            <div
              className={`absolute bottom-2 left-2 text-xs ${
                isInvalidFaceCount ? 'text-red-300' : 'text-blue-300'
              } animate-blink`}
            >
              {cameraLoading
                ? 'Loading Camera...'
                : isVerifyingFace
                ? 'Verifying Face...'
                : !isFaceVerified
                ? 'Face Verification Failed'
                : faceCount === 0
                ? 'No Face Detected'
                : faceCount > 1
                ? 'Multiple Faces Detected'
                : faceMismatch
                ? 'Face Not Match'
                : 'Verified'}
            </div>
          </div>
          <div className="flex-1 mt-3 md:mt-4">
            <h3 className="text-xs md:text-sm font-semibold text-gray-800 mb-1 md:mb-2">Your Transcript</h3>
            <TranscriptDisplay transcription={transcription} interimTranscription={interimTranscription} />
          </div>
        </div>
      );
    };

    // Utility: Load Face Models
    const loadFaceModels = async (setToaster, dispatch) => {
      try {
        const modelPath = '/models';
        await Promise.all([
          faceapi.nets.ssdMobilenetv1.loadFromUri(modelPath),
          faceapi.nets.faceLandmark68Net.loadFromUri(modelPath),
          faceapi.nets.faceRecognitionNet.loadFromUri(modelPath),
        ]);
        dispatch({ type: 'SET_MODELS_LOADED' });
        setToaster({ show: true, message: 'Face recognition models loaded.', type: 'success' });
      } catch (error) {
        console.error('Error loading face-api.js models:', error);
        dispatch({ type: 'SET_CAMERA_ERROR', payload: 'Failed to load face recognition models.' });
        setToaster({ show: true, message: 'Failed to load face recognition models.', type: 'error' });
      }
    };

    // Utility: Initialize Camera and Microphone
    const initializeCameraAndMic = async (videoRef, streamRef, recognitionRef, setToaster, dispatch, setTranscription, setInterimTranscription, setSpeechRecognitionError) => {
      try {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: { width: { ideal: 640 }, height: { ideal: 480 } },
          audio: true,
        });
        streamRef.current = stream;
        if (videoRef.current) videoRef.current.srcObject = stream;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
          recognitionRef.current = new SpeechRecognition();
          recognitionRef.current.lang = 'en-US';
          recognitionRef.current.continuous = true;
          recognitionRef.current.interimResults = true;

          let debounceTimeout;
          recognitionRef.current.onresult = (event) => {
            clearTimeout(debounceTimeout);
            debounceTimeout = setTimeout(() => {
              const lastResult = event.results[event.results.length - 1];
              const sentence = lastResult[0].transcript.trim();
              if (!sentence || sentence.toLowerCase().includes('no face') || sentence.toLowerCase().includes('multiple faces')) return;

              if (lastResult.isFinal) {
                setTranscription(prev => {
                  if (!prev || !prev.text.toLowerCase().includes(sentence.toLowerCase())) {
                    return { text: sentence, timestamp: new Date().toLocaleTimeString() };
                  }
                  return prev;
                });
                setInterimTranscription('');
              } else {
                setInterimTranscription(sentence);
              }
            }, 500);
          };

          recognitionRef.current.onerror = (event) => {
            console.error('Speech recognition error:', event.error);
            setSpeechRecognitionError('Speech recognition failed: ' + event.error);
          };

          recognitionRef.current.onend = () => {
            if (recognitionRef.current && !speechRecognitionError) recognitionRef.current.start();
          };

          recognitionRef.current.start();
        } else {
          setSpeechRecognitionError('Speech recognition not supported in this browser.');
        }

        dispatch({ type: 'SET_CAMERA_LOADING', payload: false });
      } catch (error) {
        console.error('Error accessing camera or microphone:', error);
        dispatch({ type: 'SET_CAMERA_ERROR', payload: 'Failed to access camera or microphone.' });
        setToaster({ show: true, message: 'Failed to access camera or microphone.', type: 'error' });
      }
    };

    // Utility: Face Verification
    const verifyFace = async (videoRef, studentPhotoUrl, setToaster, dispatch, speakMessage) => {
      dispatch({ type: 'SET_VERIFYING_FACE', payload: true });
      try {
        const video = videoRef.current;
        const distances = [];
        const maxAttempts = 5;

        for (let attempt = 0; attempt < maxAttempts; attempt++) {
          const detections = await faceapi
            .detectAllFaces(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }))
            .withFaceLandmarks()
            .withFaceDescriptors();

          if (detections.length !== 1) {
            dispatch({ type: 'SET_NO_FACE_RETRIES', payload: prev => prev + 1 });
            if (detections.length === 0) {
              setToaster({ show: true, message: 'No face detected.', type: 'warning' });
              speakMessage('No face detected. Please ensure your face is centered and well-lit.');
            } else {
              setToaster({ show: true, message: 'Multiple faces detected.', type: 'error' });
              speakMessage('Multiple faces detected. Only one face is allowed.');
            }
            await new Promise(resolve => setTimeout(resolve, 1000));
            continue;
          }

          dispatch({ type: 'SET_NO_FACE_RETRIES', payload: 0 });
          const canvas = document.createElement('canvas');
          canvas.width = video.videoWidth;
          canvas.height = video.videoHeight;
          const context = canvas.getContext('2d');
          context.drawImage(video, 0, 0, canvas.width, canvas.height);
          const capturedPhotoUrl = canvas.toDataURL('image/jpeg', 0.9);

          const capturedImg = new Image();
          capturedImg.src = capturedPhotoUrl;
          await new Promise(resolve => (capturedImg.onload = resolve));

          const capturedDetection = await faceapi
            .detectSingleFace(capturedImg)
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (!capturedDetection) continue;

          const profileImg = new Image();
          profileImg.crossOrigin = 'anonymous';
          profileImg.src = studentPhotoUrl;
          await new Promise(resolve => (profileImg.onload = resolve));

          const profileDetection = await faceapi
            .detectSingleFace(profileImg)
            .withFaceLandmarks()
            .withFaceDescriptor();

          if (!profileDetection) continue;

          const distance = faceapi.euclideanDistance(
            profileDetection.descriptor,
            capturedDetection.descriptor
          );
          distances.push(distance);
          await new Promise(resolve => setTimeout(resolve, 1000));
        }

        if (distances.length === 0) throw new Error('No valid face detections.');
        const averageDistance = distances.reduce((sum, d) => sum + d, 0) / distances.length;
        const isMatch = averageDistance < 0.4;

        if (isMatch) {
          dispatch({ type: 'SET_FACE_VERIFIED', payload: true });
          dispatch({ type: 'SET_FACE_MISMATCH', payload: false });
          setToaster({ show: true, message: 'Face verified successfully!', type: 'success' });
        } else {
          dispatch({ type: 'SET_FACE_VERIFIED', payload: false });
          dispatch({ type: 'SET_FACE_MISMATCH', payload: true });
          setToaster({ show: true, message: 'Face verification failed.', type: 'error' });
          speakMessage('Face verification failed. Please check lighting and alignment.');
        }
      } catch (error) {
        console.error('Face verification error:', error);
        setToaster({ show: true, message: 'Failed to verify face.', type: 'error' });
        dispatch({ type: 'SET_FACE_VERIFIED', payload: false });
      } finally {
        dispatch({ type: 'SET_VERIFYING_FACE', payload: false });
      }
    };

    // Utility: Speak Message
    const speakMessage = (message, streamRef, lastSpoken, setLastSpoken) => {
      const allowedWarnings = [
        'No face detected. Please ensure your face is centered and well-lit.',
        'Multiple faces detected. Only one face is allowed.',
        'Face verification failed. Please check lighting and alignment.',
      ];
      if (!allowedWarnings.includes(message)) return;

      const now = Date.now();
      if (lastSpoken.message === message && now - lastSpoken.timestamp < 5000) return;

      if (streamRef.current) streamRef.current.getAudioTracks().forEach(track => (track.enabled = false));
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(message);
      utterance.lang = 'en-US';
      utterance.onend = () => {
        if (streamRef.current) streamRef.current.getAudioTracks().forEach(track => (track.enabled = true));
      };
      window.speechSynthesis.speak(utterance);
      setLastSpoken({ message, timestamp: now });
    };

    // Main Interview Component
    const Interview = () => {
      const videoRef = useRef(null);
      const canvasRef = useRef(null);
      const streamRef = useRef(null);
      const recognitionRef = useRef(null);
      const [state, dispatch] = useReducer(faceReducer, initialState);
      const [studentPhotoUrl] = useState('/student_photo.jpg'); // Placeholder
      const [transcription, setTranscription] = useState(null);
      const [interimTranscription, setInterimTranscription] = useState('');
      const [speechRecognitionError, setSpeechRecognitionError] = useState('');
      const [toaster, setToaster] = useState({ show: false, message: '', type: 'info' });
      const [lastSpoken, setLastSpoken] = useState({ message: '', timestamp: 0 });

      const showToaster = useCallback((message, type = 'info') => {
        setToaster({ show: true, message, type });
        setTimeout(() => setToaster({ show: false, message: '', type: 'info' }), 3000);
      }, []);

      useEffect(() => {
        loadFaceModels(showToaster, dispatch);
      }, [showToaster]);

      useEffect(() => {
        initializeCameraAndMic(
          videoRef,
          streamRef,
          recognitionRef,
          showToaster,
          dispatch,
          setTranscription,
          setInterimTranscription,
          setSpeechRecognitionError
        );

        const detectFaces = async () => {
          if (!videoRef.current || !canvasRef.current || !state.modelsLoaded || state.cameraError) return;

          const video = videoRef.current;
          const canvas = canvasRef.current;
          const displaySize = { width: video.offsetWidth, height: video.offsetHeight };
          faceapi.matchDimensions(canvas, displaySize);

          const detections = await faceapi
            .detectAllFaces(video, new faceapi.SsdMobilenetv1Options({ minConfidence: 0.3 }))
            .withFaceLandmarks();
          dispatch({ type: 'SET_FACE_COUNT', payload: detections.length });

          if (detections.length === 1 && !state.isFaceVerified && !state.isVerifyingFace && state.modelsLoaded && studentPhotoUrl) {
            verifyFace(videoRef, studentPhotoUrl, showToaster, dispatch, message =>
              speakMessage(message, streamRef, lastSpoken, setLastSpoken)
            );
          } else if (detections.length === 0) {
            showToaster('No face detected.', 'warning');
            speakMessage('No face detected. Please ensure your face is centered and well-lit.', streamRef, lastSpoken, setLastSpoken);
          } else if (detections.length > 1) {
            showToaster('Multiple faces detected.', 'error');
            speakMessage('Multiple faces detected. Only one face is allowed.', streamRef, lastSpoken, setLastSpoken);
          }

          const resizedDetections = faceapi.resizeResults(detections, displaySize);
          const ctx = canvas.getContext('2d');
          ctx.clearRect(0, 0, canvas.width, canvas.height);
          resizedDetections.forEach(detection => {
            const box = detection.detection.box;
            ctx.beginPath();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#3b82f6';
            ctx.rect(box.x, box.y, box.width, box.height);
            ctx.stroke();
            ctx.font = '12px Arial';
            ctx.fillStyle = '#3b82f6';
            ctx.fillText(detection.detection.score.toFixed(2), box.x, box.y - 5);
          });
        };

        const detectionInterval = setInterval(detectFaces, 2000);
        const periodicVerificationInterval = setInterval(() => {
          if (state.isFaceVerified && !state.isVerifyingFace) {
            verifyFace(videoRef, studentPhotoUrl, showToaster, dispatch, message =>
              speakMessage(message, streamRef, lastSpoken, setLastSpoken)
            );
          }
        }, 60000);

        return () => {
          clearInterval(detectionInterval);
          clearInterval(periodicVerificationInterval);
          if (streamRef.current) streamRef.current.getTracks().forEach(track => track.stop());
          if (recognitionRef.current) recognitionRef.current.stop();
        };
      }, [state.modelsLoaded, studentPhotoUrl, state.isFaceVerified, state.isVerifyingFace, state.cameraError, showToaster]);

      return (
        <div className={`min-h-screen w-full bg-gray-100 p-4 md:p-6 ${state.faceMismatch ? 'border-4 border-red-500' : ''}`}>
          <Toaster show={toaster.show} message={toaster.message} type={toaster.type} />
          <Header />
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6">
            <InterviewerCard transcription={transcription} interimTranscription={interimTranscription} />
            <CandidateCard
              videoRef={videoRef}
              canvasRef={canvasRef}
              cameraLoading={state.cameraLoading}
              isVerifyingFace={state.isVerifyingFace}  
              isFaceVerified={state.isFaceVerified}
              faceCount={state.faceCount}
              faceMismatch={state.faceMismatch}
              transcription={transcription}
              interimTranscription={interimTranscription}
            />
          </div>
        </div>
      );
    };