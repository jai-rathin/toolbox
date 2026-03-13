import type { ComponentType } from "react"

export type ToolSlug = string

export type ToolCategory = {
  name: string
  slug: string
  href: string
}

export type ToolDefinition = {
  slug: ToolSlug
  title: string
  description: string
  category: ToolCategory
  Component: ComponentType
}

