"use client";

import { useState } from "react";
import type { Paragraph } from "@/lib/types";
import { cn } from "@/lib/utils";
import { Undo2, ChevronDown, ChevronUp } from "lucide-react";

interface ParagraphBlockProps {
  paragraph: Paragraph;
  isSelected: boolean;
  onSelect: (id: string) => void;
  onUndo?: (id: string) => void;
}

export function ParagraphBlock({
  paragraph,
  isSelected,
  onSelect,
  onUndo,
}: ParagraphBlockProps) {
  const [showHistory, setShowHistory] = useState(false);

  return (
    <div>
      <div
        onClick={() => onSelect(paragraph.id)}
        className={cn(
          "group relative p-4 rounded-[var(--radius-md)] border transition-all cursor-pointer",
          isSelected
            ? "border-[var(--color-primary)] bg-[var(--color-primary)]/5 ring-1 ring-[var(--color-primary)]"
            : "border-transparent hover:border-[var(--color-border)] hover:bg-[var(--color-muted)]/50"
        )}
      >
        {/* 段落序号 */}
        <div className="absolute -left-2 top-4 w-6 h-6 rounded-full bg-[var(--color-muted)] border border-[var(--color-border)] flex items-center justify-center text-[10px] text-[var(--color-muted-foreground)] font-mono opacity-0 group-hover:opacity-100 transition-opacity">
          {paragraph.seq + 1}
        </div>

        {/* 段落内容 */}
        <p className="text-sm leading-relaxed whitespace-pre-wrap pr-20">
          {paragraph.content}
        </p>

        {/* 工具栏 */}
        <div className="absolute top-2 right-3 flex items-center gap-1.5">
          {/* 版本标记 */}
          {paragraph.version > 1 && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                setShowHistory(!showHistory);
              }}
              className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] font-mono bg-amber-50 border border-amber-200 text-amber-700 hover:bg-amber-100 transition-colors cursor-pointer"
              title="查看修改历史"
            >
              v{paragraph.version}
              {showHistory ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
            </button>
          )}

          {/* 撤销按钮 */}
          {paragraph.version > 1 && onUndo && (
            <button
              onClick={(e) => {
                e.stopPropagation();
                onUndo(paragraph.id);
              }}
              className="opacity-0 group-hover:opacity-100 inline-flex items-center gap-1 px-1.5 py-0.5 rounded text-[10px] bg-[var(--color-muted)] border border-[var(--color-border)] hover:bg-[var(--color-border)] transition-all cursor-pointer"
              title="撤销到上一个版本"
            >
              <Undo2 className="h-3 w-3" />
              撤销
            </button>
          )}
        </div>

        {/* 选中状态的操作提示 */}
        {isSelected && (
          <div className="mt-3 flex items-center gap-2 text-xs text-[var(--color-primary)]">
            <span className="inline-block w-1.5 h-1.5 rounded-full bg-[var(--color-primary)]" />
            已选中 · 在对话框中输入修改要求
          </div>
        )}
      </div>

      {/* 版本历史展开 */}
      {showHistory && paragraph.history.length > 0 && (
        <div className="ml-6 mt-1 space-y-1.5 border-l-2 border-amber-200 pl-4 py-2">
          <p className="text-[10px] text-[var(--color-muted-foreground)] font-medium mb-1">
            修改历史
          </p>
          {paragraph.history
            .slice()
            .reverse()
            .map((v) => (
              <div
                key={v.version}
                className="text-[10px] text-[var(--color-muted-foreground)] bg-[var(--color-muted)] rounded px-2 py-1"
              >
                <span className="font-mono font-medium">v{v.version}</span>
                <span className="mx-1.5">·</span>
                <span>{new Date(v.modifiedAt).toLocaleTimeString("zh-CN", { hour: "2-digit", minute: "2-digit" })}</span>
                <span className="mx-1.5">·</span>
                <span className="italic">"{v.instruction.slice(0, 40)}{v.instruction.length > 40 ? "..." : ""}"</span>
              </div>
            ))}
        </div>
      )}
    </div>
  );
}
