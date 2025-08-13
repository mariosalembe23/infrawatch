"use client"

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/app/dashboard/components/dialog"
import { Eye } from "lucide-react"

interface DetailsDialogProps {
  title: string
  children: React.ReactNode
  triggerText?: string
}

export default function DetailsDialog({ title, children, triggerText = "Detalhes" }: DetailsDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
         <button className="px-3 gap-2 border border-zinc-900 transition-all hover:bg-zinc-900 cursor-pointer py-[0.19rem] flex items-center bg-black text-white rounded-md">
            Detalhes <Eye size={16} />
          </button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl bg-black">
        <DialogHeader>
          <DialogTitle className="text-white">{title}</DialogTitle>
        </DialogHeader>
        <div className="mt-4">
          {children}
        </div>
      </DialogContent>
    </Dialog>
  )
}