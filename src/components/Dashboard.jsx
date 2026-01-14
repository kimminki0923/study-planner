import React from 'react';
import { Clock, Calendar, Target, TrendingUp } from 'lucide-react';

export default function Dashboard({ user, onNavigate }) {
    const today = new Date();
    const targetDate = new Date(user.targetDate);
    const diffTime = targetDate - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    return (
        <div className="space-y-6 animate-fade-in">
            {/* Hero Section */}
            <div className="glass-panel p-8 text-center relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1 bg-gradient-to-r from-accent-primary via-accent-secondary to-accent-primary"></div>
                <h1 className="text-4xl md:text-6xl font-black mb-2 tracking-tighter">
                    D-<span className="gradient-text">{daysLeft}</span>
                </h1>
                <p className="text-xl text-text-secondary font-light">{user.goalDescription}</p>
                <div className="mt-8 flex justify-center gap-4">
                    <button onClick={() => onNavigate('tracker')} className="glass-button bg-accent-primary/20 hover:bg-accent-primary/30 border-accent-primary/50 text-white px-8 py-3 text-lg">
                        공부 시작하기
                    </button>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6">
                <div className="glass-panel p-6 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => onNavigate('calendar')}>
                    <div className="p-3 bg-blue-500/20 rounded-xl text-blue-400">
                        <Calendar size={28} />
                    </div>
                    <div>
                        <div className="text-sm text-text-muted">이번 달 일정</div>
                        <div className="text-xl font-bold">3월 모의고사 대비</div>
                    </div>
                </div>

                <div className="glass-panel p-6 flex items-center gap-4 hover:bg-white/5 transition-colors cursor-pointer" onClick={() => onNavigate('tracker')}>
                    <div className="p-3 bg-green-500/20 rounded-xl text-green-400">
                        <Clock size={28} />
                    </div>
                    <div>
                        <div className="text-sm text-text-muted">오늘 공부</div>
                        <div className="text-xl font-bold">0시간 00분</div>
                    </div>
                </div>

                <div className="glass-panel p-6 flex items-center gap-4 hover:bg-white/5 transition-colors">
                    <div className="p-3 bg-purple-500/20 rounded-xl text-purple-400">
                        <TrendingUp size={28} />
                    </div>
                    <div>
                        <div className="text-sm text-text-muted">진행률</div>
                        <div className="text-xl font-bold">상위 4% 목표</div>
                    </div>
                </div>
            </div>

            {/* Focus Area */}
            <div className="glass-panel p-6">
                <h3 className="text-lg font-bold mb-4 flex items-center gap-2">
                    <Target className="text-accent-secondary" />
                    오늘의 집중 과목
                </h3>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    {['국어', '수학', '영어', '탐구'].map((sub, i) => (
                        <div key={sub} className="bg-white/5 p-4 rounded-xl text-center border border-white/5 hover:border-white/20 transition-all">
                            <div className="font-bold mb-1">{sub}</div>
                            <div className="text-xs text-text-muted">계획 2건</div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
