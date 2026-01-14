import React, { useState } from 'react';
import { Home, Calendar, Edit3, BarChart2, FileText, Loader } from 'lucide-react';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import StudyInput from './components/StudyInput';
import Statistics from './components/Statistics';
import MemoSection from './components/MemoSection';
import { initialStudyData } from './data/initialData';
import { useFirebase } from './hooks/useFirebase';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const {
    user,
    sessions,
    events,
    memo,
    loading,
    saveStudyRecord,
    saveEvent,
    saveMemo,
    getDataForDate,
    getTodayTotal
  } = useFirebase();

  const renderView = () => {
    if (loading) {
      return (
        <div className="flex flex-col items-center justify-center h-64 gap-4">
          <Loader className="animate-spin text-accent-primary" size={32} />
          <span className="text-text-muted">데이터 불러오는 중...</span>
        </div>
      );
    }

    switch (currentView) {
      case 'home':
        return (
          <Dashboard
            user={initialStudyData.user}
            subjects={initialStudyData.subjects}
            sessions={sessions}
            todayTotal={getTodayTotal()}
            onNavigate={setCurrentView}
          />
        );
      case 'calendar':
        return (
          <CalendarView
            events={events}
            onAddEvent={saveEvent}
          />
        );
      case 'input':
        return (
          <StudyInput
            subjects={initialStudyData.subjects}
            getDataForDate={getDataForDate}
            onSave={saveStudyRecord}
          />
        );
      case 'stats':
        return (
          <Statistics
            subjects={initialStudyData.subjects}
            sessions={sessions}
          />
        );
      case 'memo':
        return (
          <MemoSection
            defaultMemo={initialStudyData.defaultMemo}
            savedMemo={memo}
            onSave={saveMemo}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen pb-20 md:pb-0">
      {/* Navigation */}
      <nav className="nav">
        <div className="container flex justify-around items-center">
          <button
            onClick={() => setCurrentView('home')}
            className={`nav-item ${currentView === 'home' ? 'active' : ''}`}
          >
            <Home size={20} />
            <span>홈</span>
          </button>
          <button
            onClick={() => setCurrentView('input')}
            className={`nav-item ${currentView === 'input' ? 'active' : ''}`}
          >
            <Edit3 size={20} />
            <span>기록</span>
          </button>
          <button
            onClick={() => setCurrentView('calendar')}
            className={`nav-item ${currentView === 'calendar' ? 'active' : ''}`}
          >
            <Calendar size={20} />
            <span>계획</span>
          </button>
          <button
            onClick={() => setCurrentView('stats')}
            className={`nav-item ${currentView === 'stats' ? 'active' : ''}`}
          >
            <BarChart2 size={20} />
            <span>통계</span>
          </button>
          <button
            onClick={() => setCurrentView('memo')}
            className={`nav-item ${currentView === 'memo' ? 'active' : ''}`}
          >
            <FileText size={20} />
            <span>메모</span>
          </button>
        </div>
      </nav>

      {/* Main Content */}
      <main className="container">
        <header className="flex justify-between items-center mb-4 pt-2">
          <div>
            <p className="text-xs text-accent-secondary font-semibold">TEAM 08</p>
            <h1 className="text-lg font-bold">
              {currentView === 'home' && '대시보드'}
              {currentView === 'calendar' && '월간 계획'}
              {currentView === 'input' && '공부 기록'}
              {currentView === 'stats' && '통계'}
              {currentView === 'memo' && '자유 메모'}
            </h1>
          </div>
          <div className="text-right text-xs text-text-muted">
            <div>{new Date().toLocaleDateString('ko-KR')}</div>
            <div className={user ? 'text-accent-tertiary' : 'text-text-muted'}>
              {user ? '● 연결됨' : '○ 오프라인'}
            </div>
          </div>
        </header>

        {renderView()}
      </main>
    </div>
  );
}

export default App;
