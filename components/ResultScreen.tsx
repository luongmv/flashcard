import React from 'react';
import { GameSession } from '../types';
import { Trophy, RefreshCcw, Home } from 'lucide-react';

interface ResultScreenProps {
  session: GameSession;
  onRestart: () => void;
  onHome: () => void;
}

export const ResultScreen: React.FC<ResultScreenProps> = ({ session, onRestart, onHome }) => {
  const correctAnswers = session.history.filter(h => h.correct).length;
  // Percentage based on correct answers count, not score
  const percentage = Math.round((correctAnswers / session.totalRounds) * 100);
  
  let message = "Cố gắng lên!";
  let subMessage = "Luyện tập thêm để nhớ từ vựng nhé!";
  let color = "text-slate-500";
  let bgGlow = "bg-slate-100";
  
  if (percentage === 100) {
    message = "Xuất Sắc!";
    subMessage = "Bạn là bậc thầy trái cây thực thụ!";
    color = "text-yellow-500";
    bgGlow = "bg-yellow-100";
  } else if (percentage >= 80) {
    message = "Tuyệt Vời!";
    subMessage = "Kiến thức của bạn rất vững chắc!";
    color = "text-indigo-500";
    bgGlow = "bg-indigo-100";
  } else if (percentage >= 50) {
    message = "Làm Tốt Lắm!";
    subMessage = "Bạn đã hoàn thành tốt bài học.";
    color = "text-blue-500";
    bgGlow = "bg-blue-100";
  }

  return (
    <div className="flex flex-col items-center justify-center h-full p-6 text-center animate-in zoom-in-95 duration-500">
      <div className="relative mb-8">
         <div className={`absolute inset-0 ${bgGlow} rounded-full blur-2xl opacity-70 animate-pulse`}></div>
         <Trophy className={`w-28 h-28 ${color} relative z-10 drop-shadow-sm`} />
      </div>

      <h2 className={`text-4xl font-black ${color} mb-2 tracking-tight`}>{message}</h2>
      <p className="text-lg text-slate-600 font-medium mb-6">{subMessage}</p>
      
      {/* Stats Card */}
      <div className="w-full max-w-xs bg-white rounded-3xl p-6 shadow-xl shadow-slate-200/50 border border-slate-100 mb-8">
        <h3 className="text-slate-400 text-xs font-bold uppercase mb-4 tracking-wider text-left border-b border-slate-100 pb-2">Kết quả chi tiết</h3>
        <div className="space-y-4">
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
             <span className="text-slate-500 font-medium">Số câu đúng</span>
             <span className="font-bold text-green-600 text-xl">
               {correctAnswers} / {session.totalRounds}
             </span>
          </div>
          <div className="flex justify-between items-center border-b border-slate-50 pb-3">
             <span className="text-slate-500 font-medium">Tổng điểm</span>
             <span className="font-bold text-orange-600 text-xl">
               {session.score}
             </span>
          </div>
          <div className="flex justify-between items-center">
             <span className="text-slate-500 font-medium">Độ chính xác</span>
             <span className={`font-black text-xl ${percentage >= 80 ? 'text-indigo-600' : 'text-slate-700'}`}>
               {percentage}%
             </span>
          </div>
        </div>
      </div>

      <div className="flex gap-4 w-full max-w-xs">
        <button
          onClick={onHome}
          className="flex-1 flex flex-col items-center justify-center p-4 rounded-2xl border-2 border-slate-200 hover:border-slate-300 hover:bg-slate-50 transition-all text-slate-600 font-bold active:scale-95"
        >
          <Home className="w-6 h-6 mb-1" />
          <span className="text-sm">Trang chủ</span>
        </button>
        <button
          onClick={onRestart}
          className="flex-1 flex flex-col items-center justify-center p-4 rounded-2xl bg-indigo-600 text-white shadow-lg shadow-indigo-200 hover:bg-indigo-700 transition-all font-bold active:scale-95"
        >
          <RefreshCcw className="w-6 h-6 mb-1" />
          <span className="text-sm">Chơi lại</span>
        </button>
      </div>
    </div>
  );
};