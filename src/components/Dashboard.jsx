import React from 'react';
import { Clock, Calendar, Target, TrendingUp } from 'lucide-react';

export default function Dashboard({ user, subjects, sessions, todayTotal, onNavigate }) {
    const today = new Date();
    const targetDate = new Date(user.targetDate);
    const diffTime = targetDate - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const totalHours = Math.floor(todayTotal / 60);
    const totalMinutes = todayTotal % 60;

    // Calculate total time per subject from all sessions
    const subjectTotals = {};
    subjects.forEach(s => { subjectTotals[s.id] = 0; });

    if (sessions) {
        sessions.forEach(session => {
            if (session.data) {
                Object.entries(session.data).forEach(([subjectId, minutes]) => {
                    if (subjectTotals[subjectId] !== undefined) {
                        subjectTotals[subjectId] += minutes;
                    }
                });
            }
        });
    }

    const formatTime = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        if (h === 0) return `${m}분`;
        if (m === 0) return `${h}시간`;
        return `${h}시간 ${m}분`;
    };

    const grandTotal = Object.values(subjectTotals).reduce((a, b) => a + b, 0);

    return (
        <div className="animate-in">
            {/* D-Day Hero */}
            <div className="glass-panel p-6 mb-4 text-center">
                <p className="text-text-muted text-sm mb-1">2026학년도 수능까지</p>
                <h1 className="text-5xl font-bold mb-2">
                    D-<span className="gradient-text">{daysLeft}</span>
                </h1>
                <p className="text-text-secondary">{user.goalDescription}</p>
            </div>

            {/* Quick Stats */}
            <div className="grid-2 mb-4">
                <div
                    className="glass-panel p-4 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => onNavigate('input')}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-green-500/20 rounded-lg">
                            <Clock size={20} className="text-green-400" />
                        </div>
                        <div>
                            <p className="text-text-muted text-xs">오늘 공부</p>
                            <p className="font-bold">{totalHours}시간 {totalMinutes}분</p>
                        </div>
                    </div>
                </div>

                <div
                    className="glass-panel p-4 cursor-pointer hover:bg-white/5 transition-colors"
                    onClick={() => onNavigate('stats')}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-purple-500/20 rounded-lg">
                            <TrendingUp size={20} className="text-purple-400" />
                        </div>
                        <div>
                            <p className="text-text-muted text-xs">누적 공부</p>
                            <p className="font-bold">{formatTime(grandTotal)}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subject Stats */}
            <div className="glass-panel p-4">
                <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-2">
                        <Target size={18} className="text-accent-secondary" />
                        <h2 className="text-sm font-semibold">과목별 현황</h2>
                    </div>
                    <span className="text-xs text-text-muted">총 {formatTime(grandTotal)}</span>
                </div>

                <div className="space-y-2">
                    {subjects.map(subject => {
                        const minutes = subjectTotals[subject.id] || 0;

                        return (
                            <div
                                key={subject.id}
                                className="flex items-center justify-between p-2 rounded-lg"
                                style={{ background: `${subject.color}10` }}
                            >
                                <div className="flex items-center gap-2">
                                    <div
                                        className="w-2 h-2 rounded-full"
                                        style={{ background: subject.color }}
                                    />
                                    <span className="text-sm">{subject.name}</span>
                                </div>
                                <span className="text-sm font-semibold" style={{ color: subject.color }}>
                                    {formatTime(minutes)}
                                </span>
                            </div>
                        );
                    })}
                </div>
            </div>
        </div>
    );
}
