import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, X, Save } from 'lucide-react';

export default function CalendarView({ events, onAddEvent }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [eventText, setEventText] = useState('');

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const firstDayOfWeek = new Date(year, month, 1).getDay();

    const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];
    const dayNames = ["일", "월", "화", "수", "목", "금", "토"];

    const prevMonth = () => {
        setCurrentDate(new Date(year, month - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(year, month + 1, 1));
    };

    const getDateKey = (day) => {
        return `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const handleDayClick = (day) => {
        const dateKey = getDateKey(day);
        setSelectedDay(day);
        setEventText(events[dateKey] || '');
    };

    const handleSave = () => {
        if (selectedDay !== null) {
            const dateKey = getDateKey(selectedDay);
            onAddEvent(dateKey, eventText);
            setSelectedDay(null);
            setEventText('');
        }
    };

    const handleClose = () => {
        setSelectedDay(null);
        setEventText('');
    };

    // Build calendar grid
    const calendarDays = [];

    // Empty cells before first day
    for (let i = 0; i < firstDayOfWeek; i++) {
        calendarDays.push(null);
    }

    // Days of month
    for (let day = 1; day <= daysInMonth; day++) {
        calendarDays.push(day);
    }

    const today = new Date();
    const isToday = (day) => {
        return day === today.getDate() &&
            month === today.getMonth() &&
            year === today.getFullYear();
    };

    return (
        <div className="animate-in">
            <div className="glass-panel p-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <button onClick={prevMonth} className="btn btn-ghost p-2">
                        <ChevronLeft size={20} />
                    </button>
                    <h2 className="text-lg font-bold gradient-text">
                        {year}년 {monthNames[month]}
                    </h2>
                    <button onClick={nextMonth} className="btn btn-ghost p-2">
                        <ChevronRight size={20} />
                    </button>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 mb-2">
                    {dayNames.map((day, i) => (
                        <div
                            key={day}
                            className={`text-center text-xs font-semibold py-2 ${i === 0 ? 'text-red-400' : i === 6 ? 'text-blue-400' : 'text-text-muted'
                                }`}
                        >
                            {day}
                        </div>
                    ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {calendarDays.map((day, index) => {
                        if (day === null) {
                            return <div key={`empty-${index}`} className="h-20" />;
                        }

                        const dateKey = getDateKey(day);
                        const hasEvent = events && events[dateKey];
                        const dayOfWeek = (firstDayOfWeek + day - 1) % 7;

                        return (
                            <div
                                key={day}
                                onClick={() => handleDayClick(day)}
                                className={`
                  h-20 p-1.5 rounded-lg cursor-pointer transition-all
                  hover:bg-white/10 active:scale-95
                  ${isToday(day) ? 'ring-2 ring-accent-tertiary bg-accent-tertiary/10' : 'bg-black/20'}
                  ${hasEvent ? 'bg-accent-primary/15' : ''}
                `}
                            >
                                <div className={`
                  text-xs font-semibold mb-1
                  ${isToday(day) ? 'text-accent-tertiary' : ''}
                  ${dayOfWeek === 0 ? 'text-red-400' : dayOfWeek === 6 ? 'text-blue-400' : ''}
                `}>
                                    {day}
                                </div>
                                {hasEvent && (
                                    <div className="text-[10px] text-text-secondary leading-tight line-clamp-2">
                                        {hasEvent}
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Event Modal */}
            {selectedDay !== null && (
                <div
                    className="fixed inset-0 bg-black/70 flex items-center justify-center z-50 p-4"
                    onClick={handleClose}
                >
                    <div
                        className="glass-panel p-6 w-full max-w-md"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <div className="flex justify-between items-center mb-4">
                            <h3 className="text-lg font-bold">
                                {month + 1}월 {selectedDay}일 계획
                            </h3>
                            <button onClick={handleClose} className="btn btn-ghost p-1">
                                <X size={20} />
                            </button>
                        </div>

                        <textarea
                            className="input w-full h-40 mb-4 resize-none"
                            value={eventText}
                            onChange={(e) => setEventText(e.target.value)}
                            placeholder="이 날의 계획을 입력하세요...&#10;&#10;예시:&#10;- 수학 3시간&#10;- 영어 단어 100개&#10;- 국어 모의고사"
                            autoFocus
                        />

                        <div className="flex gap-2">
                            <button onClick={handleClose} className="btn btn-ghost flex-1">
                                취소
                            </button>
                            <button onClick={handleSave} className="btn btn-primary flex-1 flex items-center justify-center gap-2">
                                <Save size={16} />
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
