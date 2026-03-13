"use client"

import { ToolCard } from "@/components/tool-card"
import { Type, Code, Sparkles, Hash, FileText, ImageIcon } from "lucide-react"

function getCategoryIcon(name: string) {
  if (name.includes("Text")) return Type
  if (name.includes("Developer") || name.includes("Security")) return Code
  if (name.includes("Image") || name.includes("Design")) return ImageIcon
  if (name.includes("PDF")) return FileText
  if (name.includes("Media")) return Hash
  return Sparkles
}

function getCategoryColor(name: string) {
  if (name.includes("Developer") || name.includes("Security")) return "from-sky-500 to-teal-500"
  if (name.includes("Media")) return "from-purple-500 to-pink-500"
  if (name.includes("PDF")) return "from-teal-500 to-emerald-500"
  if (name.includes("Image") || name.includes("Design")) return "from-pink-500 to-rose-600"
  if (name.includes("Text")) return "from-teal-500 to-cyan-500"
  return "from-teal-400 to-cyan-400"
}

export function CategoryToolsGrid({ tools }: { tools: any[] }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {tools.map((tool) => {
        const Icon = getCategoryIcon(tool.category.name)
        const color = getCategoryColor(tool.category.name)
        return (
          <ToolCard
            key={tool.slug}
            name={tool.title}
            description={tool.description}
            href={`/tools/${tool.slug}`}
            icon={Icon}
            color={color}
          />
        )
      })}
    </div>
  )
}
