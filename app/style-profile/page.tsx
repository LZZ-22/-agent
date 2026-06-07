"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { getProfile, saveProfile, exportProfileJSON } from "@/lib/store";
import type { StyleProfile } from "@/lib/types";
import { Save, Download, Eye, EyeOff } from "lucide-react";

export default function StyleProfilePage() {
  const [profile, setProfile] = useState<StyleProfile | null>(null);
  const [saved, setSaved] = useState(false);
  const [showJson, setShowJson] = useState(false);

  useEffect(() => {
    setProfile(getProfile());
  }, []);

  const update = (field: keyof StyleProfile, value: string) => {
    if (!profile) return;
    setProfile({ ...profile, [field]: value });
  };

  const handleSave = () => {
    if (!profile) return;
    saveProfile(profile);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleExport = () => {
    const blob = new Blob([exportProfileJSON()], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = "style-profile.json";
    a.click();
    URL.revokeObjectURL(url);
  };

  if (!profile) {
    return <div className="p-12"><div className="skeleton h-96 w-full max-w-2xl mx-auto" /></div>;
  }

  const fields: { key: keyof StyleProfile; label: string; desc: string; type: "input" | "textarea" }[] = [
    { key: "name", label: "风格名称", desc: "给这个风格一个名字", type: "input" },
    { key: "persona", label: "核心人设", desc: "描述 Agent 应该扮演的角色和思考方式", type: "textarea" },
    { key: "tone", label: "语气特点", desc: "描述期望的语气风格", type: "textarea" },
    { key: "structure", label: "结构特点", desc: "回答应该遵循的结构模式", type: "textarea" },
    { key: "sentenceStyle", label: "句式特点", desc: "描述句子长度、节奏等特征", type: "textarea" },
    { key: "commonPhrases", label: "常用表达", desc: "该风格中常见的短语和表达方式", type: "textarea" },
    { key: "avoidPhrases", label: "避免使用的表达", desc: "该风格中不应出现的词汇或表达", type: "textarea" },
    { key: "lengthPreference", label: "回答长度偏好", desc: "描述期望的回答长度范围", type: "input" },
    { key: "exampleAnswer", label: "示例回答", desc: "给出一个符合该风格的完整示例", type: "textarea" },
  ];

  return (
    <div className="page-enter max-w-2xl mx-auto px-6 py-12">
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-2xl font-bold">风格规范</h1>
          <p className="text-sm text-[var(--color-muted-foreground)] mt-1">
            编辑你的语言风格画像，Agent 将据此生成回答
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" size="sm" onClick={handleExport}>
            <Download className="h-4 w-4" /> 导出 JSON
          </Button>
          <Button size="sm" onClick={handleSave}>
            <Save className="h-4 w-4" /> {saved ? "已保存" : "保存"}
          </Button>
        </div>
      </div>

      <div className="space-y-6">
        {fields.map((f) => (
          <Card key={f.key}>
            <CardHeader className="pb-3">
              <CardTitle className="text-base">{f.label}</CardTitle>
              <CardDescription>{f.desc}</CardDescription>
            </CardHeader>
            <CardContent>
              {f.type === "input" ? (
                <Input
                  value={profile[f.key] as string}
                  onChange={(e) => update(f.key, e.target.value)}
                />
              ) : (
                <Textarea
                  value={profile[f.key] as string}
                  onChange={(e) => update(f.key, e.target.value)}
                  rows={f.key === "exampleAnswer" ? 10 : 4}
                />
              )}
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="mt-8 flex justify-center gap-3">
        <Button size="lg" onClick={handleSave}>
          <Save className="h-4 w-4" /> {saved ? "已保存" : "保存风格规范"}
        </Button>
        <Button variant="outline" size="lg" onClick={() => setShowJson(!showJson)}>
          {showJson ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
          {showJson ? "隐藏" : "JSON 预览"}
        </Button>
      </div>

      {showJson && profile && (
        <Card className="mt-6">
          <CardHeader>
            <CardTitle className="text-base">JSON 预览</CardTitle>
            <CardDescription>可直接复制或导出为 JSON 文件</CardDescription>
          </CardHeader>
          <CardContent>
            <pre className="text-xs font-mono bg-[var(--color-muted)] p-4 rounded-[var(--radius-md)] overflow-x-auto max-h-96 overflow-y-auto whitespace-pre-wrap">
              {JSON.stringify(profile, null, 2)}
            </pre>
          </CardContent>
        </Card>
      )}
    </div>
  );
}
