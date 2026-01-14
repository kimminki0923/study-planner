import React, { useState } from 'react';
import { Save, ChevronLeft, ChevronRight } from 'lucide-react';

export default function StudyInput({ subjects, onSave, getDataForDate }) {
    const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);
    const [hours, setHours] = useState(() => {
        const initial = {};
        subjects.forEach(s => {
            initial[s.id] = 0;
        });
        return initial;
    });

    // Load data when date changes
    const handleDateChange = (newDate) => {
        setSelectedDate(newDate);
        const existingData = getDataForDate ? getDataForDate(newDate) : {};
        const updated = {};
        subjects.forEach(s => {
            updated[s.id] = existingData[s.id] || 0;
        });
        setHours(updated);
    };

    const goToPreviousDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() - 1);
        handleDateChange(d.toISOString().split('T')[0]);
    };

    const goToNextDay = () => {
        const d = new Date(selectedDate);
        d.setDate(d.getDate() + 1);
        handleDateChange(d.toISOString().split('T')[0]);
    };

    const handleChange = (subjectId, value) => {
        const num = parseInt(value) || 0;
        setHours(prev => ({ ...prev, [subjectId]: Math.max(0, num) }));
    };

    const handleSave = () => {
        onSave(selectedDate, hours);
        alert(`${selectedDate} 기록이 저장되었습니다!`);
    };

    const totalMinutes = Object.values(hours).reduce((a, b) => a + b, 0);
    const totalHours = Math.floor(totalMinutes / 60);
    const remainingMinutes = totalMinutes % 60;

    // Format date for display
    const formatDate = (dateStr) => {
        const d = new Date(dateStr);
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return `${d.getMonth() + 1}월 ${d.getDate()}일 (${days[d.getDay()]})`;
    };

    const isToday = selectedDate === new Date().toISOString().split('T')[0];

    return (
        <div className="animate-in">
            <div className="glass-panel p-4 mb-4">
                {/* Date Selector */}
                <div className="flex items-center justify-between mb-4">
                    <button onClick={goToPreviousDay} className="btn btn-ghost p-2">
                        <ChevronLeft size={20} />
                    </button>
                    <div className="text-center">
                        <input
                            type="date"
                            value={selectedDate}
                            onChange={(e) => handleDateChange(e.target.value)}
                            className="input text-center bg-transparent border-none text-lg font-bold"
                        />
                        <p className="text-xs text-text-muted">
                            {isToday ? '오늘' : formatDate(selectedDate)}
                        </p>
                    </div>
                    <button onClick={goToNextDay} className="btn btn-ghost p-2">
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Total */}
                <div className="text-center mb-4 p-3 bg-accent-primary/10 rounded-lg">
                    <span className="text-text-muted text-sm">총 공부 시간</span>
                    <p className="text-2xl font-bold gradient-text">
                        {totalHours}시간 {remainingMinutes}분
                    </p>
                </div>
            </div>

            <div className="glass-panel p-4">
                <h3 className="text-sm font-semibold text-text-secondary mb-3">과목별 시간 입력 (분)</h3>
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
                                <span className="text-text-muted text-xs">분</span>
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
