import React, { useState, useEffect } from 'react';
import { Save, FileText } from 'lucide-react';

export default function MemoSection({ defaultMemo, savedMemo, onSave }) {
    const [memo, setMemo] = useState(savedMemo || defaultMemo || '');
    const [isSaving, setIsSaving] = useState(false);

    useEffect(() => {
        if (savedMemo) {
            setMemo(savedMemo);
        }
    }, [savedMemo]);

    const handleSave = async () => {
        setIsSaving(true);
        await onSave(memo);
        setIsSaving(false);
        alert('메모가 저장되었습니다!');
    };

    return (
        <div className="animate-in">
            <div className="glass-panel p-6">
                <div className="flex justify-between items-center mb-4">
                    <div className="flex items-center gap-2">
                        <FileText className="text-accent-secondary" size={20} />
                        <h2>자유 메모</h2>
                    </div>
                    <button
                        onClick={handleSave}
                        disabled={isSaving}
                        className="btn btn-primary flex items-center gap-2"
                    >
                        <Save size={16} />
                        {isSaving ? '저장중...' : '저장'}
                    </button>
                </div>

                <textarea
                    className="memo-textarea"
                    value={memo}
                    onChange={(e) => setMemo(e.target.value)}
                    placeholder="자유롭게 메모하세요..."
                />

                <p className="text-text-muted text-xs mt-2">
                    * 마크다운 형식으로 작성하면 더 보기 좋습니다
                </p>
            </div>
        </div>
    );
}
