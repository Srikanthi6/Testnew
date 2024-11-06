import React from 'react';

const CaptionHistory = ({ captionHistory, onClose }) => {
  const handleDownload = () => {
    const fileContent = captionHistory.join('\n');
    const blob = new Blob([fileContent], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.download = 'caption_history.txt';
    link.href = url;
    link.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed top-0 left-0 w-screen h-screen bg-black/70 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <h2 className="text-lg font-bold mb-4">Caption History</h2>
        <ul className="max-h-96 overflow-y-auto">
          {captionHistory.map((caption, index) => (
            <li key={index} className="py-2 px-4 bg-gray-100 mb-2 rounded">
              {caption}
            </li>
          ))}
        </ul>
        <div className="flex justify-end mt-4">
          <button
            onClick={handleDownload}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition-colors"
          >
            Download
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 transition-colors ml-2"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};

export default CaptionHistory;