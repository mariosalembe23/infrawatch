"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/dashboard/components/dialog"
import { Button } from "@/components/ui/button"
import { ClipboardClock } from "lucide-react"

interface LogsDialogProps {
  title: string
  children: React.ReactNode
  triggerText?: string
}

export default function LogsDialog({ title, children, triggerText = "Logs" }: LogsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <button className="px-3 gap-2 border border-zinc-900 transition-all hover:bg-zinc-900 cursor-pointer py-[0.19rem] flex items-center bg-black text-white rounded-md">
            Logs <ClipboardClock size={16} />
          </button>
      </DialogTrigger>
      <DialogContent className="max-w-4xl bg-zinc-950 border-zinc-900 text-white">
        <DialogHeader >
          <DialogTitle className="text-white">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}