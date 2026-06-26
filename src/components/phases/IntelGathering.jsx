import React, { useState } from "react";
import { ArrowLeft, ArrowRight, Shield, Award, Zap, HelpCircle, Cpu } from "lucide-react";
import { defaultQuestions } from "../../utils/srsTemplates";

export const IntelGathering = ({ answers, onAnswerQuestion, navigateToPhase, badges, onFastForward }) => {
  const [currentIdx, setCurrentIdx] = useState(0);
  const [textInput, setTextInput] = useState("");
  
  const questions = defaultQuestions;
  const currentQuestion = questions[currentIdx];
  
  const answeredCount = Object.keys(answers).length;
  const progressPercent = (answeredCount / questions.length) * 100;
  
  // Calculate AI confidence meter (from 15% starting base to 100%)
  const confidencePercent = Math.min(100, 15 + Math.round((answeredCount / questions.length) * 85));

  const handleOptionSelect = (option) => {
    onAnswerQuestion(currentQuestion.id, option.value, option.xp || 75);
    
    // Auto-advance if not the last question
    if (currentIdx < questions.length - 1) {
      setTimeout(() => {
        setCurrentIdx((prev) => prev + 1);
        setTextInput("");
      }, 300);
    }
  };

  const handleTextSubmit = (e) => {
    e.preventDefault();
    if (!textInput.trim()) return;

    onAnswerQuestion(currentQuestion.id, textInput, currentQuestion.xp || 75);
    
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setTextInput("");
    }
  };

  const handleBack = () => {
    if (currentIdx > 0) {
      setCurrentIdx((prev) => prev - 1);
      const prevAnswer = answers[questions[currentIdx - 1].id] || "";
      setTextInput(typeof prevAnswer === "string" ? prevAnswer : "");
    }
  };

  const handleSkip = () => {
    onAnswerQuestion(currentQuestion.id, "Not specified / Default", 25);
    if (currentIdx < questions.length - 1) {
      setCurrentIdx((prev) => prev + 1);
      setTextInput("");
    }
  };

  return (
    <div className="w-full max-w-3xl mx-auto py-6 px-4 animate-fade-in flex flex-col justify-between min-h-[80vh]">
      {/* Step Header / Stats */}
      <div className="space-y-4 mb-6">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-surface/30 border border-edge/60 rounded-xl p-3.5">
          {/* Question Index Ticker */}
          <div className="flex items-center space-x-2.5">
            <span className="w-2 h-2 rounded-full bg-aurora animate-pulse" />
            <span className="font-mono text-xs text-muted uppercase tracking-wider">
              Scoping Phase: Question {currentIdx + 1} of {questions.length}
            </span>
          </div>

          {/* Dynamic AI Confidence Meter */}
          <div className="flex items-center space-x-3 min-w-[200px]">
            <span className="font-mono text-[10px] text-muted uppercase">Confidence:</span>
            <div className="flex-grow bg-edge h-2.5 rounded-full overflow-hidden relative border border-edge/50">
              <div 
                className="bg-gradient-to-r from-aurora to-pulse h-full rounded-full transition-all duration-500"
                style={{ width: `${confidencePercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Fast-Forward Button */}
        <div className="flex justify-end">
          <button
            onClick={onFastForward}
            className="px-3.5 py-1.5 bg-gradient-to-r from-aurora to-pulse border border-aurora text-midnight hover:brightness-110 font-display text-xs font-bold rounded-lg transition-all shadow-[0_0_10px_rgba(92,84,230,0.2)] hover:scale-[1.02] active:scale-[0.98] cursor-pointer flex items-center space-x-1.5"
          >
            <Zap className="w-3.5 h-3.5 fill-midnight text-midnight" />
            <span>Fast-Forward Q&A (+600 XP)</span>
          </button>
        </div>

        {/* Global Progress Bar */}
        <div className="w-full bg-edge/50 h-1.5 rounded-full overflow-hidden">
          <div 
            className="bg-pulse h-full rounded-full transition-all duration-300"
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Main Question Card Area */}
      <div className="flex-grow flex items-center justify-center py-4">
        <div className="w-full glass-panel border border-edge rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden transition-all duration-300">
          <div className="absolute -top-24 -right-24 w-48 h-48 bg-aurora/5 rounded-full blur-3xl pointer-events-none" />

          {/* AI Avatar Question Bubble */}
          <div className="flex items-start space-x-4 mb-6">
            <div className="w-12 h-12 rounded-xl bg-edge border border-aurora flex items-center justify-center shrink-0 shadow-[0_0_8px_rgba(108,99,255,0.2)]">
              <Cpu className="w-6 h-6 text-aurora" />
            </div>
            <div className="space-y-1">
              <span className="font-mono text-[9px] text-aurora font-bold tracking-widest uppercase">Intel Scout AI</span>
              <h2 className="font-display font-medium text-lg sm:text-xl text-paper leading-snug">
                "{currentQuestion.text}"
              </h2>
            </div>
          </div>

          {/* Question Input Rendering */}
          {currentQuestion.type === "scale" && (
            <div className="grid grid-cols-1 gap-3.5 my-6">
              {currentQuestion.options.map((opt, i) => {
                const isSelected = answers[currentQuestion.id] === opt.value;
                return (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(opt)}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col justify-between items-start gap-1 relative overflow-hidden ${
                      isSelected
                        ? "bg-aurora/10 border-aurora text-paper shadow-[0_0_12px_rgba(108,99,255,0.2)]"
                        : "bg-surface/50 border-edge text-muted hover:border-edge/90 hover:bg-surface/85 hover:text-paper"
                    }`}
                  >
                    <span className="font-display text-sm font-semibold">{opt.value}</span>
                    <span className="text-xs opacity-75">{opt.sub}</span>
                    {isSelected && (
                      <span className="absolute top-4 right-4 w-4 h-4 rounded-full bg-aurora flex items-center justify-center text-[10px] text-midnight font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === "multiple_choice" && (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 my-6">
              {currentQuestion.options.map((opt, i) => {
                const isSelected = answers[currentQuestion.id] === opt.value;
                return (
                  <button
                    key={i}
                    onClick={() => handleOptionSelect(opt)}
                    className={`text-left p-4 rounded-xl border transition-all duration-200 cursor-pointer flex flex-col gap-1 relative ${
                      isSelected
                        ? "bg-aurora/10 border-aurora text-paper shadow-[0_0_12px_rgba(108,99,255,0.2)]"
                        : "bg-surface/50 border-edge text-muted hover:border-edge/90 hover:bg-surface/85 hover:text-paper"
                    }`}
                  >
                    <span className="font-display text-base font-bold">{opt.label}</span>
                    <span className="text-xs opacity-75">{opt.sub}</span>
                    {isSelected && (
                      <span className="absolute top-4 right-4 w-4 h-4 rounded-full bg-aurora flex items-center justify-center text-[10px] text-midnight font-bold">
                        ✓
                      </span>
                    )}
                  </button>
                );
              })}
            </div>
          )}

          {currentQuestion.type === "open_text" && (
            <form onSubmit={handleTextSubmit} className="space-y-4 my-6">
              <textarea
                value={textInput}
                onChange={(e) => setTextInput(e.target.value)}
                placeholder={currentQuestion.placeholder}
                className="w-full bg-midnight/80 border border-edge text-paper rounded-xl px-4 py-3 text-sm focus:border-aurora min-h-[100px] resize-none"
                required
              />
              <button
                type="submit"
                disabled={!textInput.trim()}
                className={`w-full py-3 rounded-xl font-display font-bold text-xs tracking-wider uppercase transition-all duration-300 flex items-center justify-center space-x-2 border cursor-pointer ${
                  textInput.trim()
                    ? "bg-pulse border-pulse text-midnight font-bold shadow-[0_0_12px_rgba(0,229,160,0.3)]"
                    : "bg-edge/40 border-edge text-muted opacity-50 cursor-not-allowed"
                }`}
              >
                <span>Confirm Answer</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          {/* Action Back / Skip Navigation */}
          <div className="flex items-center justify-between border-t border-edge/60 pt-4 mt-4 text-xs font-mono text-muted">
            <button
              onClick={handleBack}
              disabled={currentIdx === 0}
              className={`flex items-center space-x-1.5 py-1.5 px-3 rounded-md hover:bg-edge/30 transition-all ${
                currentIdx === 0 ? "opacity-35 cursor-not-allowed" : "cursor-pointer text-paper hover:text-aurora"
              }`}
            >
              <ArrowLeft className="w-3.5 h-3.5" />
              <span>Back</span>
            </button>

            {currentQuestion.type !== "open_text" && (
              <button
                onClick={handleSkip}
                className="flex items-center space-x-1.5 py-1.5 px-3 rounded-md hover:bg-edge/30 text-muted hover:text-paper cursor-pointer transition-all"
              >
                <span>Skip this question</span>
                <HelpCircle className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Answered Trail Tracker (Previous answers) */}
      <div className="w-full bg-surface/20 border border-edge/40 rounded-2xl p-4 mt-6">
        <h4 className="font-mono text-[10px] text-muted uppercase tracking-wider mb-2.5">
          Intelligence Gathering - Captured Traits
        </h4>
        <div className="flex flex-wrap gap-2.5">
          {questions.map((q, idx) => {
            const val = answers[q.id];
            const isAnswered = !!val;
            const isActive = currentIdx === idx;

            return (
              <div
                key={q.id}
                onClick={() => setCurrentIdx(idx)}
                className={`px-3 py-1.5 rounded-xl border text-xs font-medium cursor-pointer transition-all flex items-center space-x-2 ${
                  isActive
                    ? "bg-aurora/10 border-aurora text-aurora font-bold"
                    : isAnswered
                    ? "bg-pulse/5 border-pulse/20 text-pulse hover:border-pulse/50"
                    : "bg-midnight/40 border-edge text-muted opacity-40 hover:opacity-70"
                }`}
              >
                <span className="font-mono opacity-60">Q{idx + 1}:</span>
                <span className="truncate max-w-[120px]">
                  {isAnswered ? val : "Pending"}
                </span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
