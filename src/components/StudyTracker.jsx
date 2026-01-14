import React, { useState, useEffect } from 'react';
import { Play, Pause, Save, CheckCircle, Circle } from 'lucide-react';

export default function StudyTracker({ subjects, onSaveSession, tasks, onToggleTask }) {
    const [selectedSubject, setSelectedSubject] = useState(subjects[0].id);
    const [isTimerRunning, setIsTimerRunning] = useState(false);
    const [time, setTime] = useState(0);

    useEffect(() => {
        let interval;
        if (isTimerRunning) {
            interval = setInterval(() => {
                setTime(prev => prev + 1);
            }, 1000);
        }
        return () => clearInterval(interval);
    }, [isTimerRunning]);

    const formatTime = (seconds) => {
        const h = Math.floor(seconds / 3600);
        const m = Math.floor((seconds % 3600) / 60);
        const s = seconds % 60;
        return `${h.toString().padStart(2, '0')}:${m.toString().padStart(2, '0')}:${s.toString().padStart(2, '0')}`;
    };

    const handleSave = () => {
        onSaveSession({ subjectId: selectedSubject, duration: time, date: new Date() });
        setTime(0);
        setIsTimerRunning(false);
        alert('공부 시간이 저장되었습니다!');
    };

    const currentSubjectObj = subjects.find(s => s.id === selectedSubject);

    return (
        <div className="grid md:grid-cols-2 gap-6 animate-fade-in">
            {/* Timer Section */}
            <div className="glass-panel p-8 flex flex-col items-center justify-center text-center">
                <h2 className="text-2xl font-bold mb-6">스톱워치</h2>

                <div className="text-6xl font-mono font-bold tracking-wider mb-8 gradient-text">
                    {formatTime(time)}
                </div>

                <div className="w-full mb-8">
                    <label className="block text-left text-sm text-text-muted mb-2">과목 선택</label>
                    <div className="flex gap-2 overflow-x-auto pb-2">
                        {subjects.map(sub => (
                            <button
                                key={sub.id}
                                onClick={() => setSelectedSubject(sub.id)}
                                className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap transition-all border ${selectedSubject === sub.id
                                        ? 'bg-accent-primary border-accent-primary text-white'
                                        : 'bg-transparent border-glass-border hover:bg-white/10'
                                    }`}
                            >
                                {sub.name}
                            </button>
                        ))}
                    </div>
                </div>

                <div className="flex gap-4">
                    <button
                        onClick={() => setIsTimerRunning(!isTimerRunning)}
                        className={`flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-lg transition-all ${isTimerRunning ? 'bg-red-500/20 text-red-300 hover:bg-red-500/30' : 'bg-green-500/20 text-green-300 hover:bg-green-500/30'
                            }`}
                    >
                        {isTimerRunning ? <><Pause /> 일시정지</> : <><Play /> 시작</>}
                    </button>

                    <button
                        onClick={handleSave}
                        disabled={time === 0}
                        className="flex items-center gap-2 px-8 py-3 rounded-xl font-bold text-lg bg-blue-500/20 text-blue-300 hover:bg-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <Save /> 저장
                    </button>
                </div>
            </div>

            {/* Tasks Section */}
            <div className="glass-panel p-6 overflow-y-auto max-h-[600px]">
                <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
                    <div className="w-3 h-3 rounded-full" style={{ background: currentSubjectObj?.color }}></div>
                    {currentSubjectObj?.name} 할 일
                </h2>

                <div className="space-y-3">
                    {tasks.filter(t => currentSubjectObj?.tasks.find(st => st.id === t.id) || currentSubjectObj?.id === 'all').map(task => ( // Logic simplification: tasks passed here should probably be filtered already or we find them. 
                        // Better logic: iterate over the subject's tasks from the main data source
                        currentSubjectObj?.tasks.map(taskRef => {
                            // We need the actual task object with updated status if it's managed centrally. 
                            // For MVP, we will assume 'tasks' prop IS the list of all tasks or we use the local subject list but we need to update global state.
                            // Let's rely on the passed 'tasks' prop being the master list or just render from currentSubjectObj for now, but we need to know if it's checked.
                            // Re-find the task in the passed 'tasks' prop to get current status if accessible, else use local.
                            // Actually, for MVP: Let's simple filter "tasks" prop which should optionally include subjectId? 
                            // initialData structure nests tasks in subjects. We should probably flatten them or just iterate subjects.
                            return (
                                <div key={taskRef.id} className="flex items-start gap-3 p-3 rounded-lg hover:bg-white/5 cursor-pointer transition-colors" onClick={() => onToggleTask(currentSubjectObj.id, taskRef.id)}>
                                    {taskRef.status === 'completed'
                                        ? <CheckCircle className="text-accent-tertiary mt-1 shrink-0" size={20} />
                                        : <Circle className="text-text-muted mt-1 shrink-0" size={20} />
                                    }
                                    <div>
                                        <div className={`font-medium ${taskRef.status === 'completed' ? 'text-text-muted line-through' : 'text-text-primary'}`}>
                                            {taskRef.title}
                                        </div>
                                        {taskRef.note && <div className="text-xs text-text-muted mt-1">{taskRef.note}</div>}
                                    </div>
                                </div>
                            )
                        })
                    ))}
                </div>
            </div>
        </div>
    );
}
