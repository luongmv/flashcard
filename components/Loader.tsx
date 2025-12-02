import React from 'react';
import { Palette } from 'lucide-react';

export const Loader: React.FC<{ message?: string }> = ({ message = "AI đang vẽ..." }) => {
  return (
    <div className="flex flex-col items-center justify-center h-full p-8 animate-in fade-in duration-500">
      <div className="relative mb-6">
        <div className="absolute inset-0 bg-indigo-200 rounded-full animate-ping opacity-75"></div>
        <div className="relative bg-white p-5 rounded-full shadow-lg border-2 border-indigo-100">
            <Palette className="w-12 h-12 text-indigo-600 animate-bounce" />
        </div>
      </div>
      <h2 className="text-xl font-bold text-slate-700 animate-pulse">{message}</h2>
      <p className="text-slate-500 text-sm mt-2 font-medium">Đang khởi tạo nội dung học tập...</p>
    </div>
  );
};