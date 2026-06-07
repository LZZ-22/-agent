-- style-agent 语言样本数据库 Schema
-- 用于存放个人语言样本，分类：日常对话、长文、社交媒体文案

-- 分类表
CREATE TABLE IF NOT EXISTS categories (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  name        TEXT    NOT NULL UNIQUE,   -- 分类名称
  slug        TEXT    NOT NULL UNIQUE,   -- URL 友好标识
  description TEXT                        -- 分类说明
);

-- 样本表
CREATE TABLE IF NOT EXISTS samples (
  id          INTEGER PRIMARY KEY AUTOINCREMENT,
  category_id INTEGER NOT NULL REFERENCES categories(id),
  content     TEXT    NOT NULL,           -- 原始文本内容
  source      TEXT,                       -- 来源（平台/场景/对话对象）
  tags        TEXT,                       -- 逗号分隔的标签，便于筛选
  word_count  INTEGER,                    -- 字数
  char_count  INTEGER,                    -- 字符数（含标点）
  language    TEXT    DEFAULT 'zh',       -- 语言代码
  captured_at TEXT    DEFAULT (datetime('now', 'localtime')),
  notes       TEXT                        -- 备注
);

-- 创建索引
CREATE INDEX IF NOT EXISTS idx_samples_category ON samples(category_id);
CREATE INDEX IF NOT EXISTS idx_samples_captured ON samples(captured_at);
CREATE INDEX IF NOT EXISTS idx_samples_language ON samples(language);
CREATE INDEX IF NOT EXISTS idx_samples_tags ON samples(tags);
