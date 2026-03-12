"use client"

import { useState, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { Textarea } from "@/components/ui/textarea"
import { ArrowLeft, BookOpen, Plus, Save, Trash2 } from "lucide-react"
import Link from "next/link"
import { toast } from "sonner"
import { useLanguage } from "@/context/LanguageContext"

interface JournalEntry {
    id: string
    content: string
    date: string
}

export default function JournalPage() {
    const [entries, setEntries] = useState<JournalEntry[]>([])
    const [isWriting, setIsWriting] = useState(false)
    const [newEntry, setNewEntry] = useState("")
    const { t } = useLanguage()

    useEffect(() => {
        // Load entries
        const saved = localStorage.getItem("offline-journal-entries")
        if (saved) {
            try {
                setEntries(JSON.parse(saved))
            } catch (e) {
                console.error("Failed to parse journal entries", e)
            }
        }
    }, [])

    const saveEntry = () => {
        if (!newEntry.trim()) return

        const entry: JournalEntry = {
            id: Date.now().toString(),
            content: newEntry,
            date: new Date().toLocaleDateString(undefined, { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
        }

        const updated = [entry, ...entries]
        setEntries(updated)
        localStorage.setItem("offline-journal-entries", JSON.stringify(updated))

        setNewEntry("")
        setIsWriting(false)
        toast.success(t('save'))
    }

    const deleteEntry = (id: string) => {
        const updated = entries.filter(e => e.id !== id)
        setEntries(updated)
        localStorage.setItem("offline-journal-entries", JSON.stringify(updated))
        toast.success(t('delete'))
    }

    return (
        <div className="p-6 md:p-12 max-w-4xl mx-auto h-full flex flex-col">
            <div className="flex items-center justify-between mb-8">
                <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary">
                    <ArrowLeft className="w-4 h-4 mr-1" /> {t('offline_back_dashboard')}
                </Link>
            </div>

            <div className="flex items-center justify-between mb-8">
                <div>
                    <h1 className="text-3xl font-bold flex items-center gap-2">
                        <BookOpen className="w-8 h-8 text-primary" /> {t('journal_title')}
                    </h1>
                    <p className="text-muted-foreground">{t('journal_desc')}</p>
                </div>
                {!isWriting && (
                    <Button onClick={() => setIsWriting(true)}>
                        <Plus className="w-4 h-4 mr-2" /> {t('journal_new')}
                    </Button>
                )}
            </div>

            {isWriting ? (
                <div className="animate-in slide-in-from-bottom-4 fade-in duration-300">
                    <Card className="p-6 border-2 border-primary/20">
                        <h3 className="text-lg font-semibold mb-4">{t('offline_journal_write')}</h3>
                        <Textarea
                            value={newEntry}
                            onChange={(e) => setNewEntry(e.target.value)}
                            placeholder={t('journal_placeholder')}
                            className="min-h-[200px] text-lg mb-4 resize-none focus-visible:ring-1"
                            autoFocus
                        />
                        <div className="flex justify-end gap-3">
                            <Button variant="ghost" onClick={() => setIsWriting(false)}>{t('cancel')}</Button>
                            <Button onClick={saveEntry} disabled={!newEntry.trim()}>
                                <Save className="w-4 h-4 mr-2" /> {t('journal_save_note')}
                            </Button>
                        </div>
                    </Card>
                </div>
            ) : (
                <div className="grid gap-4 animate-in fade-in duration-500">
                    {entries.length === 0 ? (
                        <div className="text-center py-12 bg-muted/30 rounded-lg">
                            <p className="text-muted-foreground">{t('offline_journal_empty')}</p>
                            <Button variant="link" onClick={() => setIsWriting(true)}>{t('journal_start_writing')}</Button>
                        </div>
                    ) : (
                        entries.map((entry) => (
                            <Card key={entry.id} className="p-6 hover:shadow-sm transition-shadow">
                                <div className="flex justify-between items-start mb-2">
                                    <span className="text-xs font-medium text-muted-foreground bg-muted px-2 py-1 rounded-full">
                                        {entry.date}
                                    </span>
                                    <Button variant="ghost" size="icon" className="h-6 w-6 text-muted-foreground hover:text-destructive" onClick={() => deleteEntry(entry.id)}>
                                        <Trash2 className="w-3 h-3" />
                                    </Button>
                                </div>
                                <p className="whitespace-pre-wrap leading-relaxed">{entry.content}</p>
                            </Card>
                        ))
                    )}
                </div>
            )}
        </div>
    )
}
