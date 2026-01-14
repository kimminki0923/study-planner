import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Plus, X } from 'lucide-react';

export default function CalendarView({ events, onAddEvent }) {
    const [currentDate, setCurrentDate] = useState(new Date());
    const [selectedDay, setSelectedDay] = useState(null);
    const [newEvent, setNewEvent] = useState('');

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();
    const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    const getDateKey = (day) => {
        return `${currentDate.getFullYear()}-${String(currentDate.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
    };

    const handleDayClick = (day) => {
        setSelectedDay(day);
        setNewEvent(events[getDateKey(day)] || '');
    };

    const handleSaveEvent = () => {
        if (selectedDay) {
            onAddEvent(getDateKey(selectedDay), newEvent);
            setSelectedDay(null);
        }
    };

    return (
        <div className="animate-in">
            <div className="glass-panel p-4">
                {/* Header */}
                <div className="flex justify-between items-center mb-4">
                    <h2 className="gradient-text">
                        {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
                    </h2>
                    <div className="flex gap-2">
                        <button onClick={prevMonth} className="btn btn-ghost p-2"><ChevronLeft size={18} /></button>
                        <button onClick={nextMonth} className="btn btn-ghost p-2"><ChevronRight size={18} /></button>
                    </div>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 gap-1 text-center text-xs text-text-muted mb-2">
                    <div className="text-red-400">일</div>
                    <div>월</div>
                    <div>화</div>
                    <div>수</div>
                    <div>목</div>
                    <div>금</div>
                    <div className="text-blue-400">토</div>
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1">
                    {Array.from({ length: firstDay }).map((_, i) => (
                        <div key={`empty-${i}`} className="h-16"></div>
                    ))}
                    {Array.from({ length: daysInMonth }).map((_, i) => {
                        const day = i + 1;
                        const dateKey = getDateKey(day);
                        const hasEvent = events[dateKey];
                        const isToday = day === new Date().getDate() &&
                            currentDate.getMonth() === new Date().getMonth() &&
                            currentDate.getFullYear() === new Date().getFullYear();

                        return (
                            <div
                                key={day}
                                onClick={() => handleDayClick(day)}
                                className={`h-16 p-1 rounded-lg cursor-pointer transition-all hover:bg-white/5
                  ${isToday ? 'ring-1 ring-accent-tertiary' : ''}
                  ${hasEvent ? 'bg-accent-primary/10' : 'bg-black/20'}
                `}
                            >
                                <span className={`text-xs font-medium ${isToday ? 'text-accent-tertiary' : ''}`}>{day}</span>
                                {hasEvent && (
                                    <div className="mt-1 text-[10px] text-text-secondary truncate">
                                        {hasEvent.substring(0, 10)}...
                                    </div>
                                )}
                            </div>
                        );
                    })}
                </div>
            </div>

            {/* Event Modal */}
            {selectedDay && (
                <div className="fixed inset-0 bg-black/60 flex items-center justify-center z-50 p-4">
                    <div className="glass-panel p-6 w-full max-w-md">
                        <div className="flex justify-between items-center mb-4">
                            <h3>{currentDate.getMonth() + 1}월 {selectedDay}일 계획</h3>
                            <button onClick={() => setSelectedDay(null)} className="btn btn-ghost p-1">
                                <X size={18} />
                            </button>
                        </div>
                        <textarea
                            className="input w-full h-32 mb-4"
                            value={newEvent}
                            onChange={(e) => setNewEvent(e.target.value)}
                            placeholder="이 날의 계획을 입력하세요..."
                        />
                        <div className="flex gap-2">
                            <button onClick={() => setSelectedDay(null)} className="btn btn-ghost flex-1">
                                취소
                            </button>
                            <button onClick={handleSaveEvent} className="btn btn-primary flex-1">
                                저장
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
