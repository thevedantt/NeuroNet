"use client"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ArrowLeft, Lightbulb, Moon, Sun } from "lucide-react"
import Link from "next/link"
import { useLanguage } from "@/context/LanguageContext"

export default function TipsPage() {
    const { t } = useLanguage()

    return (
        <div className="p-6 md:p-12 max-w-4xl mx-auto h-full space-y-8 animate-in fade-in">
            <div>
                <Link href="/dashboard" className="inline-flex items-center text-sm text-muted-foreground hover:text-primary mb-4">
                    <ArrowLeft className="w-4 h-4 mr-1" /> {t('offline_back_dashboard')}
                </Link>
                <h1 className="text-3xl font-bold flex items-center gap-2">
                    <Lightbulb className="w-8 h-8 text-primary" /> {t('offline_tips')}
                </h1>
                <p className="text-muted-foreground">Practical advice for managing difficult moments.</p>
            </div>

            <Tabs defaultValue="stress">
                <TabsList className="grid w-full grid-cols-2 max-w-[400px]">
                    <TabsTrigger value="stress">{t('offline_tips_stress')}</TabsTrigger>
                    <TabsTrigger value="sleep">{t('offline_tips_sleep')}</TabsTrigger>
                </TabsList>

                <TabsContent value="stress" className="space-y-4 py-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Sun className="w-5 h-5 text-orange-500" /> {t('tip_grounding')}</CardTitle>
                            <CardDescription>{t('tip_grounding_desc')}</CardDescription>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2">
                                <li><strong>5</strong> things you can see around you.</li>
                                <li><strong>4</strong> things you can touch or feel.</li>
                                <li><strong>3</strong> things you can hear.</li>
                                <li><strong>2</strong> things you can smell.</li>
                                <li><strong>1</strong> thing you can taste.</li>
                            </ul>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader>
                            <CardTitle>{t('breath_box')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{t('breath_box_desc')}</p>
                        </CardContent>
                    </Card>
                </TabsContent>

                <TabsContent value="sleep" className="space-y-4 py-4">
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2"><Moon className="w-5 h-5 text-blue-500" /> {t('tip_sleep_hygiene')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <ul className="list-disc pl-5 space-y-2">
                                <li>Try to go to sleep at the same time every day.</li>
                                <li>Keep your room dark and cool.</li>
                                <li>Avoid screens (phones/TV) for 30 minutes before bed.</li>
                                <li>Don't drink caffeine in the evening.</li>
                            </ul>
                        </CardContent>
                    </Card>
                    <Card>
                        <CardHeader>
                            <CardTitle>{t('tip_pmr')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p>{t('tip_pmr_desc')}</p>
                        </CardContent>
                    </Card>
                </TabsContent>
            </Tabs>
        </div>
    )
}
