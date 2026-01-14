import React, { useState } from 'react';
import { ChevronLeft, ChevronRight, Calendar as CalIcon } from 'lucide-react';

export default function CalendarView({ tasks }) {
    const [currentDate, setCurrentDate] = useState(new Date());

    const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate();
    const firstDay = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1).getDay();

    const monthNames = ["1월", "2월", "3월", "4월", "5월", "6월", "7월", "8월", "9월", "10월", "11월", "12월"];

    const prevMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1));
    };

    const nextMonth = () => {
        setCurrentDate(new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1));
    };

    return (
        <div className="glass-panel p-6 animate-fade-in">
            <div className="flex justify-between items-center mb-6">
                <h2 className="flex items-center gap-2">
                    <CalIcon className="text-accent-primary" />
                    <span className="gradient-text text-2xl font-bold">
                        {currentDate.getFullYear()}년 {monthNames[currentDate.getMonth()]}
                    </span>
                </h2>
                <div className="flex gap-2">
                    <button onClick={prevMonth} className="glass-button p-2"><ChevronLeft size={20} /></button>
                    <button onClick={nextMonth} className="glass-button p-2"><ChevronRight size={20} /></button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-2 text-center text-text-muted mb-2 font-semibold">
                <div className="text-red-400">일</div>
                <div>월</div>
                <div>화</div>
                <div>수</div>
                <div>목</div>
                <div>금</div>
                <div className="text-blue-400">토</div>
            </div>

            <div className="grid grid-cols-7 gap-2">
                {Array.from({ length: firstDay }).map((_, i) => (
                    <div key={`empty-${i}`} className="h-24 glass-panel opacity-30"></div>
                ))}
                {Array.from({ length: daysInMonth }).map((_, i) => {
                    const day = i + 1;
                    // Simple visual logic: Is today?
                    const isToday = day === new Date().getDate() &&
                        currentDate.getMonth() === new Date().getMonth() &&
                        currentDate.getFullYear() === new Date().getFullYear();

                    return (
                        <div key={day} className={`h-24 glass-panel p-2 flex flex-col items-start hover:bg-white/5 transition-colors ${isToday ? 'border-accent-tertiary border-2' : ''}`}>
                            <span className={`text-sm font-bold ${isToday ? 'text-accent-tertiary' : ''}`}>{day}</span>
                            {/* Placeholder for tasks */}
                            {day === 19 && currentDate.getMonth() === 10 && currentDate.getFullYear() === 2026 && (
                                <div className="mt-1 text-xs bg-red-500/20 text-red-200 px-1 rounded w-full">
                                    D-DAY
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
