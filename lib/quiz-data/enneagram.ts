import type { QuizModule } from "../quiz-types";

export const ENNEAGRAM_LAB: QuizModule = {
  module_id: "enneagram_lab", module_name: "九型人格实验室",
  description: "这是一个偏'动机和防御方式观察'的娱乐型模块。它看的是你内心深处更在意什么、害怕什么、被什么驱动——不是把你锁死在某个号码里。",
  disclaimer: "本测试用于娱乐和自我观察，不构成临床诊断、医疗建议或正式心理评估结果。",
  dimensions: [
    { id: "type1", name: "改善者", description: "追求正确、完善和秩序", highLabel: "", lowLabel: "", highInterpretation: "你对自己和事情都有较高标准。驱动力是'把事情做对'。优势在于认真、负责、有原则，盲点是可能对自己和他人过于严苛，难以接受'差不多就行'。", lowInterpretation: "" },
    { id: "type2", name: "给予者", description: "关注他人需求，渴望被需要", highLabel: "", lowLabel: "", highInterpretation: "你很容易注意到别人需要什么并想提供帮助。驱动力是'被需要和被爱'。优势在于温暖、慷慨、善解人意，盲点是可能忽视自己的需求，或期望回报而没有得到时感到失落。", lowInterpretation: "" },
    { id: "type3", name: "成就者", description: "追求效率、成功和被认可", highLabel: "", lowLabel: "", highInterpretation: "你希望自己是有成绩、有分量、拿得出手的人。驱动力是'被认可和有价值'。优势在于高效、目标导向、适应力强，盲点是可能过度认同自己的成就而忽视内在感受。", lowInterpretation: "" },
    { id: "type4", name: "感受者", description: "追求独特性、深度和真实表达", highLabel: "", lowLabel: "", highInterpretation: "你对情绪、氛围和个人体验有比较强的感受力。驱动力是'找到真正的自己和独特意义'。优势在于深刻、有创造力、真诚，盲点是可能陷入情绪漩涡或觉得自己和别人不一样而孤独。", lowInterpretation: "" },
    { id: "type5", name: "观察者", description: "追求知识、理解和心理空间", highLabel: "", lowLabel: "", highInterpretation: "你需要留出足够的心理空间，不喜欢被人过度占用。驱动力是'理解和掌握'。优势在于深度思考、独立、专注，盲点是可能在需要情感表达时退缩，或过于抽离。", lowInterpretation: "" },
    { id: "type6", name: "忠诚者", description: "追求安全、确定和可依赖", highLabel: "", lowLabel: "", highInterpretation: "你会提前想风险，避免关键时候出问题。驱动力是'安全和可依赖'。优势在于谨慎、忠诚、有预见性，盲点是可能过度担忧或在信任建立前保持距离。", lowInterpretation: "" },
    { id: "type7", name: "探索者", description: "追求新鲜、自由和可能性", highLabel: "", lowLabel: "", highInterpretation: "你不太喜欢把自己困在沉重、无聊的状态里。驱动力是'自由和快乐'。优势在于乐观、灵活、有创意，盲点是可能逃避痛苦或难以坚持需要长期投入的事。", lowInterpretation: "" },
    { id: "type8", name: "主导者", description: "追求力量、控制和自主", highLabel: "", lowLabel: "", highInterpretation: "你不喜欢被控制、被压着或者被人拿捏。驱动力是'自主和强大'。优势在于果断、保护欲强、有领导力，盲点是可能过于强势或难以示弱。", lowInterpretation: "" },
    { id: "type9", name: "调和者", description: "追求和谐、平静和舒适", highLabel: "", lowLabel: "", highInterpretation: "你不喜欢冲突升级，很多时候会先让场面稳住。驱动力是'平静和和谐'。优势在于包容、平和、善于协调，盲点是可能为了维持和平而压抑自己的真实想法和需求。", lowInterpretation: "" },
  ],
  crossBridges: [
    { conditions: [{ moduleId: "enneagram_lab", dimension: "type5", threshold: "high" }, { moduleId: "enneagram_lab", dimension: "type8", threshold: "high" }], insight: "5+8的组合通常意味着'观察者+主导者'——你既需要空间思考，也不喜欢被人拿捏。", recommendModule: "social_attachment_lab", recommendReason: "如果你想看自己在关系里为什么容易防御，可以接着做社交边界模块。" },
  ],
  versions: {
    quick: { estimated_time: "3-5分钟", question_count: 18, questions: [
      { id:"en_q1",dimension:"type1",text:"我对自己和事情都有较高标准，看到不合适的地方会想纠正。",reverse:false},
      { id:"en_q2",dimension:"type1",text:"即使别人觉得差不多就行，我也很难完全放过明显的问题。",reverse:false},
      { id:"en_q3",dimension:"type2",text:"我很容易注意到别人需要什么，并想提供帮助。",reverse:false},
      { id:"en_q4",dimension:"type2",text:"当我对别人很上心却没有被看见时，我会有点失落。",reverse:false},
      { id:"en_q5",dimension:"type3",text:"我希望自己是有成绩、有分量、拿得出手的人。",reverse:false},
      { id:"en_q6",dimension:"type3",text:"我会在意别人是否认可我的能力和表现。",reverse:false},
      { id:"en_q7",dimension:"type4",text:"我对情绪、氛围和个人体验有比较强的感受力。",reverse:false},
      { id:"en_q8",dimension:"type4",text:"我常觉得自己和周围人有些不一样。",reverse:false},
      { id:"en_q9",dimension:"type5",text:"我需要留出足够的心理空间，不喜欢被人过度占用。",reverse:false},
      { id:"en_q10",dimension:"type5",text:"比起被情绪推着走，我更习惯先观察、理解、想清楚。",reverse:false},
      { id:"en_q11",dimension:"type6",text:"我会提前想风险，避免自己在关键时候出问题。",reverse:false},
      { id:"en_q12",dimension:"type6",text:"对人和事，我通常需要先建立信任感才会真正放松。",reverse:false},
      { id:"en_q13",dimension:"type7",text:"我不太喜欢把自己困在沉重、无聊或没有希望的状态里。",reverse:false},
      { id:"en_q14",dimension:"type7",text:"我会本能地去找新的可能性、新的选择或新的出口。",reverse:false},
      { id:"en_q15",dimension:"type8",text:"我不喜欢被控制、被压着或者被人拿捏。",reverse:false},
      { id:"en_q16",dimension:"type8",text:"如果我觉得有必要，我会很直接地顶上去。",reverse:false},
      { id:"en_q17",dimension:"type9",text:"我不喜欢冲突升级，很多时候会先让场面稳住。",reverse:false},
      { id:"en_q18",dimension:"type9",text:"我有时会为了维持平静而把自己的想法往后放。",reverse:false},
    ]},
    standard: { estimated_time: "6-10分钟", question_count: 36, questions: [
      // type1 expanded
      { id:"en_s01",dimension:"type1",text:"我对自己和事情都有较高标准，看到不合适的地方会想纠正。",reverse:false},
      { id:"en_s02",dimension:"type1",text:"即使别人觉得差不多就行，我也很难完全放过明显的问题。",reverse:false},
      { id:"en_s03",dimension:"type1",text:"我倾向于把事情做得井井有条而不是随意应付。",reverse:false},
      { id:"en_s04",dimension:"type1",text:"当别人不按规矩来时我会感到明显不适。",reverse:false},
      // type2
      { id:"en_s05",dimension:"type2",text:"我很容易注意到别人需要什么，并想提供帮助。",reverse:false},
      { id:"en_s06",dimension:"type2",text:"当我对别人很上心却没有被看见时，我会有点失落。",reverse:false},
      { id:"en_s07",dimension:"type2",text:"在关系中我通常是更主动付出的那一方。",reverse:false},
      { id:"en_s08",dimension:"type2",text:"如果帮不了别人我会觉得自己没太大价值。",reverse:false},
      // type3
      { id:"en_s09",dimension:"type3",text:"我希望自己是有成绩、有分量、拿得出手的人。",reverse:false},
      { id:"en_s10",dimension:"type3",text:"我会在意别人是否认可我的能力和表现。",reverse:false},
      { id:"en_s11",dimension:"type3",text:"失败会让我怀疑自己的整体价值。",reverse:false},
      { id:"en_s12",dimension:"type3",text:"我倾向于用成果来定义自己是否过得好。",reverse:false},
      // type4
      { id:"en_s13",dimension:"type4",text:"我对情绪、氛围和个人体验有比较强的感受力。",reverse:false},
      { id:"en_s14",dimension:"type4",text:"我常觉得自己和周围人有些不一样。",reverse:false},
      { id:"en_s15",dimension:"type4",text:"我容易被深刻、独特或带悲剧美的东西吸引。",reverse:false},
      { id:"en_s16",dimension:"type4",text:"有时候我觉得没人真正理解我的感受。",reverse:false},
      // type5
      { id:"en_s17",dimension:"type5",text:"我需要留出足够的心理空间，不喜欢被人过度占用。",reverse:false},
      { id:"en_s18",dimension:"type5",text:"比起被情绪推着走，我更习惯先观察、理解、想清楚。",reverse:false},
      { id:"en_s19",dimension:"type5",text:"独处对我来说是恢复能量的必需品。",reverse:false},
      { id:"en_s20",dimension:"type5",text:"在参与之前我更喜欢先观察和收集信息。",reverse:false},
      // type6
      { id:"en_s21",dimension:"type6",text:"我会提前想风险，避免自己在关键时候出问题。",reverse:false},
      { id:"en_s22",dimension:"type6",text:"对人和事，我通常需要先建立信任感才会真正放松。",reverse:false},
      { id:"en_s23",dimension:"type6",text:"我经常问自己'万一出问题了怎么办'。",reverse:false},
      { id:"en_s24",dimension:"type6",text:"对不确定的事我倾向于做最坏的打算。",reverse:false},
      // type7
      { id:"en_s25",dimension:"type7",text:"我不太喜欢把自己困在沉重、无聊或没有希望的状态里。",reverse:false},
      { id:"en_s26",dimension:"type7",text:"我会本能地去找新的可能性、新的选择或新的出口。",reverse:false},
      { id:"en_s27",dimension:"type7",text:"当一件事变得太沉重时我会想切换到另一件事。",reverse:false},
      { id:"en_s28",dimension:"type7",text:"我对新鲜事物有强烈的兴趣。",reverse:false},
      // type8
      { id:"en_s29",dimension:"type8",text:"我不喜欢被控制、被压着或者被人拿捏。",reverse:false},
      { id:"en_s30",dimension:"type8",text:"如果我觉得有必要，我会很直接地顶上去。",reverse:false},
      { id:"en_s31",dimension:"type8",text:"在需要做决定时我通常是第一个开口的人。",reverse:false},
      { id:"en_s32",dimension:"type8",text:"示弱对我来说是一件很难的事。",reverse:false},
      // type9
      { id:"en_s33",dimension:"type9",text:"我不喜欢冲突升级，很多时候会先让场面稳住。",reverse:false},
      { id:"en_s34",dimension:"type9",text:"我有时会为了维持平静而把自己的想法往后放。",reverse:false},
      { id:"en_s35",dimension:"type9",text:"在紧张的氛围里我通常是那个试图缓和的人。",reverse:false},
      { id:"en_s36",dimension:"type9",text:"我倾向于看到事情的多面性而不是站队。",reverse:false},
    ] },
    pro: { estimated_time: "10-20分钟", question_count: 72, questions: [] },
  },
};
