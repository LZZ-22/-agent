// 本地存储读写封装 — 统一入口
// 底层实现见 lib/store.ts
export {
  initStore,
  getProfile,
  saveProfile,
  exportProfileJSON,
  getConversations,
  saveConversation,
  updateConversation,
  getComparisons,
  saveComparison,
  updateComparison,
  getEvaluations,
  saveEvaluation,
  getStats,
  exportAllData,
} from "./store";
