import type { QuizModule } from "../quiz-types";
import { BIG_FIVE_STANDARD, BIG_FIVE_PRO } from "./standard-pro";

export const BIG_FIVE_LAB: QuizModule = {
  module_id: "big_five_lab",
  module_name: "大五人格实验室",
  description: "这个模块看的是你在五个稳定人格维度上的相对倾向——开放性、尽责性、外向性、宜人性和情绪敏感性。不是把你粗暴塞进某一种人设里，而是让你看到自己在每个维度上的位置。",
  disclaimer: "本测试用于娱乐和自我观察，不构成临床诊断、医疗建议或正式心理评估结果。",
  dimensions: [
    { id: "openness", name: "开放性", description: "对新经验、新观念、审美和文化多样性的接受程度", highLabel: "高开放性", lowLabel: "低开放性", highInterpretation: "你容易被新观念、新体验和不熟悉的领域吸引。对你来说，好奇心和探索欲是重要的内在驱动力。优势在于灵活、开放，盲点是可能因为兴趣太分散而难以深耕。", lowInterpretation: "你更偏好熟悉、稳定、可预期的环境和方式。这不是保守，更像是一种'先确认安全再行动'的策略。优势在于专注和可靠，盲点是可能在需要快速适应变化时感到不适。" },
    { id: "conscientiousness", name: "尽责性", description: "组织性、自律性、目标导向和可靠程度", highLabel: "高尽责性", lowLabel: "低尽责性", highInterpretation: "你倾向于提前规划、按步骤推进、对承诺认真。优势在于可靠和有条理，盲点是可能对自己要求太严、难以放松，或对计划外的变化感到焦虑。", lowInterpretation: "你更倾向于灵活应变，不喜欢被死板的计划绑住。优势在于随性和适应力，盲点是可能在需要长期坚持的事情上容易分心或拖延。" },
    { id: "extraversion", name: "外向性", description: "社交活跃度、能量来源和人际互动偏好", highLabel: "高外向性", lowLabel: "低外向性", highInterpretation: "和人互动、交流想法通常让你更有能量。你倾向于在社交中获得刺激和满足。优势在于容易建立关系、擅长团队协作，盲点是可能在需要独处专注时感到不适。", lowInterpretation: "你更像那种不是没社交能力、而是对低质量互动耐受度不高的人。独处对你来说是恢复能量、整理思路的重要方式。优势在于深度思考和独立工作，盲点是可能被误解为冷淡或不合群。" },
    { id: "agreeableness", name: "宜人性", description: "合作性、同理心、对他人感受的关注程度", highLabel: "高宜人性", lowLabel: "低宜人性", highInterpretation: "你会下意识照顾别人的感受，避免让场面太难堪。优势在于善于合作和维护关系，盲点是可能因为过度迁就而忽视自己的需求，或在需要坚定立场时犹豫。", lowInterpretation: "你对'该谁负责'和'什么是合理'有比较清楚的标准。你愿意合作，但不一定愿意无条件迁就。优势在于边界清晰、不怕冲突，盲点是可能被误解为不够体贴或过于强硬。" },
    { id: "neuroticism", name: "情绪敏感性", description: "情绪反应的强度、恢复速度和压力应对方式", highLabel: "高情绪敏感性", lowLabel: "低情绪敏感性", highInterpretation: "你容易反复想一件事并被它影响情绪。对压力、不确定性和负面信号的感知比较敏锐。优势在于敏感细腻、有自我保护意识，盲点是可能消耗太多能量在处理内部情绪上。", lowInterpretation: "即使遇到压力，你通常也能比较快地稳住自己。情绪不太容易剧烈波动，对外界刺激有较高的承受力。优势在于稳定和韧性，盲点是可能被误解为'不够在意'或'太冷'。" },
  ],
  crossBridges: [
    { conditions: [{ moduleId: "big_five_lab", dimension: "extraversion", threshold: "low" }, { moduleId: "big_five_lab", dimension: "neuroticism", threshold: "high" }], insight: "低外向+高情绪敏感的组合，可能意味着你需要更谨慎地管理社交能量。", recommendModule: "social_attachment_lab", recommendReason: "如果你想看自己在关系里为什么容易防御，可以接着做社交边界模块。" },
    { conditions: [{ moduleId: "big_five_lab", dimension: "openness", threshold: "high" }, { moduleId: "big_five_lab", dimension: "conscientiousness", threshold: "low" }], insight: "高开放性+低尽责性往往意味着'想法很多但落地困难'。", recommendModule: "cognitive_style_lab", recommendReason: "如果你想看自己为什么总是想很多但不一定说得清，可以接着做认知风格模块。" },
  ],
  versions: {
    quick: {
      estimated_time: "3-5分钟", question_count: 10,
      questions: [
        { id: "bf_q1", dimension: "openness", text: "我通常会被新的观念、新鲜的体验或不熟悉的领域吸引。", reverse: false },
        { id: "bf_q2", dimension: "openness", text: "相比尝试新东西，我更喜欢熟悉、稳定、可预期的做法。", reverse: true },
        { id: "bf_q3", dimension: "conscientiousness", text: "我通常会提前规划，并尽量按计划推进事情。", reverse: false },
        { id: "bf_q4", dimension: "conscientiousness", text: "我经常知道该做什么，但很难真的按时做完。", reverse: true },
        { id: "bf_q5", dimension: "extraversion", text: "和人互动、交流想法，通常会让我更有能量。", reverse: false },
        { id: "bf_q6", dimension: "extraversion", text: "社交之后，我往往需要一个人待着才能缓过来。", reverse: true },
        { id: "bf_q7", dimension: "agreeableness", text: "我会下意识照顾别人的感受，避免让场面太难看。", reverse: false },
        { id: "bf_q8", dimension: "agreeableness", text: "如果我觉得对方不讲理，我通常不会太顾及对方的感受。", reverse: true },
        { id: "bf_q9", dimension: "neuroticism", text: "我很容易反复想一件事，并被它影响情绪。", reverse: false },
        { id: "bf_q10", dimension: "neuroticism", text: "即使遇到压力，我通常也能比较快地稳住自己。", reverse: true },
      ],
    },
    standard: { estimated_time: "6-10分钟", question_count: 25, questions: BIG_FIVE_STANDARD },
    pro: { estimated_time: "10-20分钟", question_count: 50, questions: BIG_FIVE_PRO },
  },
};
