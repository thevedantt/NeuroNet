import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Bot, FileText, Users, CalendarPlus } from "lucide-react"
import Link from "next/link"

import { useLanguage } from "@/context/LanguageContext"

export function QuickActions() {
    const { t } = useLanguage()

    const actions = [
        { label: t("qa_ai_companion"), icon: Bot, variant: "default" as const, href: "/chat-ai" },
        { label: t("qa_assessment"), icon: FileText, variant: "outline" as const, href: "/assessment" },
        { label: t("qa_join_group"), icon: Users, variant: "outline" as const, href: "/groups" },
        { label: t("qa_book_therapist"), icon: CalendarPlus, variant: "outline" as const, href: "/appointments" },
    ]

    return (
        <Card className="col-span-1 md:col-span-1 lg:col-span-1 shadow-md border-none h-full">
            <CardHeader>
                <CardTitle>{t("qa_title")}</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-2 gap-4">
                {actions.map((action) => (
                    <Button
                        key={action.label}
                        variant={action.variant}
                        className="h-auto min-h-[6rem] flex flex-col gap-2 shadow-sm hover:shadow-md transition-all rounded-xl whitespace-normal text-center p-2"
                        asChild
                    >
                        <Link href={action.href}>
                            <action.icon className="h-6 w-6 shrink-0" />
                            <span className="text-xs font-medium leading-tight">{action.label}</span>
                        </Link>
                    </Button>
                ))}
            </CardContent>
        </Card>
    )
}
