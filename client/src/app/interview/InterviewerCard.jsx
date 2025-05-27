import React from 'react';

const InterviewerCard = ({ interimTranscription, transcription }) => (
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
    </div>
  </div>
);

export default InterviewerCard;