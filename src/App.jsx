import React, { useState } from 'react';
// Version: 2.0.1 - Google Login with user-specific data
import { Home, Calendar, Edit3, BarChart2, FileText, Loader, LogOut, Bot } from 'lucide-react';
import Dashboard from './components/Dashboard';
import CalendarView from './components/CalendarView';
import StudyInput from './components/StudyInput';
import Statistics from './components/Statistics';
import MemoSection from './components/MemoSection';
import LoginScreen from './components/LoginScreen';
import { initialStudyData } from './data/initialData';
import AICoach from './components/AICoach';
import { useFirebase } from './hooks/useFirebase';

function App() {
  const [currentView, setCurrentView] = useState('home');
  const {
    user,
    sessions,
    events,
    memo,
    loading,
    authLoading,
    loginWithGoogle,
    logout,
    saveStudyRecord,
    saveEvent,
    saveMemo,
    getDataForDate,
    getTodayTotal,
    migrateData
  } = useFirebase();

  const [migrationUid, setMigrationUid] = useState(localStorage.getItem('migration_uid'));

  const handleMigration = async () => {
    if (window.confirm('이전 익명 계정의 데이터를 현재 구글 계정으로 복구하시겠습니까?')) {
      const success = await migrateData(migrationUid);
      if (success) {
        alert('데이터 복구가 완료되었습니다!');
        localStorage.removeItem('migration_uid');
        setMigrationUid(null);
        window.location.reload();
      } else {
        alert('이전 데이터를 찾을 수 없습니다.');
      }
    }
  };

  // Show loading while checking auth state
  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Loader className="animate-spin text-accent-primary" size={32} />
      </div>
    );
  }

  // Show login screen if not logged in or anonymous
  if (!user || user.isAnonymous) {
    // Save anonymous UID if present for migration
    if (user?.isAnonymous) {
      console.log('Found anonymous user:', user.uid);
      localStorage.setItem('migration_uid', user.uid);
    }
    return <LoginScreen onLogin={loginWithGoogle} />;
  }

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
      case 'ai-coach':
        return (
          <AICoach
            sessions={sessions}
            subjects={initialStudyData.subjects}
            user={initialStudyData.user}
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
          <button
            onClick={() => setCurrentView('ai-coach')}
            className={`nav-item ${currentView === 'ai-coach' ? 'active' : ''}`}
          >
            <Bot size={20} />
            <span>AI 코치</span>
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
              {currentView === 'ai-coach' && 'AI 학습 코치'}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <div className="text-right text-xs">
              <div className="text-text-muted">{user.displayName || user.email}</div>
              <div className="text-accent-tertiary">● 연결됨</div>
            </div>
            <button
              onClick={logout}
              className="btn btn-ghost p-2"
              title="로그아웃"
            >
              <LogOut size={18} />
            </button>
          </div>
        </header>

        {renderView()}
      </main>
    </div>
  );
}

export default App;
