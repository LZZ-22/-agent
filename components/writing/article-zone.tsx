"use client";

import type { Article } from "@/lib/types";
import { ParagraphBlock } from "./paragraph-block";
import { FileText, Loader2, Download } from "lucide-react";
import { Button } from "@/components/ui/button";

interface ArticleZoneProps {
  article: Article | null;
  selectedId: string | null;
  onSelectParagraph: (id: string) => void;
  onUndoParagraph?: (id: string) => void;
  generating: boolean;
  onExport?: () => void;
}

export function ArticleZone({
  article,
  selectedId,
  onSelectParagraph,
  onUndoParagraph,
  generating,
  onExport,
}: ArticleZoneProps) {
  // 空状态
  if (!article && !generating) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[var(--color-muted-foreground)] p-8">
        <FileText className="h-12 w-12 mb-4 opacity-20" />
        <p className="text-sm font-medium mb-1">文章区</p>
        <p className="text-xs text-center max-w-xs">
          在左侧对话框中描述你的写作需求，生成的文章将展示在这里
        </p>
      </div>
    );
  }

  // 生成中
  if (generating && !article) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-[var(--color-muted-foreground)] p-8">
        <Loader2 className="h-8 w-8 mb-3 animate-spin text-[var(--color-primary)]" />
        <p className="text-sm">正在生成文章...</p>
      </div>
    );
  }

  if (!article) return null;

  return (
    <div className="flex flex-col h-full">
      {/* 文章标题区 */}
      <div className="px-6 py-4 border-b border-[var(--color-border)] flex-shrink-0 flex items-start justify-between">
        <div>
          <h2 className="text-xl font-bold">{article.title}</h2>
          <div className="flex items-center gap-3 mt-1.5 text-xs text-[var(--color-muted-foreground)]">
            <span>{article.genre}</span>
            <span>·</span>
            <span>{article.paragraphs.length} 段</span>
            <span>·</span>
            <span>{article.paragraphs.reduce((sum, p) => sum + p.content.length, 0)} 字</span>
            <span>·</span>
            <span className="capitalize">{article.status}</span>
          </div>
        </div>
        {onExport && (
          <Button variant="outline" size="sm" onClick={onExport}>
            <Download className="h-3.5 w-3.5" /> 导出
          </Button>
        )}
      </div>

      {/* 段落列表 */}
      <div className="flex-1 overflow-y-auto px-6 py-6 space-y-4">
        {article.paragraphs.map((p) => (
          <ParagraphBlock
            key={p.id}
            paragraph={p}
            onUndo={onUndoParagraph}
            isSelected={selectedId === p.id}
            onSelect={onSelectParagraph}
          />
        ))}

        {/* 底部提示 */}
        <p className="text-center text-[10px] text-[var(--color-muted-foreground)] pt-4">
          点击任意段落选中 · 在左侧对话框输入修改要求
        </p>
      </div>
    </div>
  );
}
