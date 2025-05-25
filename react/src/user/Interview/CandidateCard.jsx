import React from 'react';

const CandidateCard = ({
  videoRef,
  canvasRef,
  cameraLoading,
  isVerifyingFace,
  isFaceVerified,
  faceCount,
  faceMismatch,
  cameraError,
  speechRecognitionError,
}) => {
  const isInvalidFaceCount = cameraError || faceCount === 0 || faceCount > 1 || !isFaceVerified || faceMismatch;

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
        <div className="bg-gray-50 rounded-lg shadow-sm p-3 md:p-4 h-32 md:h-40 overflow-y-auto">
          {speechRecognitionError ? (
            <p className="text-xs text-red-600">{speechRecognitionError}</p>
          ) : (
            <p className="text-xs text-gray-500">No speech detected yet.</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CandidateCard;