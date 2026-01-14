import { useState, useEffect } from 'react';
import {
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

    // Auth state listener with timeout fallback
    useEffect(() => {
        let timeoutId;

        timeoutId = setTimeout(() => {
            console.log('Auth timeout - showing login screen');
            setAuthLoading(false);
            setLoading(false);
        }, 3000);

        const unsubscribeAuth = auth.onAuthStateChanged((u) => {
            console.log('Auth state changed:', u ? u.email : 'null');
            clearTimeout(timeoutId);
            setUser(u);
            setAuthLoading(false);
            if (!u) {
                setSessions([]);
                setEvents({});
                setMemo('');
                setLoading(false);
            }
        });

        return () => {
            clearTimeout(timeoutId);
            unsubscribeAuth();
        };
    }, []);

    // Real-time Data Sync - User specific
    // Fixed: Using proper document paths (even number of segments)
    useEffect(() => {
        if (!user) return;

        setLoading(true);

        // Path: users/{uid} - this is a document
        const userDocRef = doc(db, 'users', user.uid);

        const unsubscribe = onSnapshot(userDocRef, (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();

                // Parse sessions from stored object
                if (data.sessions) {
                    const sessionArray = Object.entries(data.sessions).map(([date, studyData]) => ({
                        date,
                        data: studyData
                    }));
                    setSessions(sessionArray);
                } else {
                    setSessions([]);
                }

                // Parse events
                setEvents(data.events || {});

                // Parse memo
                setMemo(data.memo || '');
            } else {
                setSessions([]);
                setEvents({});
                setMemo('');
            }
            setLoading(false);
        }, (error) => {
            console.error('Data error:', error);
            setLoading(false);
        });

        return () => unsubscribe();
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

    // Save study record - stores in users/{uid} document
    const saveStudyRecord = async (date, data) => {
        if (!user) return;

        const existingSessions = {};
        sessions.forEach(s => {
            existingSessions[s.date] = s.data;
        });

        await setDoc(doc(db, 'users', user.uid), {
            sessions: {
                ...existingSessions,
                [date]: data
            },
            events,
            memo
        }, { merge: true });
    };

    // Save calendar event
    const saveEvent = async (dateKey, content) => {
        if (!user) return;
        await setDoc(doc(db, 'users', user.uid), {
            events: {
                ...events,
                [dateKey]: content
            }
        }, { merge: true });
    };

    // Save memo
    const saveMemo = async (content) => {
        if (!user) return;
        await setDoc(doc(db, 'users', user.uid), {
            memo: content
        }, { merge: true });
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
