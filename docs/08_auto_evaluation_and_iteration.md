# 自动评估与迭代系统

## 这个系统解决什么问题

传统 AI Agent 开发中，回答质量依赖开发者主观判断。本系统提供：
1. 自动对 Agent 回答进行 10 维度量化评估
2. 记录评估历史，发现重复出现的问题模式
3. 支持多策略并行实验和横向对比
4. 从评估数据中自动生成迭代建议

## 自动评估维度

| 维度 | 说明 | 评分范围 |
|------|------|:--:|
| accuracy | 事实准确性 | 0-10 |
| database_grounding | 是否基于数据库事实 | 0-10 |
| style_consistency | 是否符合 style profile | 0-10 |
| question_understanding | 是否正确理解问题 | 0-10 |
| structure_clarity | 结构是否清楚 | 0-10 |
| completeness | 是否覆盖关键点 | 0-10 |
| usefulness | 是否有实际帮助 | 0-10 |
| conciseness | 是否长度合适 | 0-10 |
| hallucination_risk | 胡编风险（分数越高=风险越低） | 0-10 |
| overclaim_risk | 过度肯定风险（分数越高=风险越低） | 0-10 |

## 实验策略

| 策略 | 数据库 | 风格 | 边界约束 |
|------|:--:|:--:|:--:|
| Baseline / Direct LLM | ✗ | ✗ | ✗ |
| DB Augmented Agent | ✓ | ✗ | ✗ |
| DB + Style Agent | ✓ | ✓ | ✗ |
| DB + Style + Guardrails | ✓ | ✓ | ✓ |

## 评估与迭代闭环

```
Agent 回答 → 自动评估(LLM/Mock) → 结构化记录 → 历史分析 → 模式发现 → 优化建议
```

## 当前限制

- 评估依赖 LLM 或本地规则（Mock 模式）
- 实验对比在 Mock 模式下使用模拟回答差异
- 迭代洞察基于 localStorage 中的评估历史

## 后续可扩展方向

1. 评估器校准：人工标注一批标准样本，校准自动评估准确度
2. A/B 测试框架：系统化对比 prompt 版本效果
3. 实时评估：对话中实时显示质量评分
4. 评估报告导出：生成 PDF/Markdown 评估报告
