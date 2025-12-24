import { cn } from "@/lib/utils"

interface CategoryBadgeProps {
  category: string
  size?: "sm" | "md"
}

const categoryColors: Record<string, { bg: string; text: string; border: string }> = {
  ekonomi: { bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
  siyaset: { bg: "bg-blue-50", text: "text-blue-700", border: "border-blue-200" },
  spor: { bg: "bg-orange-50", text: "text-orange-700", border: "border-orange-200" },
  teknoloji: { bg: "bg-purple-50", text: "text-purple-700", border: "border-purple-200" },
  saglik: { bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
  egitim: { bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  kultur: { bg: "bg-pink-50", text: "text-pink-700", border: "border-pink-200" },
  dunya: { bg: "bg-cyan-50", text: "text-cyan-700", border: "border-cyan-200" },
  default: { bg: "bg-gray-50", text: "text-gray-700", border: "border-gray-200" },
}

export default function CategoryBadge({ category, size = "sm" }: CategoryBadgeProps) {
  const lowerCategory = category.toLowerCase()
  const colors = categoryColors[lowerCategory] || categoryColors.default

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border font-medium",
        colors.bg,
        colors.text,
        colors.border,
        size === "sm" ? "px-2.5 py-0.5 text-xs" : "px-3 py-1 text-sm",
      )}
    >
      {category}
    </span>
  )
}
