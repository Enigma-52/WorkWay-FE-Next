import type { Metadata } from "next"
import dynamic from "next/dynamic"
import { buildPageMetadata } from "@/lib/seo/metadata"

const ChatUI = dynamic(() => import("@/components/Chat/ChatUI"), { ssr: false })

export const metadata: Metadata = buildPageMetadata({
  title: "AI Job Assistant | WorkWay",
  description:
    "Search jobs conversationally using WorkWay AI. Ask for roles, companies, locations, and get structured results instantly.",
  path: "/chat",
})

export default async function ChatPage() {
  return (
    <div className="flex h-full min-h-0 flex-col bg-background">
      {/* Compact header — design system: section title + muted subtitle */}
      

      {/* Full-height chat — fills remaining space */}
      <div className="py-6 mx-auto w-full max-w-3xl flex-1 min-h-0 px-4">
        <ChatUI />
      </div>
    </div>
  )
}
