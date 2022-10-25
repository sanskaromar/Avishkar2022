import React from 'react';

const DividerLine = ({ text, alignmentCenter }: any) => {
  return (
    <div className="relative w-full" style={{ textAlign: alignmentCenter ? 'center' : 'left' }}>
      <h2 className="inline-block w-auto p-1 px-10 mb-0 text-xl font-bold text-gray-900 capitalize rounded-t-xl bg-slate-200">
        {text}
      </h2>
      <div className="w-full h-1 mt-0 bg-slate-200"></div>
    </div>
  );
};

export default DividerLine;
