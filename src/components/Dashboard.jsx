import React from 'react';
import { Clock, Calendar, Target } from 'lucide-react';

export default function Dashboard({ user, subjects, todayTotal, onNavigate }) {
    const today = new Date();
    const targetDate = new Date(user.targetDate);
    const diffTime = targetDate - today;
    const daysLeft = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    const totalHours = Math.floor(todayTotal / 60);
    const totalMinutes = todayTotal % 60;

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
                    onClick={() => onNavigate('calendar')}
                >
                    <div className="flex items-center gap-3">
                        <div className="p-2 bg-blue-500/20 rounded-lg">
                            <Calendar size={20} className="text-blue-400" />
                        </div>
                        <div>
                            <p className="text-text-muted text-xs">이번 달</p>
                            <p className="font-bold">월간 계획</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Subjects Grid */}
            <div className="glass-panel p-4">
                <div className="flex items-center gap-2 mb-3">
                    <Target size={18} className="text-accent-secondary" />
                    <h2 className="text-sm font-semibold">과목별 현황</h2>
                </div>
                <div className="grid grid-cols-4 gap-2">
                    {subjects.map(subject => (
                        <div
                            key={subject.id}
                            className="p-2 rounded-lg text-center text-xs"
                            style={{ background: `${subject.color}15`, borderBottom: `2px solid ${subject.color}` }}
                        >
                            <span className="font-medium">{subject.name.replace('(', '\n(')}</span>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    );
}
