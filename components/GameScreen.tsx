import React, { useState, useEffect } from 'react';
import { QuizItem } from '../types';
import { CheckCircle, XCircle, Volume2, ArrowRight } from 'lucide-react';

interface GameScreenProps {
  quizItem: QuizItem;
  onNext: (wasCorrect: boolean) => void;
  roundNumber: number;
  score: number;
}

export const GameScreen: React.FC<GameScreenProps> = ({ quizItem, onNext, roundNumber, score }) => {
  const [selectedOption, setSelectedOption] = useState<number | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // Reset state when quizItem changes
  useEffect(() => {
    setSelectedOption(null);
    setIsRevealed(false);
  }, [quizItem]);

  // Generate sound effects using Web Audio API
  const playSoundEffect = (type: 'correct' | 'incorrect') => {
    const AudioContext = window.AudioContext || (window as any).webkitAudioContext;
    if (!AudioContext) return;
    
    const ctx = new AudioContext();
    const osc = ctx.createOscillator();
    const gain = ctx.createGain();

    osc.connect(gain);
    gain.connect(ctx.destination);

    if (type === 'correct') {
      // Ding sound (Sine wave, High pitch)
      osc.type = 'sine';
      osc.frequency.setValueAtTime(600, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(1200, ctx.currentTime + 0.1);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } else {
      // Buzz sound (Sawtooth/Square wave, Low pitch)
      osc.type = 'sawtooth';
      osc.frequency.setValueAtTime(150, ctx.currentTime);
      osc.frequency.linearRampToValueAtTime(100, ctx.currentTime + 0.3);
      gain.gain.setValueAtTime(0.3, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    }
  };

  const handleOptionClick = (index: number) => {
    if (isRevealed) return;
    setSelectedOption(index);
    setIsRevealed(true);

    const correct = index === quizItem.correctOptionIndex;
    
    // Play Sound Effect
    playSoundEffect(correct ? 'correct' : 'incorrect');
  };

  const handleSpeak = () => {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(quizItem.word);
    utterance.lang = 'en-US';
    window.speechSynthesis.speak(utterance);
  };

  const isCorrect = selectedOption === quizItem.correctOptionIndex;

  return (
    <div className="w-full max-w-lg mx-auto flex flex-col h-full animate-in slide-in-from-right-8 duration-500">
      {/* Header */}
      <div className="flex items-center justify-between mb-4 px-2">
        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">Câu hỏi {roundNumber}</span>
        <div className="flex items-center space-x-2 bg-indigo-50 px-3 py-1 rounded-full border border-indigo-100">
          <span className="text-indigo-600 font-bold">{score}</span>
          <span className="text-indigo-400 text-xs font-semibold uppercase">Điểm</span>
        </div>
      </div>

      {/* Image Area */}
      <div className="flex-grow flex flex-col items-center justify-center mb-6">
        <div className="relative w-full aspect-square max-h-[350px] bg-white rounded-3xl shadow-xl overflow-hidden border-4 border-white ring-1 ring-slate-100 group">
           {quizItem.imageBase64 ? (
             <img 
              src={`data:image/png;base64,${quizItem.imageBase64}`} 
              alt="Quiz clue" 
              className="w-full h-full object-contain p-6 transition-transform duration-500 group-hover:scale-105"
             />
           ) : (
             <div className="w-full h-full bg-slate-50 flex items-center justify-center text-slate-400 font-medium">
               Đang tải hình ảnh...
             </div>
           )}
           
           {isRevealed && (
             <div className="absolute inset-0 bg-slate-900/70 flex flex-col items-center justify-center text-white p-6 text-center backdrop-blur-sm animate-in fade-in duration-300">
                <p className="text-xs font-bold uppercase tracking-widest opacity-70 mb-2">Đáp án chính xác</p>
                <h3 className="text-4xl font-black mb-3 capitalize text-yellow-400 drop-shadow-md">{quizItem.word}</h3>
                <p className="text-lg opacity-90 italic leading-relaxed max-w-[80%]">"{quizItem.definition}"</p>
                <button 
                  onClick={(e) => { e.stopPropagation(); handleSpeak(); }}
                  className="mt-6 p-3 bg-white/10 hover:bg-white/20 border border-white/20 rounded-full transition-all flex items-center gap-2 px-6 backdrop-blur-md"
                  aria-label="Listen to pronunciation"
                >
                  <Volume2 className="w-5 h-5" />
                  <span className="font-bold text-sm">Nghe phát âm</span>
                </button>
             </div>
           )}
        </div>
      </div>

      {/* Options Grid */}
      <div className="grid grid-cols-2 gap-3 mb-6">
        {quizItem.options.map((option, index) => {
          let btnClass = "bg-white border-slate-200 text-slate-700 hover:border-indigo-300 hover:bg-slate-50";
          
          if (isRevealed) {
            if (index === quizItem.correctOptionIndex) {
              btnClass = "bg-green-100 border-green-500 text-green-800 ring-2 ring-green-500 ring-offset-2";
            } else if (index === selectedOption && index !== quizItem.correctOptionIndex) {
              btnClass = "bg-red-100 border-red-500 text-red-800 opacity-60";
            } else {
              btnClass = "opacity-40 border-transparent bg-slate-50 grayscale";
            }
          }

          return (
            <button
              key={index}
              disabled={isRevealed}
              onClick={() => handleOptionClick(index)}
              className={`
                relative p-4 rounded-xl border-2 font-bold text-lg capitalize transition-all duration-200
                shadow-sm active:scale-95 flex items-center justify-center min-h-[64px]
                ${btnClass}
              `}
            >
              {option}
              {isRevealed && index === quizItem.correctOptionIndex && (
                <CheckCircle className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-green-600 fill-green-100" />
              )}
              {isRevealed && index === selectedOption && index !== quizItem.correctOptionIndex && (
                <XCircle className="absolute right-2 top-1/2 -translate-y-1/2 w-5 h-5 text-red-600 fill-red-100" />
              )}
            </button>
          );
        })}
      </div>

      {/* Next Button (Only visible after selection) */}
      <div className="h-16">
        {isRevealed && (
          <button
            onClick={() => onNext(isCorrect)}
            className="w-full bg-indigo-600 text-white font-bold text-lg py-4 rounded-2xl shadow-lg shadow-indigo-200 hover:bg-indigo-700 hover:-translate-y-0.5 active:translate-y-0 transition-all flex items-center justify-center gap-2 animate-in slide-in-from-bottom-4 duration-300"
          >
            <span>{roundNumber >= 10 ? 'Xem kết quả' : 'Câu tiếp theo'}</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        )}
      </div>
    </div>
  );
};