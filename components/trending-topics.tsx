import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { TrendingUp, Hash } from "lucide-react"

interface TrendingTopic {
  word: string
  count: number
  change: "up" | "down" | "stable"
}

interface TrendingTopicsProps {
  topics?: TrendingTopic[]
}

const defaultTopics = [
  { word: "Başkanı", count: 156 },
  { word: "Özel", count: 142 },
  { word: "İstanbul", count: 128 },
  { word: "Gözaltına", count: 115 },
  { word: "Uyuşturucu", count: 98 },
  { word: "Yargı", count: 87 },
  { word: "Asgari", count: 76 },
  { word: "Özgür", count: 65 },
  { word: "Fenerbahçe", count: 54 },
  { word: "Sadettin", count: 48 },
]

export default function TrendingTopics({ topics }: TrendingTopicsProps) {
  const displayTopics = topics && topics.length > 0 ? topics : defaultTopics

  return (
    <Card className="sticky top-24">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <TrendingUp className="h-5 w-5 text-primary" />
          Trend Konular
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {displayTopics.map((topic, index) => (
          <div
            key={topic.word}
            className="flex items-center justify-between p-3 rounded-lg hover:bg-secondary/50 transition-colors cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <span className="text-sm font-bold text-muted-foreground w-6">{index + 1}</span>
              <div className="flex items-center gap-2">
                <Hash className="h-4 w-4 text-primary" />
                <span className="font-medium group-hover:text-primary transition-colors">{topic.word}</span>
              </div>
            </div>
            <Badge variant="secondary" className="text-xs">
              {topic.count}
            </Badge>
          </div>
        ))}
      </CardContent>
    </Card>
  )
}
