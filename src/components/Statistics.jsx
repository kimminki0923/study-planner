import React from 'react';
import { BarChart3, TrendingUp } from 'lucide-react';

export default function Statistics({ subjects, sessions }) {
    // Aggregate data by subject
    const subjectTotals = {};
    subjects.forEach(s => { subjectTotals[s.id] = 0; });

    sessions.forEach(session => {
        if (session.data) {
            Object.entries(session.data).forEach(([subjectId, minutes]) => {
                if (subjectTotals[subjectId] !== undefined) {
                    subjectTotals[subjectId] += minutes;
                }
            });
        }
    });

    const totalMinutes = Object.values(subjectTotals).reduce((a, b) => a + b, 0);
    const maxMinutes = Math.max(...Object.values(subjectTotals), 1);

    const formatTime = (minutes) => {
        const h = Math.floor(minutes / 60);
        const m = minutes % 60;
        if (h === 0) return `${m}분`;
        return `${h}시간 ${m}분`;
    };

    return (
        <div className="animate-in">
            {/* Summary Card */}
            <div className="glass-panel p-6 mb-4">
                <div className="flex items-center gap-2 mb-4">
                    <TrendingUp className="text-accent-primary" size={20} />
                    <h2>총 공부 시간</h2>
                </div>
                <div className="text-4xl font-bold gradient-text">
                    {formatTime(totalMinutes)}
                </div>
                <p className="text-text-muted text-sm mt-1">
                    {sessions.length}일 기록됨
                </p>
            </div>

            {/* Subject Breakdown */}
            <div className="glass-panel p-6">
                <div className="flex items-center gap-2 mb-4">
                    <BarChart3 className="text-accent-tertiary" size={20} />
                    <h2>과목별 통계</h2>
                </div>

                <div className="flex flex-col gap-3">
                    {subjects.map(subject => {
                        const minutes = subjectTotals[subject.id] || 0;
                        const percentage = totalMinutes > 0 ? (minutes / totalMinutes * 100).toFixed(1) : 0;
                        const barWidth = (minutes / maxMinutes * 100);

                        return (
                            <div key={subject.id}>
                                <div className="flex justify-between items-center mb-1">
                                    <span className="text-sm font-medium">{subject.name}</span>
                                    <span className="text-sm text-text-muted">
                                        {formatTime(minutes)} ({percentage}%)
                                    </span>
                                </div>
                                <div className="h-3 bg-black/20 rounded-full overflow-hidden">
                                    <div
                                        className="h-full rounded-full transition-all duration-500"
                                        style={{
                                            width: `${barWidth}%`,
                                            background: subject.color
                                        }}
                                    />
                                </div>
                            </div>
                        );
                    })}
                </div>

                {totalMinutes === 0 && (
                    <p className="text-center text-text-muted py-8">
                        아직 기록된 데이터가 없습니다.<br />
                        "기록" 탭에서 공부 시간을 입력해주세요.
                    </p>
                )}
            </div>
        </div>
    );
}
