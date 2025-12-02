import React from 'react';
import { Apple, Star, Zap } from 'lucide-react';

interface MainMenuProps {
  onStart: (difficulty: string) => void;
}

export const MainMenu: React.FC<MainMenuProps> = ({ onStart }) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[60vh] text-center p-6 space-y-8 animate-in fade-in duration-700">
      <div className="space-y-2">
        <div className="inline-flex items-center justify-center p-6 bg-orange-100 rounded-full mb-6 shadow-sm">
          <Apple className="w-12 h-12 text-orange-600" />
        </div>
        <h1 className="text-4xl font-extrabold text-slate-900 tracking-tight">
          Fruit Master
        </h1>
        <p className="text-lg text-slate-600 max-w-md mx-auto">
          Học từ vựng Tiếng Anh chủ đề Trái Cây! 10 câu hỏi thú vị đang chờ bạn khám phá.
        </p>
      </div>

      <div className="grid gap-4 w-full max-w-xs">
        <button
          onClick={() => onStart('beginner')}
          className="group relative flex items-center justify-between px-6 py-5 bg-white border-2 border-slate-200 rounded-2xl hover:border-green-400 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-green-100 p-3 rounded-xl group-hover:bg-green-200 transition-colors">
              <Star className="w-6 h-6 text-green-600" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-lg text-slate-700 group-hover:text-green-700">Cơ bản</span>
              <span className="text-xs text-slate-400 font-medium">Táo, Chuối, Cam...</span>
            </div>
          </div>
        </button>

        <button
          onClick={() => onStart('advanced')}
          className="group relative flex items-center justify-between px-6 py-5 bg-white border-2 border-slate-200 rounded-2xl hover:border-purple-400 hover:shadow-lg hover:scale-[1.02] transition-all duration-300"
        >
          <div className="flex items-center space-x-4">
            <div className="bg-purple-100 p-3 rounded-xl group-hover:bg-purple-200 transition-colors">
              <Zap className="w-6 h-6 text-purple-600" />
            </div>
            <div className="text-left">
              <span className="block font-bold text-lg text-slate-700 group-hover:text-purple-700">Nâng cao</span>
              <span className="text-xs text-slate-400 font-medium">Sầu riêng, Măng cụt...</span>
            </div>
          </div>
        </button>
      </div>
    </div>
  );
};