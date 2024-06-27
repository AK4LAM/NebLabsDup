import React from 'react';

const ResultDisplay = ({ result }) => {
  return (
    result && (
      <div className="mt-6 transition-all duration-300">
        <h3 className="text-lg font-medium text-gray-800 mb-2">Result:</h3>
        <pre className="whitespace-pre-wrap bg-white p-4 rounded-lg border border-gray-200 text-sm text-gray-600 overflow-auto max-h-60">
          {result}
        </pre>
      </div>
    )
  );
};

export default ResultDisplay;