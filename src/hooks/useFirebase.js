import { useState, useEffect } from 'react';
import {
    collection,
    query,
    onSnapshot,
    doc,
    setDoc,
    updateDoc,
    addDoc
} from 'firebase/firestore';
import { signInAnonymously } from 'firebase/auth';
import { db, auth } from '../services/firebase';
import { initialStudyData } from '../data/initialData';

export function useFirebase() {
    const [user, setUser] = useState(null);
    const [tasks, setTasks] = useState([]);
    const [sessions, setSessions] = useState([]);
    const [loading, setLoading] = useState(true);

    // 1. Auth & Initial Load
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

    // 2. Real-time Data Sync (Only after login)
    useEffect(() => {
        if (!user) return;

        // Load Tasks
        const qTasks = query(collection(db, 'tasks'));
        const unsubTasks = onSnapshot(qTasks, (snapshot) => {
            if (snapshot.empty) {
                // Initialize DB with local data if empty
                initializeTasks();
            } else {
                const remoteTasks = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
                setTasks(remoteTasks);
            }
            setLoading(false);
        });

        // Load Sessions
        const qSessions = query(collection(db, 'sessions'));
        const unsubSessions = onSnapshot(qSessions, (snapshot) => {
            const remoteSessions = snapshot.docs.map(d => ({ id: d.id, ...d.data() }));
            setSessions(remoteSessions);
        });

        return () => {
            unsubTasks();
            unsubSessions();
        };
    }, [user]);

    const initializeTasks = async () => {
        // Flatten initialData logic
        console.log("Initializing Database with default tasks...");
        initialStudyData.subjects.forEach(sub => {
            sub.tasks.forEach(async (task) => {
                // Use custom ID to prevent duplicates easily or let Firestore auto-gen?
                // Let's use auto-gen for simplicity but store original ID for reference if needed
                // Actually, we want persistence. Let's rely on mapping.
                await addDoc(collection(db, 'tasks'), {
                    ...task,
                    subjectId: sub.id,
                    color: sub.color,
                    createdAt: new Date()
                });
            });
        });
    };

    const toggleTask = async (taskId, currentStatus) => {
        const taskRef = doc(db, 'tasks', taskId);
        await updateDoc(taskRef, {
            status: currentStatus === 'completed' ? 'todo' : 'completed'
        });
    };

    const saveSession = async (sessionData) => {
        await addDoc(collection(db, 'sessions'), {
            ...sessionData,
            timestamp: new Date()
        });
    };

    return {
        user,
        tasks,
        sessions,
        loading,
        toggleTask,
        saveSession
    };
}
