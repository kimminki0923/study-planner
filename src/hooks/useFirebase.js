import { useState, useEffect } from 'react';
import {
    collection,
    doc,
    setDoc,
    onSnapshot
} from 'firebase/firestore';
import {
    signInWithPopup,
    GoogleAuthProvider,
    signOut
} from 'firebase/auth';
import { db, auth } from '../services/firebase';

const googleProvider = new GoogleAuthProvider();

export function useFirebase() {
    const [user, setUser] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [events, setEvents] = useState({});
    const [memo, setMemo] = useState('');
    const [loading, setLoading] = useState(true);
    const [authLoading, setAuthLoading] = useState(true);

    // Auth state listener
    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged((u) => {
            setUser(u);
            setAuthLoading(false);
            if (!u) {
                // Clear data when logged out
                setSessions([]);
                setEvents({});
                setMemo('');
                setLoading(false);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    // Real-time Data Sync - User specific
    useEffect(() => {
        if (!user) return;

        setLoading(true);
        const userPath = `users/${user.uid}`;

        // Load Sessions (study records)
        const unsubSessions = onSnapshot(doc(db, userPath, 'sessions'), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                const sessionArray = Object.entries(data).map(([date, studyData]) => ({
                    date,
                    data: studyData
                }));
                setSessions(sessionArray);
            } else {
                setSessions([]);
            }
            setLoading(false);
        });

        // Load Calendar Events
        const unsubEvents = onSnapshot(doc(db, userPath, 'events'), (docSnap) => {
            if (docSnap.exists()) {
                setEvents(docSnap.data() || {});
            } else {
                setEvents({});
            }
        });

        // Load Memo
        const unsubMemo = onSnapshot(doc(db, userPath, 'memo'), (docSnap) => {
            if (docSnap.exists()) {
                setMemo(docSnap.data().content || '');
            } else {
                setMemo('');
            }
        });

        return () => {
            unsubSessions();
            unsubEvents();
            unsubMemo();
        };
    }, [user]);

    // Google Login
    const loginWithGoogle = async () => {
        try {
            await signInWithPopup(auth, googleProvider);
        } catch (error) {
            console.error('Login error:', error);
            alert('로그인 실패: ' + error.message);
        }
    };

    // Logout
    const logout = async () => {
        try {
            await signOut(auth);
        } catch (error) {
            console.error('Logout error:', error);
        }
    };

    // Save functions - now user specific
    const saveStudyRecord = async (date, data) => {
        if (!user) return;
        const existingSessions = {};
        sessions.forEach(s => {
            existingSessions[s.date] = s.data;
        });

        await setDoc(doc(db, `users/${user.uid}`, 'sessions'), {
            ...existingSessions,
            [date]: data
        });
    };

    const saveEvent = async (dateKey, content) => {
        if (!user) return;
        await setDoc(doc(db, `users/${user.uid}`, 'events'), {
            ...events,
            [dateKey]: content
        }, { merge: true });
    };

    const saveMemo = async (content) => {
        if (!user) return;
        await setDoc(doc(db, `users/${user.uid}`, 'memo'), { content });
    };

    const getDataForDate = (date) => {
        const session = sessions.find(s => s.date === date);
        return session?.data || {};
    };

    const getTodayTotal = () => {
        const today = new Date().toISOString().split('T')[0];
        const todayData = getDataForDate(today);
        return Object.values(todayData).reduce((a, b) => a + (Number(b) || 0), 0);
    };

    return {
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
        getTodayTotal
    };
}
