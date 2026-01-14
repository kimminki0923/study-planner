import React, { useState } from 'react';
import { Home, Calendar, Clock, BarChart2, BookOpen, Loader } from 'lucide-react';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import StudyTracker from './components/StudyTracker';
import { initialStudyData } from './data/initialData';
import { useFirebase } from './hooks/useFirebase';

function App() {
  const [currentView, setCurrentView] = useState('dashboard');

  // Use Firebase Hook instead of Local State
  const { user, tasks, sessions, loading, toggleTask, saveSession } = useFirebase();

  const handleSaveSession = (session) => {
    saveSession(session);
  };

  const handleToggleTask = (subjectId, taskId) => {
    // Current task status logic needs to be passed or handled
    // The hook 'toggleTask' expects (taskId, currentStatus)
    // We find the task in the live 'tasks' list
    const task = tasks.find(t => t.id === taskId);
    if (task) {
      toggleTask(taskId, task.status);
    }
  };

  const renderView = () => {
    if (loading) {
      return (
        <div className="flex h-64 items-center justify-center">
          <Loader className="animate-spin text-accent-primary" size={48} />
          <span className="ml-4 text-xl font-bold">데이터 불러오는 중...</span>
        </div>
      );
    }

    switch (currentView) {
      case 'dashboard':
        return <Dashboard user={initialStudyData.user} onNavigate={setCurrentView} />;
      case 'calendar':
        return <CalendarView tasks={tasks} />;
      case 'tracker':
        return <StudyTracker
          subjects={initialStudyData.subjects}
          onSaveSession={handleSaveSession}
          tasks={tasks}
          onToggleTask={handleToggleTask}
        />;
      default:
        return <Dashboard user={initialStudyData.user} onNavigate={setCurrentView} />;
    }
  };

  return (
    <div className="min-h-screen text-text-primary pb-20 md:pb-0">
      {/* Navigation Bar - Mobile Bottom / Desktop Side (Simplified to Top/Bottom for now) */}
      <nav className="fixed bottom-0 left-0 right-0 glass-panel rounded-none border-x-0 border-b-0 p-4 z-50 md:top-0 md:bottom-auto md:border-b md:rounded-none">
        <div className="container mx-auto flex justify-between items-center">
          <div className="hidden md:block font-black text-xl tracking-tighter cursor-pointer" onClick={() => setCurrentView('dashboard')}>
            Study<span className="text-accent-primary">08</span>
          </div>

          <div className="flex gap-8 mx-auto md:mx-0">
            <button onClick={() => setCurrentView('dashboard')} className={`flex flex-col items-center gap-1 ${currentView === 'dashboard' ? 'text-accent-primary' : 'text-text-muted'}`}>
              <Home size={24} />
              <span className="text-[10px] uppercase font-bold">Home</span>
            </button>
            <button onClick={() => setCurrentView('calendar')} className={`flex flex-col items-center gap-1 ${currentView === 'calendar' ? 'text-accent-primary' : 'text-text-muted'}`}>
              <Calendar size={24} />
              <span className="text-[10px] uppercase font-bold">Plan</span>
            </button>
            <button onClick={() => setCurrentView('tracker')} className={`flex flex-col items-center gap-1 ${currentView === 'tracker' ? 'text-accent-primary' : 'text-text-muted'}`}>
              <Clock size={24} />
              <span className="text-[10px] uppercase font-bold">Focus</span>
            </button>
            <button onClick={() => alert('통계 기능 준비중')} className={`flex flex-col items-center gap-1 ${currentView === 'stats' ? 'text-accent-primary' : 'text-text-muted'}`}>
              <BarChart2 size={24} />
              <span className="text-[10px] uppercase font-bold">Stats</span>
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container mx-auto p-4 pt-6 md:pt-24 animate-fade-in">
        <header className="mb-8 flex justify-between items-end">
          <div>
            <h2 className="text-sm text-accent-secondary font-bold mb-1">TEAM 08 PROJECT</h2>
            <h1 className="text-3xl font-bold">
              {currentView === 'dashboard' && '대시보드'}
              {currentView === 'calendar' && '월간 계획'}
              {currentView === 'tracker' && '공부하기'}
            </h1>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-sm text-text-muted">{new Date().toLocaleDateString()}</div>
            <div className="text-xs text-accent-tertiary">
              {user ? '● 동기화 됨' : '○ 오프라인'}
            </div>
          </div>
        </header>

        {renderView()}
      </main>
    </div>
  );
}

export default App;
