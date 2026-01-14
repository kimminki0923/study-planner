import { useState, useEffect } from 'react';
import {
    collection,
    query,
    onSnapshot,
    doc,
    setDoc,
    addDoc,
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

        // Load Sessions (study records)
        const qSessions = query(collection(db, 'sessions'), orderBy('date', 'desc'));
        const unsubSessions = onSnapshot(qSessions, (snapshot) => {
            const remoteSessions = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setSessions(remoteSessions);
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

    const saveStudyRecord = async (data) => {
        const today = new Date().toISOString().split('T')[0];
        await addDoc(collection(db, 'sessions'), {
            date: today,
            data: data,
            timestamp: new Date()
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

    // Get today's study data
    const getTodayData = () => {
        const today = new Date().toISOString().split('T')[0];
        const todaySession = sessions.find(s => s.date === today);
        return todaySession?.data || {};
    };

    const getTodayTotal = () => {
        const todayData = getTodayData();
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
        getTodayData,
        getTodayTotal
    };
}
