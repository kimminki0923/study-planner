import React, { useState } from 'react';
import { Save } from 'lucide-react';

export default function StudyInput({ subjects, onSave, todayData }) {
    const [hours, setHours] = useState(() => {
        const initial = {};
        subjects.forEach(s => {
            initial[s.id] = todayData?.[s.id] || 0;
        });
        return initial;
    });

    const handleChange = (subjectId, value) => {
        const num = parseInt(value) || 0;
        setHours(prev => ({ ...prev, [subjectId]: Math.max(0, num) }));
    };

    const handleSave = () => {
        onSave(hours);
    };

    const totalMinutes = Object.values(hours).reduce((a, b) => a + b, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    return (
        <div className="animate-in">
            <div className="glass-panel p-6 mb-4">
                <div className="flex justify-between items-center mb-4">
                    <h2>오늘 공부 기록</h2>
                    <div className="text-text-secondary">
                        총 <span className="text-accent-primary font-bold">{totalHours}시간 {remainingMinutes}분</span>
                    </div>
                </div>

                <div className="grid-2 gap-3">
                    {subjects.map(subject => (
                        <div
                            key={subject.id}
                            className="flex items-center justify-between p-3 rounded-lg"
                            style={{ background: `${subject.color}10`, borderLeft: `3px solid ${subject.color}` }}
                        >
                            <span className="font-medium text-sm">{subject.name}</span>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    className="input input-number"
                                    value={hours[subject.id] || ''}
                                    onChange={(e) => handleChange(subject.id, e.target.value)}
                                    placeholder="0"
                                    min="0"
                                />
                                <span className="text-text-muted text-sm">분</span>
                            </div>
                        </div>
                    ))}
                </div>

                <button onClick={handleSave} className="btn btn-primary w-full mt-4 flex items-center justify-center gap-2">
                    <Save size={18} />
                    저장하기
                </button>
            </div>
        </div>
    );
}
