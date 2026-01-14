import { useState, useEffect } from 'react';
import {
    collection,
    query,
    onSnapshot,
    doc,
    setDoc,
    orderBy
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '../services/firebase';

export function useFirebase() {
    const [user, setUser] = useState(null);
    const [sessions, setSessions] = useState([]);
    const [events, setEvents] = useState({});
    const [memo, setMemo] = useState('');
    const [loading, setLoading] = useState(true);

    // Auth
    useEffect(() => {
        const unsubscribeAuth = auth.onAuthStateChanged(async (u) => {
            if (u) {
                setUser(u);
            } else {
                await signInAnonymously(auth);
            }
        });
        return () => unsubscribeAuth();
    }, []);

    // Real-time Data Sync
    useEffect(() => {
        if (!user) return;

        // Load Sessions (study records) - stored by date
        const unsubSessions = onSnapshot(doc(db, 'data', 'sessions'), (docSnap) => {
            if (docSnap.exists()) {
                const data = docSnap.data();
                // Convert object to array format
                const sessionArray = Object.entries(data).map(([date, studyData]) => ({
                    date,
                    data: studyData
                }));
                setSessions(sessionArray);
            }
            setLoading(false);
        });

        // Load Calendar Events
        const unsubEvents = onSnapshot(doc(db, 'data', 'events'), (docSnap) => {
            if (docSnap.exists()) {
                setEvents(docSnap.data() || {});
            }
        });

        // Load Memo
        const unsubMemo = onSnapshot(doc(db, 'data', 'memo'), (docSnap) => {
            if (docSnap.exists()) {
                setMemo(docSnap.data().content || '');
            }
        });

        return () => {
            unsubSessions();
            unsubEvents();
            unsubMemo();
        };
    }, [user]);

    const saveStudyRecord = async (date, data) => {
        // Get existing sessions and merge
        const existingSessions = {};
        sessions.forEach(s => {
            existingSessions[s.date] = s.data;
        });

        await setDoc(doc(db, 'data', 'sessions'), {
            ...existingSessions,
            [date]: data
        });
    };

    const saveEvent = async (dateKey, content) => {
        await setDoc(doc(db, 'data', 'events'), {
            ...events,
            [dateKey]: content
        }, { merge: true });
    };

    const saveMemo = async (content) => {
        await setDoc(doc(db, 'data', 'memo'), { content });
    };

    // Get data for a specific date
    const getDataForDate = (date) => {
        const session = sessions.find(s => s.date === date);
        return session?.data || {};
    };

    const getTodayTotal = () => {
        const today = new Date().toISOString().split('T')[0];
        const todayData = getDataForDate(today);
        return Object.values(todayData).reduce((a, b) => a + b, 0);
    };

    return {
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
    };
}
