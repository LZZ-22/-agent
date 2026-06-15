"use client";

import { useState, useEffect, useMemo, useCallback, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Film, Music, Building2, BookOpen, ScrollText, Plus, X, Sparkles, Tag, ChevronDown, Download, Upload, Loader2, Wand2 } from "lucide-react";

const STORAGE_KEY = "styleagent_space_data";

function loadData(defaultData: Record<CategoryKey, CategoryData>): Record<CategoryKey, CategoryData> {
  if (typeof window === "undefined") return defaultData;
  try { const raw = localStorage.getItem(STORAGE_KEY); if (raw) return JSON.parse(raw); } catch {}
  return defaultData;
}
function saveData(data: Record<CategoryKey, CategoryData>) {
  if (typeof window === "undefined") return;
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

interface CollectionItem {
  id: string; title: string; creator: string; year?: string; note: string; tags: string[];
  image: string;
}
interface CategoryData { items: CollectionItem[]; }
type CategoryKey = "film" | "music" | "architecture" | "literature" | "philosophy";

function img(seed: string) { return `https://picsum.photos/seed/${seed}/800/600`; }

const ACCENT_COLORS: Record<string, string> = {
  "text-amber-400": "rgba(251,191,36,0.15)", "text-rose-400": "rgba(251,113,133,0.15)",
  "text-emerald-400": "rgba(52,211,153,0.15)", "text-sky-400": "rgba(56,189,248,0.15)",
  "text-violet-400": "rgba(167,139,250,0.15)",
};

const CATEGORIES: { key: CategoryKey; label: string; icon: typeof Film; desc: string; accent: string; gradient: string; autoKeywords: string[] }[] = [
  { key: "film", label: "电影", icon: Film, desc: "银幕上的光影叙事，镜头语言与时间雕刻的艺术。", accent: "text-amber-400", gradient: "from-amber-500/20", autoKeywords: ["华语","好莱坞","欧洲","日本","韩国","纪录片","动画","独立电影","科幻","文艺","经典","当代"] },
  { key: "music", label: "音乐", icon: Music, desc: "声波中的情感共振，旋律编织的精神栖居。", accent: "text-rose-400", gradient: "from-rose-500/15", autoKeywords: ["Jazz","Classical","Rock","Electronic","Hip-Hop","Folk","Ambient","Alternative","Indie","实验","爵士","古典","摇滚","电子"] },
  { key: "architecture", label: "建筑风格", icon: Building2, desc: "空间的诗学——结构与光影凝固的时代意志。", accent: "text-emerald-400", gradient: "from-emerald-500/15", autoKeywords: ["现代主义","后现代","极简","粗野主义","解构主义","日本","北欧","中式","巴洛克","哥特","混凝土","木构","园林","宗教"] },
  { key: "literature", label: "文学", icon: BookOpen, desc: "词语的炼金术——在纸页间与伟大的灵魂交谈。", accent: "text-sky-400", gradient: "from-sky-500/15", autoKeywords: ["中国","日本","法国","俄罗斯","英美","拉美","古典","现代主义","后现代","诗歌","小说","科幻","魔幻现实","意识流","存在主义"] },
  { key: "philosophy", label: "哲学", icon: ScrollText, desc: "思想的极限运动——追问存在的边界与意义。", accent: "text-violet-400", gradient: "from-violet-500/15", autoKeywords: ["中国哲学","西方哲学","存在主义","现象学","分析哲学","道家","儒家","佛学","政治哲学","伦理学","形而上学","认识论","美学","古希腊","德国","法国"] },
];

const INITIAL_DATA: Record<CategoryKey, CategoryData> = {
  film: { items: [
    { id:"f1",title:"一一",creator:"杨德昌",year:"2000",note:"一部电影等于三辈子。",tags:["华语","家庭","现代性"],image:img("film-yiyi") },
    { id:"f2",title:"2001: A Space Odyssey",creator:"Stanley Kubrick",year:"1968",note:"从骨头到星空的演化诗。",tags:["科幻","哲学","视觉"],image:img("film-2001") },
    { id:"f3",title:"镜子",creator:"Andrei Tarkovsky",year:"1975",note:"记忆如风穿过时间。",tags:["诗电影","俄罗斯","自传"],image:img("film-mirror") },
  ]},
  music: { items: [
    { id:"m1",title:"Kind of Blue",creator:"Miles Davis",year:"1959",note:"调式爵士的起点。",tags:["Jazz","即兴","经典"],image:img("music-kindblue") },
    { id:"m2",title:"In Rainbows",creator:"Radiohead",year:"2007",note:"数字时代的模拟体温。",tags:["Alternative","英伦","实验"],image:img("music-radiohead") },
    { id:"m3",title:"The Dark Side of the Moon",creator:"Pink Floyd",year:"1973",note:"概念专辑的终极形态。",tags:["Prog Rock","概念","宇宙"],image:img("music-pf") },
  ]},
  architecture: { items: [
    { id:"a1",title:"朗香教堂",creator:"Le Corbusier",year:"1955",note:"混凝土也可以轻盈如诗。",tags:["现代主义","宗教"],image:img("arch-ronchamp") },
    { id:"a2",title:"光之教堂",creator:"安藤忠雄",year:"1989",note:"十字架是光切出来的。",tags:["极简","混凝土","日本"],image:img("arch-church") },
    { id:"a3",title:"苏州博物馆",creator:"贝聿铭",year:"2006",note:"几何与山水达成和解。",tags:["现代中式","园林"],image:img("arch-suzhou") },
  ]},
  literature: { items: [
    { id:"l1",title:"百年孤独",creator:"Gabriel García Márquez",year:"1967",note:"一部拉美文明的压缩史诗。",tags:["魔幻现实","拉美","家族"],image:img("lit-marquez") },
    { id:"l2",title:"追忆似水年华",creator:"Marcel Proust",year:"1913",note:"一块玛德莱娜蛋糕撬动整个记忆宇宙。",tags:["意识流","法国","时间"],image:img("lit-proust") },
    { id:"l3",title:"红楼梦",creator:"曹雪芹",year:"1791",note:"中国文学之巅。",tags:["古典","中国","悲剧"],image:img("lit-hlm") },
  ]},
  philosophy: { items: [
    { id:"p1",title:"存在与时间",creator:"Martin Heidegger",year:"1927",note:"此在的本质在于它的生存。",tags:["现象学","存在主义","德国"],image:img("phi-heidegger") },
    { id:"p2",title:"庄子",creator:"庄周",year:"公元前4世纪",note:"逍遥——游于无穷。",tags:["道家","中国","逍遥"],image:img("phi-zhuangzi") },
    { id:"p3",title:"查拉图斯特拉如是说",creator:"Friedrich Nietzsche",year:"1885",note:"人是一根绳索。",tags:["超人","虚无主义","德国"],image:img("phi-nietzsche") },
  ]},
};

function suggestTags(cat: (typeof CATEGORIES)[0], title: string, creator: string, note: string): string[] {
  const combined = `${title} ${creator} ${note}`.toLowerCase();
  return cat.autoKeywords.filter((kw) => combined.includes(kw.toLowerCase())).slice(0, 5);
}

// ─── 横向循环滚动器 ─────────────────────────────────────
function HorizontalLooper({ items, cat, onEdit, onDelete }: {
  items: CollectionItem[]; cat: (typeof CATEGORIES)[0]; onEdit: (item: CollectionItem) => void; onDelete: (id: string) => void;
}) {
  const containerRef = useRef<HTMLDivElement>(null);
  const duplicated = useMemo(() => items.length > 1 ? [...items, ...items] : items, [items]);
  const itemWidth = 280;
  const totalWidth = items.length * itemWidth;

  // 拖拽状态
  const dragRef = useRef({ isDown: false, startX: 0, scrollStart: 0, velocity: 0, lastX: 0, lastTime: 0, raf: 0 as number | null, moved: 0 });

  useEffect(() => {
    const el = containerRef.current; if (!el || items.length <= 1) return;
    el.scrollLeft = 0;

    const loop = () => {
      if (el.scrollLeft >= totalWidth) el.scrollLeft -= totalWidth;
      else if (el.scrollLeft < 0) el.scrollLeft += totalWidth;
    };
    el.addEventListener("scroll", loop, { passive: true });

    // ─── 拖拽滚动 + 惯性 ───────────────────────────────
    const onDown = (e: MouseEvent | TouchEvent) => {
      dragRef.current.isDown = true;
      dragRef.current.moved = 0;
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      dragRef.current.startX = cx;
      dragRef.current.scrollStart = el.scrollLeft;
      dragRef.current.lastX = cx;
      dragRef.current.lastTime = Date.now();
      dragRef.current.velocity = 0;
      if (dragRef.current.raf) cancelAnimationFrame(dragRef.current.raf);
      el.style.cursor = "grabbing";
      el.style.userSelect = "none";
    };
    const onMove = (e: MouseEvent | TouchEvent) => {
      if (!dragRef.current.isDown) return;
      e.preventDefault();
      const cx = "touches" in e ? e.touches[0].clientX : e.clientX;
      const dx = dragRef.current.startX - cx;
      dragRef.current.moved = Math.abs(dx);
      el.scrollLeft = dragRef.current.scrollStart + dx;
      const now = Date.now(); const dt = now - dragRef.current.lastTime || 16;
      dragRef.current.velocity = (dragRef.current.lastX - cx) / dt;
      dragRef.current.lastX = cx; dragRef.current.lastTime = now;
    };
    const onUp = () => {
      dragRef.current.isDown = false;
      el.style.cursor = "grab";
      el.style.userSelect = "";
      // 惯性滑行
      let v = Math.abs(dragRef.current.velocity * 200);
      if (v < 2) return;
      const dir = dragRef.current.velocity > 0 ? 1 : -1;
      const decay = () => { if (v < 0.5 || dragRef.current.isDown) return; el.scrollLeft += dir * v; v *= 0.92; dragRef.current.raf = requestAnimationFrame(decay); };
      dragRef.current.raf = requestAnimationFrame(decay);
    };

    el.addEventListener("mousedown", onDown); window.addEventListener("mousemove", onMove); window.addEventListener("mouseup", onUp);
    el.addEventListener("touchstart", onDown, { passive: false }); window.addEventListener("touchmove", onMove, { passive: false }); window.addEventListener("touchend", onUp);

    return () => {
      el.removeEventListener("scroll", loop);
      el.removeEventListener("mousedown", onDown); window.removeEventListener("mousemove", onMove); window.removeEventListener("mouseup", onUp);
      el.removeEventListener("touchstart", onDown); window.removeEventListener("touchmove", onMove); window.removeEventListener("touchend", onUp);
    };
  }, [items, totalWidth]);

  return (
    <div
      ref={containerRef}
      className="flex gap-3 overflow-x-auto pb-2 scrollbar-none select-none"
      style={{ cursor: "grab", WebkitOverflowScrolling: "touch" }}
    >
      {duplicated.map((item, i) => (
        <div
          key={`${item.id}-${i}`}
          role="button" tabIndex={0} aria-label={`${item.title} — 点击编辑`}
          onClick={() => { if (dragRef.current.moved < 5) onEdit(item); }}
          className="group/card relative flex-shrink-0 cursor-pointer rounded-xl border border-white/5 backdrop-blur-md bg-white/[0.02] transition-all duration-500 overflow-hidden hover:-translate-y-1.5 hover:shadow-xl hover:shadow-black/30"
          style={{ width: itemWidth }}
        >
          <div className="absolute inset-0 opacity-0 group-hover/card:opacity-100 transition-opacity duration-500 pointer-events-none"
            style={{ background: `radial-gradient(circle at 0% 0%, ${ACCENT_COLORS[cat.accent] || "rgba(255,255,255,0.08)"} 0%, transparent 60%)` }} />
          <div className="p-5 relative z-10">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1 min-w-0">
                <h4 className="font-serif text-base text-white/90 font-light tracking-wider truncate">{item.title}</h4>
                <p className="text-xs text-white/55 mt-0.5 font-light">{item.creator}{item.year ? ` · ${item.year}` : ""}</p>
              </div>
              <button aria-label="删除" onClick={(e) => { e.stopPropagation(); onDelete(item.id); }}
                className="opacity-0 group-hover/card:opacity-100 transition-opacity p-2.5 hover:text-red-400 text-white/55 min-w-[44px] min-h-[44px] flex items-center justify-center"><X className="w-3.5 h-3.5" aria-hidden="true" /></button>
            </div>
            {item.note && <p className="text-xs text-white/45 leading-relaxed mt-2 line-clamp-2 italic">{item.note}</p>}
            <div className="flex flex-wrap gap-1.5 mt-3">
              {item.tags.map((t) => (<span key={t} className={`text-[10px] px-2 py-0.5 rounded-full ${cat.accent.replace("text-","bg-")}/10 ${cat.accent.replace("text-","text-")}/80 border ${cat.accent.replace("text-","border-")}/20`}>{t}</span>))}
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── 分类区块 ────────────────────────────────────────────
function CategorySection({ cat, data, onAdd, onDelete, onEdit }: {
  cat: (typeof CATEGORIES)[0]; data: CategoryData; onAdd: () => void; onDelete: (id: string) => void;
  onEdit: (item: CollectionItem) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  return (
    <section className="relative group/section">
      <div className={`absolute -inset-10 bg-gradient-to-br ${cat.gradient} rounded-3xl opacity-0 group-hover/section:opacity-100 transition-opacity duration-700 pointer-events-none`} />
      <div className="relative flex items-center justify-between mb-5 pb-4 border-b border-white/5">
        <button onClick={() => setCollapsed(!collapsed)} aria-expanded={!collapsed} className="flex items-center gap-3 group/title">
          <cat.icon className={`w-5 h-5 ${cat.accent}`} />
          <div className="text-left"><h2 className="font-serif text-xl text-white/90 font-light tracking-wider">{cat.label}</h2><p className="text-[11px] text-white/45 font-light mt-0.5">{cat.desc}</p></div>
          <span className="text-[10px] text-white/25 ml-2 font-mono">{data.items.length} 项</span>
          <ChevronDown className={`w-3.5 h-3.5 ml-1.5 text-white/25 transition-transform duration-300 ${collapsed ? "-rotate-90" : ""}`} />
        </button>
        <button onClick={onAdd} className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-full border border-white/10 text-xs text-white/55 hover:text-white hover:border-white/30 transition-all hover:bg-white/5"><Plus className="w-3 h-3" />添加</button>
      </div>
      {data.items.length > 0 ? (
        <AnimatePresence mode="popLayout">
          {!collapsed && (
            <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}>
              <HorizontalLooper items={data.items} cat={cat} onEdit={onEdit} onDelete={onDelete} />
            </motion.div>
          )}
        </AnimatePresence>
      ) : (
        <div className="flex items-center justify-center h-24 border border-dashed border-white/5 rounded-xl text-white/20 text-xs tracking-wider">暂无藏品，点击「添加」开始收藏</div>
      )}
    </section>
  );
}

// ─── 添加弹窗 ────────────────────────────────────────────
function AddModal({ cat, onClose, onSave }: { cat: (typeof CATEGORIES)[0]; onClose: () => void; onSave: (item: CollectionItem) => void }) {
  const [title, setTitle] = useState(""); const [creator, setCreator] = useState(""); const [year, setYear] = useState("");
  const [note, setNote] = useState(""); const [tagsStr, setTagsStr] = useState("");
  const [autoImage, setAutoImage] = useState(""); const [autoFilling, setAutoFilling] = useState(false);
  const [autoFilled, setAutoFilled] = useState(false);
  useEffect(() => { const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [onClose]);
  const handleAutofill = async () => {
    if (!title.trim()) return; setAutoFilling(true);
    try { const res = await fetch("/api/space/autofill", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ title: title.trim(), category: cat.key }) }); const data = await res.json();
      if (data.creator) setCreator(data.creator); if (data.year) setYear(data.year); if (data.tags?.length) setTagsStr(data.tags.join(", ")); if (data.note) setNote(data.note); if (data.image) setAutoImage(data.image); setAutoFilled(true); } catch {} finally { setAutoFilling(false); }
  };
  const suggested = useMemo(() => suggestTags(cat, title, creator, note).filter((k) => !tagsStr.includes(k)), [cat, title, creator, note, tagsStr]);
  const handleSave = () => { if (!title.trim()) return; onSave({ id: `${cat.key}_${Date.now().toString(36)}`, title: title.trim(), creator: creator.trim() || "未知", year: year.trim() || undefined, note: note.trim(), tags: tagsStr.split(",").map(t => t.trim()).filter(Boolean), image: autoImage || img(`${cat.key}-${Date.now().toString(36)}`) }); onClose(); };
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-x-4 top-[10%] z-50 max-w-md mx-auto rounded-2xl border border-white/10 bg-[var(--color-bg-elevated)] shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/5"><div className="flex items-center gap-2.5"><cat.icon className={`w-4 h-4 ${cat.accent}`} /><h2 className="font-serif text-lg text-white/90 tracking-wider">添加{cat.label}</h2></div><button aria-label="关闭" onClick={onClose} className="p-1.5 rounded-full hover:bg-white/5 text-white/55 hover:text-white transition-colors"><X className="w-4 h-4" aria-hidden="true" /></button></div>
        <div className="p-5 space-y-4">
          <div><div className="flex items-end gap-2"><div className="flex-1"><label className="text-[10px] tracking-[0.15em] text-white/45 uppercase block mb-1.5">名称 *</label><input value={title} onChange={e => { setTitle(e.target.value); setAutoFilled(false); }} placeholder="作品名称..." className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/90 placeholder:text-white/15 focus:outline-none focus:border-white/30 transition-colors" /></div><button onClick={handleAutofill} disabled={autoFilling || !title.trim()} className="flex-shrink-0 h-10 px-4 rounded-lg border border-[var(--color-canary)]/40 text-[var(--color-canary)] text-xs font-medium hover:bg-[var(--color-canary)]/10 transition-colors disabled:opacity-30 flex items-center gap-1.5">{autoFilling ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Wand2 className="w-3.5 h-3.5" />}{autoFilling ? "识别中" : autoFilled ? "已识别" : "AI 补全"}</button></div>{autoFilled && <p className="text-[10px] text-[var(--color-canary)]/60 mt-1">已自动补全信息，可手动修改</p>}</div>
          <div className="grid grid-cols-2 gap-3"><div><label className="text-[10px] tracking-[0.15em] text-white/45 uppercase block mb-1.5">创作者</label><input value={creator} onChange={e => setCreator(e.target.value)} className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/90 focus:outline-none focus:border-white/30 transition-colors" /></div><div><label className="text-[10px] tracking-[0.15em] text-white/45 uppercase block mb-1.5">年份</label><input value={year} onChange={e => setYear(e.target.value)} className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/90 focus:outline-none focus:border-white/30 transition-colors" /></div></div>
          <div><label className="text-[10px] tracking-[0.15em] text-white/45 uppercase block mb-1.5">笔记</label><textarea value={note} onChange={e => setNote(e.target.value)} rows={3} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/90 focus:outline-none focus:border-white/30 transition-colors resize-none" /></div>
          <div><label className="text-[10px] tracking-[0.15em] text-white/45 uppercase block mb-1.5">标签 (逗号分隔)</label><input value={tagsStr} onChange={e => setTagsStr(e.target.value)} className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/90 focus:outline-none focus:border-white/30 transition-colors" />{suggested.length > 0 && (<div className="mt-2.5 flex items-start gap-2"><Tag className="w-3 h-3 text-[var(--color-canary)]/60 mt-0.5" /><div className="flex flex-wrap gap-1.5">{suggested.map(kw => (<button key={kw} onClick={() => { const cur = tagsStr.split(",").map(t => t.trim()).filter(Boolean); if (!cur.includes(kw)) setTagsStr([...cur, kw].join(", ")); }} className="text-[10px] px-2 py-0.5 rounded-full border border-[var(--color-canary)]/30 text-[var(--color-canary)]/80 hover:bg-[var(--color-canary)]/10 transition-colors">+ {kw}</button>))}</div></div>)}</div>
        </div>
        <div className="p-5 pt-0"><button onClick={handleSave} disabled={!title.trim()} className="w-full h-11 bg-[var(--color-canary)] text-black rounded-xl font-medium text-sm tracking-wider hover:bg-white transition-colors disabled:opacity-30"><Sparkles className="w-3.5 h-3.5 inline mr-2" />存入收藏</button></div>
      </motion.div>
    </>
  );
}

// ─── 编辑弹窗 ────────────────────────────────────────────
function EditModal({ cat, item, onClose, onSave, onDelete }: {
  cat: (typeof CATEGORIES)[0]; item: CollectionItem; onClose: () => void; onSave: (item: CollectionItem) => void; onDelete: (id: string) => void;
}) {
  const [title, setTitle] = useState(item.title); const [creator, setCreator] = useState(item.creator);
  const [year, setYear] = useState(item.year || ""); const [note, setNote] = useState(item.note);
  const [tagsStr, setTagsStr] = useState(item.tags.join(", "));
  useEffect(() => { const onKey = (e: KeyboardEvent) => { if (e.key === "Escape") onClose(); }; window.addEventListener("keydown", onKey); return () => window.removeEventListener("keydown", onKey); }, [onClose]);
  return (
    <>
      <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={onClose} className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm" />
      <motion.div initial={{ opacity: 0, scale: 0.95, y: 20 }} animate={{ opacity: 1, scale: 1, y: 0 }} exit={{ opacity: 0, scale: 0.95, y: 20 }} className="fixed inset-x-4 top-[10%] z-50 max-w-md mx-auto rounded-2xl border border-white/10 bg-[var(--color-bg-elevated)] shadow-2xl overflow-hidden max-h-[85vh] overflow-y-auto">
        <div className="flex items-center justify-between p-5 border-b border-white/5"><div className="flex items-center gap-2.5"><cat.icon className={`w-4 h-4 ${cat.accent}`} /><h2 className="font-serif text-lg text-white/90 tracking-wider">编辑{cat.label}</h2></div><button aria-label="关闭" onClick={onClose} className="p-1.5 rounded-full hover:bg-white/5 text-white/55 hover:text-white transition-colors"><X className="w-4 h-4" aria-hidden="true" /></button></div>
        <div className="p-5 space-y-4">
          <div><label className="text-[10px] text-white/45 uppercase block mb-1.5">名称</label><input value={title} onChange={e => setTitle(e.target.value)} className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/90 focus:outline-none focus:border-white/30" /></div>
          <div className="grid grid-cols-2 gap-3"><div><label className="text-[10px] text-white/45 uppercase block mb-1.5">创作者</label><input value={creator} onChange={e => setCreator(e.target.value)} className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/90 focus:outline-none focus:border-white/30" /></div><div><label className="text-[10px] text-white/45 uppercase block mb-1.5">年份</label><input value={year} onChange={e => setYear(e.target.value)} className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/90 focus:outline-none focus:border-white/30" /></div></div>
          <div><label className="text-[10px] text-white/45 uppercase block mb-1.5">笔记</label><textarea value={note} onChange={e => setNote(e.target.value)} rows={3} className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm text-white/90 focus:outline-none focus:border-white/30 resize-none" /></div>
          <div><label className="text-[10px] text-white/45 uppercase block mb-1.5">标签 (逗号分隔)</label><input value={tagsStr} onChange={e => setTagsStr(e.target.value)} className="w-full h-10 rounded-lg border border-white/10 bg-white/5 px-3 text-sm text-white/90 focus:outline-none focus:border-white/30" /></div>
        </div>
        <div className="p-5 pt-0 flex gap-3"><button onClick={() => { onSave({ ...item, title: title.trim(), creator: creator.trim() || "未知", year: year.trim() || undefined, note: note.trim(), tags: tagsStr.split(",").map(t => t.trim()).filter(Boolean) }); onClose(); }} className="flex-1 h-11 bg-[var(--color-canary)] text-black rounded-xl font-medium text-sm hover:bg-white transition-colors disabled:opacity-30"><Sparkles className="w-3.5 h-3.5 inline mr-2" />保存修改</button><button onClick={() => { onDelete(item.id); onClose(); }} className="h-11 px-4 rounded-xl border border-red-500/30 text-red-400 text-xs hover:bg-red-500/10">删除</button></div>
      </motion.div>
    </>
  );
}

// ═══════════════════════════════════════════════════════════
export default function SpaceContent() {
  const [data, setData] = useState<Record<CategoryKey, CategoryData>>(() => loadData(INITIAL_DATA));
  const [activeCat, setActiveCat] = useState<CategoryKey | null>(null);
  const [editingItem, setEditingItem] = useState<{ cat: (typeof CATEGORIES)[0]; item: CollectionItem } | null>(null);
  useEffect(() => { saveData(data); }, [data]);

  const handleAdd = useCallback((cat: (typeof CATEGORIES)[0], item: CollectionItem) => {
    setData(prev => ({ ...prev, [cat.key]: { ...prev[cat.key], items: [...prev[cat.key].items, item] } })); setActiveCat(null);
  }, []);
  const handleDelete = useCallback((catKey: CategoryKey, id: string) => {
    setData(prev => ({ ...prev, [catKey]: { ...prev[catKey], items: prev[catKey].items.filter(i => i.id !== id) } }));
  }, []);
  const handleEdit = useCallback((cat: (typeof CATEGORIES)[0], item: CollectionItem) => { setEditingItem({ cat, item }); }, []);
  const handleUpdate = useCallback((updated: CollectionItem) => {
    setData(prev => { for (const key of Object.keys(prev) as CategoryKey[]) { const idx = prev[key].items.findIndex(i => i.id === updated.id); if (idx >= 0) return { ...prev, [key]: { ...prev[key], items: prev[key].items.map((i, j) => j === idx ? updated : i) } }; } return prev; }); setEditingItem(null);
  }, []);
  const totalItems = useMemo(() => Object.values(data).reduce((s, c) => s + c.items.length, 0), [data]);
  const handleExport = () => { const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" }); const url = URL.createObjectURL(blob); const a = document.createElement("a"); a.href = url; a.download = "space-collection.json"; a.click(); URL.revokeObjectURL(url); };
  const handleImport = () => { const input = document.createElement("input"); input.type = "file"; input.accept = ".json"; input.onchange = (e) => { const file = (e.target as HTMLInputElement).files?.[0]; if (!file) return; const reader = new FileReader(); reader.onload = () => { try { setData(JSON.parse(reader.result as string)); } catch { alert("导入失败"); } }; reader.readAsText(file); }; input.click(); };

  return (
    <section id="space-section" className="min-h-screen pt-20 pb-24 px-8 lg:px-20 flex flex-col" style={{ scrollSnapAlign: "start" }}>
      <div className="flex items-center justify-between mb-12">
        <div>
          <div className="flex items-center gap-3 mb-4"><div className="h-px w-10 bg-gradient-to-r from-transparent to-[var(--color-canary)]/30" /><span className="text-[10px] tracking-[0.3em] text-white/25 uppercase">Personal Archive</span></div>
          <h2 className="font-serif text-3xl italic font-light text-white/80 tracking-wider">木漏れ日</h2>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-[10px] text-white/25 font-mono mr-2">共 {totalItems} 件</span>
          <button onClick={handleExport} className="flex items-center gap-1 text-xs text-white/45 hover:text-white/70 transition-colors"><Download className="w-3 h-3" />导出</button>
          <button onClick={handleImport} className="flex items-center gap-1 text-xs text-white/45 hover:text-white/70 transition-colors"><Upload className="w-3 h-3" />导入</button>
        </div>
      </div>
      <div className="space-y-20 max-w-7xl mx-auto w-full">
        {CATEGORIES.map(cat => (
          <CategorySection key={cat.key} cat={cat} data={data[cat.key]} onAdd={() => setActiveCat(cat.key)} onDelete={(id) => handleDelete(cat.key, id)} onEdit={(item) => handleEdit(cat, item)} />
        ))}
      </div>
      <AnimatePresence>
        {activeCat && <AddModal cat={CATEGORIES.find(c => c.key === activeCat)!} onClose={() => setActiveCat(null)} onSave={(item) => handleAdd(CATEGORIES.find(c => c.key === activeCat)!, item)} />}
        {editingItem && <EditModal cat={editingItem.cat} item={editingItem.item} onClose={() => setEditingItem(null)} onSave={handleUpdate} onDelete={(id: string) => { handleDelete(editingItem.cat.key, id); setEditingItem(null); }} />}
      </AnimatePresence>
    </section>
  );
}
