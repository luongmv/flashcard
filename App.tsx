import React, { useState, useEffect, useCallback } from 'react';
import { MainMenu } from './components/MainMenu';
import { GameScreen } from './components/GameScreen';
import { ResultScreen } from './components/ResultScreen';
import { Loader } from './components/Loader';
import { fetchQuizItem } from './services/geminiService';
import { GameState, QuizItem, GameSession } from './types';
import { AlertCircle } from 'lucide-react';

const TOTAL_ROUNDS = 10;

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState>(GameState.MENU);
  const [difficulty, setDifficulty] = useState<string>('beginner');
  const [currentQuizItem, setCurrentQuizItem] = useState<QuizItem | null>(null);
  const [session, setSession] = useState<GameSession>({
    score: 0,
    totalRounds: TOTAL_ROUNDS,
    currentRound: 0,
    history: []
  });
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const startNewRound = useCallback(async (isRetry = false) => {
    if (!isRetry) {
      setGameState(GameState.LOADING);
      setErrorMsg(null);
    }
    
    try {
      // Pass the list of previous words to avoid duplicates
      const excludedWords = session.history.map(h => h.word);
      const item = await fetchQuizItem(difficulty, excludedWords);
      setCurrentQuizItem(item);
      setGameState(GameState.PLAYING);
    } catch (err) {
      console.error(err);
      setErrorMsg("Không thể tạo nội dung. Hệ thống AI đang bận.");
      setGameState(GameState.ERROR);
    }
  }, [difficulty, session.history]);

  // Effect to trigger the first round when session is reset (handled via button click below mostly)
  // but if we need a retry mechanism or initial load logic:
  useEffect(() => {
     // This hook can remain empty as we drive state via handlers, 
     // but keeping it simple is best.
  }, []);


  const handleStartGameClick = (selectedDifficulty: string) => {
      setDifficulty(selectedDifficulty);
      setSession({
        score: 0,
        totalRounds: TOTAL_ROUNDS,
        currentRound: 1,
        history: []
      });
      // We manually clear exclusions for the first round
      setGameState(GameState.LOADING);
      setErrorMsg(null);
      
      fetchQuizItem(selectedDifficulty, [])
        .then(item => {
            setCurrentQuizItem(item);
            setGameState(GameState.PLAYING);
        })
        .catch(err => {
            console.error(err);
            setErrorMsg("Không thể tạo nội dung. Vui lòng thử lại.");
            setGameState(GameState.ERROR);
        });
  };

  const handleNextRound = (wasCorrect: boolean) => {
    // Update session
    const points = wasCorrect ? 10 : 0;
    const newSession = {
      ...session,
      score: session.score + points,
      history: [...session.history, { word: currentQuizItem!.word, correct: wasCorrect }]
    };
    setSession(newSession);

    if (session.currentRound >= TOTAL_ROUNDS) {
      setGameState(GameState.GAME_OVER);
    } else {
      // Advance round
      setSession(prev => ({ ...prev, score: prev.score + points, currentRound: prev.currentRound + 1, history: newSession.history }));
      
      setGameState(GameState.LOADING);
      fetchQuizItem(difficulty, newSession.history.map(h => h.word))
        .then(item => {
            setCurrentQuizItem(item);
            setGameState(GameState.PLAYING);
        })
        .catch(err => {
            console.error(err);
            setErrorMsg("Không thể tải câu tiếp theo.");
            setGameState(GameState.ERROR);
        });
    }
  };

  const resetGame = () => {
    setGameState(GameState.MENU);
  };

  return (
    <div className="min-h-screen bg-slate-50 flex flex-col font-sans text-slate-900">
      {/* Top Navigation Bar (visual only) */}
      <nav className="w-full bg-white border-b border-slate-200 px-6 py-4 flex items-center justify-between sticky top-0 z-20 shadow-sm">
        <div className="font-black text-xl text-indigo-600 tracking-tight flex items-center gap-2">
          <span>Fruit Master</span>
        </div>
        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest">
          {gameState === GameState.MENU ? 'Trang chủ' : gameState === GameState.GAME_OVER ? 'Kết quả' : `Câu ${session.currentRound}/${TOTAL_ROUNDS}`}
        </div>
      </nav>

      <main className="flex-grow flex flex-col max-w-md w-full mx-auto p-4 justify-center">
        {gameState === GameState.MENU && (
          <MainMenu onStart={handleStartGameClick} />
        )}

        {gameState === GameState.LOADING && (
          <Loader message="Đang tìm trái cây..." />
        )}

        {gameState === GameState.PLAYING && currentQuizItem && (
          <GameScreen 
            quizItem={currentQuizItem} 
            onNext={handleNextRound}
            roundNumber={session.currentRound}
            score={session.score}
          />
        )}

        {gameState === GameState.GAME_OVER && (
          <ResultScreen 
            session={session} 
            onRestart={() => handleStartGameClick(difficulty)} 
            onHome={resetGame}
          />
        )}

        {gameState === GameState.ERROR && (
          <div className="flex flex-col items-center justify-center h-full text-center p-6 animate-in zoom-in-95">
            <AlertCircle className="w-16 h-16 text-red-500 mb-6" />
            <h3 className="text-xl font-bold text-slate-800 mb-2">Rất tiếc! Đã có lỗi xảy ra.</h3>
            <p className="text-slate-500 mb-8">{errorMsg || "Không thể kết nối đến dịch vụ AI."}</p>
            <button 
              onClick={() => startNewRound(true)}
              className="px-8 py-3 bg-indigo-600 text-white font-bold rounded-xl hover:bg-indigo-700 transition-colors shadow-lg shadow-indigo-200"
            >
              Thử lại
            </button>
            <button 
              onClick={resetGame}
              className="mt-6 text-slate-500 font-semibold text-sm hover:underline hover:text-slate-700"
            >
              Quay về trang chủ
            </button>
          </div>
        )}
      </main>
      
      <footer className="py-6 text-center text-slate-300 text-xs font-semibold uppercase tracking-widest">
        Powered by Google Gemini
      </footer>
    </div>
  );
};

export default App;