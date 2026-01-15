import React, { useState, useEffect } from 'react';
import { analyzeStudyData } from '../services/gemini';
import { Bot, Key, Loader, AlertCircle } from 'lucide-react';

const AICoach = ({ sessions, subjects, user }) => {
    const [apiKey, setApiKey] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [analysis, setAnalysis] = useState(null);
    const [showKeyInput, setShowKeyInput] = useState(false);

    useEffect(() => {
        const storedKey = localStorage.getItem('gemini_api_key');
        if (storedKey) {
            setApiKey(storedKey);
        } else {
            setShowKeyInput(true);
        }
    }, []);

    const handleSaveKey = () => {
        if (apiKey.trim()) {
            localStorage.setItem('gemini_api_key', apiKey);
            setShowKeyInput(false);
            setError(null);
        }
    };

    const handleClearKey = () => {
        localStorage.removeItem('gemini_api_key');
        setApiKey('');
        setShowKeyInput(true);
        setAnalysis(null);
    };

    const handleAnalyze = async () => {
        setLoading(true);
        setError(null);
        try {
            const result = await analyzeStudyData(sessions, subjects, user, apiKey);
            setAnalysis(result);
        } catch (err) {
            setError(err.message || '분석 중 오류가 발생했습니다.');
            if (err.message.includes('API Key')) {
                setShowKeyInput(true);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 pb-20">
            <div className="card">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-2">
                        <Bot className="text-accent-primary" size={24} />
                        <h2 className="text-xl font-bold">AI 학습 코치</h2>
                    </div>
                    {!showKeyInput && (
                        <button
                            onClick={handleClearKey}
                            className="text-xs text-text-muted hover:text-accent-secondary"
                        >
                            API 키 변경
                        </button>
                    )}
                </div>

                {showKeyInput ? (
                    <div className="space-y-4">
                        <div className="p-4 bg-bg-secondary rounded-lg border border-border-primary">
                            <h3 className="font-semibold mb-2 flex items-center gap-2">
                                <Key size={16} /> API 키 설정
                            </h3>
                            <p className="text-sm text-text-muted mb-4">
                                Google Gemini API 키가 필요합니다. 키는 브라우저에만 저장됩니다.
                            </p>
                            <div className="flex gap-2">
                                <input
                                    type="password"
                                    value={apiKey}
                                    onChange={(e) => setApiKey(e.target.value)}
                                    placeholder="Gemini API Key 입력"
                                    className="input flex-1"
                                />
                                <button onClick={handleSaveKey} className="btn btn-primary">
                                    저장
                                </button>
                            </div>
                            <p className="text-xs text-text-muted mt-2">
                                <a
                                    href="https://aistudio.google.com/app/apikey"
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-accent-tertiary hover:underline"
                                >
                                    API 키 발급받기 &rarr;
                                </a>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="space-y-6">
                        {!analysis && !loading && (
                            <div className="text-center py-8">
                                <p className="text-text-muted mb-4">
                                    최근 학습 데이터를 바탕으로 AI가 학습 습관을 분석하고 조언해드립니다.
                                </p>
                                <button onClick={handleAnalyze} className="btn btn-primary w-full md:w-auto">
                                    학습 분석 시작하기
                                </button>
                            </div>
                        )}

                        {loading && (
                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                                <Loader className="animate-spin text-accent-primary" size={40} />
                                <p className="text-text-muted animate-pulse">
                                    AI가 학습 데이터를 분석하고 있습니다...
                                </p>
                            </div>
                        )}

                        {error && (
                            <div className="p-4 bg-red-500/10 border border-red-500/20 text-red-400 rounded-lg flex items-center gap-3">
                                <AlertCircle size={20} />
                                <span>{error}</span>
                            </div>
                        )}

                        {analysis && (
                            <div className="animate-fade-in space-y-4">
                                <div className="prose prose-invert max-w-none">
                                    {/* Simple markdown rendering by splitting lines. 
                      Ideally use a markdown library, but keeping it simple for now to avoid extra heavy deps if not needed yet.
                      Or just render as whitespace-pre-wrap div 
                  */}
                                    <div className="whitespace-pre-wrap bg-bg-secondary p-6 rounded-lg leading-relaxed">
                                        {analysis}
                                    </div>
                                </div>
                                <div className="flex justify-end">
                                    <button
                                        onClick={handleAnalyze}
                                        className="btn btn-ghost text-sm"
                                    >
                                        다시 분석하기
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default AICoach;
