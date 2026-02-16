import React, { useState } from 'react';
import { quizQuestions } from '../data/lessonContent';
import { CheckCircle2, XCircle, RefreshCw, Trophy } from 'lucide-react';

const MiniQuiz: React.FC = () => {
    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [selectedOption, setSelectedOption] = useState<number | null>(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [score, setScore] = useState(0);
    const [showResult, setShowResult] = useState(false);

    const handleOptionClick = (idx: number) => {
        if (isAnswered) return;
        setSelectedOption(idx);
    };

    const handleCheck = () => {
        if (selectedOption === null) return;

        if (selectedOption === quizQuestions[currentQuestion].correctAnswer) {
            setScore(score + 1);
        }
        setIsAnswered(true);
    };

    const handleNext = () => {
        if (currentQuestion < quizQuestions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setSelectedOption(null);
            setIsAnswered(false);
        } else {
            setShowResult(true);
        }
    };

    const resetQuiz = () => {
        setCurrentQuestion(0);
        setSelectedOption(null);
        setIsAnswered(false);
        setScore(0);
        setShowResult(false);
    };

    if (showResult) {
        return (
            <div className="bg-white rounded-3xl p-12 border border-slate-200 shadow-xl text-center max-w-xl mx-auto">
                <div className="w-24 h-24 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center mx-auto mb-6 shadow-inner">
                    <Trophy size={48} />
                </div>
                <h3 className="text-3xl font-extrabold text-slate-800 mb-2">Quiz Completed!</h3>
                <p className="text-slate-600 mb-8">You've mastered the basics of logical conditions.</p>

                <div className="bg-slate-50 border border-slate-100 rounded-2xl p-6 mb-8 flex justify-around">
                    <div className="text-center">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Score</div>
                        <div className="text-3xl font-black text-blue-600">{score} / {quizQuestions.length}</div>
                    </div>
                    <div className="text-center border-l border-slate-200 pl-8">
                        <div className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Accuracy</div>
                        <div className="text-3xl font-black text-blue-600">
                            {Math.round((score / quizQuestions.length) * 100)}%
                        </div>
                    </div>
                </div>

                <button
                    onClick={resetQuiz}
                    className="flex items-center gap-2 justify-center w-full py-4 bg-blue-600 text-white font-bold rounded-xl hover:bg-blue-500 transition-all shadow-lg active:scale-95"
                >
                    <RefreshCw size={20} />
                    Try Again
                </button>
            </div>
        );
    }

    const q = quizQuestions[currentQuestion];

    return (
        <div className="bg-white rounded-3xl p-10 border border-slate-200 shadow-xl max-w-2xl mx-auto">
            <div className="flex justify-between items-center mb-8">
                <span className="text-xs font-bold text-blue-600 bg-blue-50 px-3 py-1 rounded-full uppercase tracking-widest">
                    Question {currentQuestion + 1} of {quizQuestions.length}
                </span>
                <div className="w-32 bg-slate-100 h-1.5 rounded-full overflow-hidden">
                    <div
                        className="bg-blue-500 h-full transition-all duration-300"
                        style={{ width: `${((currentQuestion + 1) / quizQuestions.length) * 100}%` }}
                    />
                </div>
            </div>

            <h3 className="text-2xl font-bold text-slate-800 mb-8 leading-tight">{q.question}</h3>

            <div className="space-y-4 mb-10">
                {q.options.map((option, idx) => {
                    let styles = "border-slate-200 hover:border-blue-300 hover:bg-slate-50";
                    let icon = null;

                    if (isAnswered) {
                        if (idx === q.correctAnswer) {
                            styles = "border-green-500 bg-green-50 text-green-700 ring-1 ring-green-500";
                            icon = <CheckCircle2 className="text-green-500" size={20} />;
                        } else if (idx === selectedOption) {
                            styles = "border-red-500 bg-red-50 text-red-700 ring-1 ring-red-500";
                            icon = <XCircle className="text-red-500" size={20} />;
                        } else {
                            styles = "opacity-50 border-slate-100 text-slate-400";
                        }
                    } else if (idx === selectedOption) {
                        styles = "border-blue-500 bg-blue-50 text-blue-700 shadow-md ring-1 ring-blue-500";
                    }

                    return (
                        <button
                            key={idx}
                            disabled={isAnswered}
                            onClick={() => handleOptionClick(idx)}
                            className={`w-full text-left p-5 rounded-xl border-2 transition-all flex justify-between items-center font-medium ${styles}`}
                        >
                            <span>{option}</span>
                            {icon}
                        </button>
                    );
                })}
            </div>

            {!isAnswered ? (
                <button
                    disabled={selectedOption === null}
                    onClick={handleCheck}
                    className={`w-full py-4 rounded-xl font-bold transition-all shadow-lg ${selectedOption !== null
                        ? 'bg-blue-600 text-white hover:bg-blue-500 active:scale-95'
                        : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        }`}
                >
                    Check Answer
                </button>
            ) : (
                <button
                    onClick={handleNext}
                    className="w-full py-4 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
                >
                    {currentQuestion < quizQuestions.length - 1 ? 'Next Question' : 'Finish Quiz'}
                    {currentQuestion < quizQuestions.length - 1 && <ArrowRight size={20} />}
                </button>
            )}
        </div>
    );
};

const ArrowRight: React.FC<{ size?: number }> = ({ size = 24 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        <path d="M5 12h14M12 5l7 7-7 7" />
    </svg>
);

export default MiniQuiz;
