import type { QuizModule } from "../quiz-types";
import { SOCIAL_ATTACHMENT_STANDARD, SOCIAL_ATTACHMENT_PRO } from "./standard-pro";
export const SOCIAL_ATTACHMENT_LAB: QuizModule = {
  module_id: "social_attachment_lab", module_name: "社交边界与关系风格实验室",
  description: "这个模块看的是你在关系里怎么保护自己、怎么靠近别人、怎么撤退。不是把你放进'安全型/焦虑型/回避型'的旧框里，而是用更组合式的方式理解你的关系风格。",
  disclaimer: "本测试用于娱乐和自我观察，不构成临床诊断或关系咨询。",
  dimensions: [
    { id:"closeness_need",name:"亲近需求",description:"对稳定、可靠关系的需要程度",highLabel:"高亲近需求",lowLabel:"低亲近需求",highInterpretation:"你其实很需要稳定、可靠、可依赖的关系。优势在于愿意投入和维护关系，盲点是可能在关系中过度妥协或害怕失去。",lowInterpretation:"你不太依赖关系来确认自己的价值。优势在于独立和自足，盲点是可能被误解为不需要别人或冷漠。"},
    { id:"boundary_strength",name:"边界强度",description:"区分自己和他人责任的能力",highLabel:"高边界",lowLabel:"低边界",highInterpretation:"你对'什么是我的事、什么不是我的事'分得比较清楚。优势在于不被过度消耗，盲点是可能在别人需要靠近时显得不容易接近。",lowInterpretation:"你容易不好意思拒绝别人，哪怕其实已经很烦了。优势在于好相处、愿意付出，盲点是可能累积怨气直到突然爆发。"},
    { id:"emotional_labor_tolerance",name:"情绪劳动耐受度",description:"承受他人情绪的容量",highLabel:"高耐受",lowLabel:"低耐受",highInterpretation:"长期接别人的情绪对你来说是明显消耗。你不是不关心，而是知道自己的容量有限。优势在于自我保护的清醒，盲点是可能被误解为不够体贴。",lowInterpretation:"即使别人状态很差你通常也能稳定接住。优势在于可靠和有支撑力，盲点是可能忽视自己的情绪疲劳直到透支。"},
    { id:"conflict_style",name:"冲突风格",description:"面对关系问题时的表达倾向",highLabel:"直接型",lowLabel:"回避型",highInterpretation:"关系里一旦有问题你更倾向直接说出来。优势在于不积压、不阴着，盲点是可能时机和方式不够柔和导致对方防御。",lowInterpretation:"很多时候你宁愿先压着也不想让局面立刻变僵。优势在于维护稳定，盲点在于压抑太久之后可能突然爆发或被误解为无所谓。"},
    { id:"trust_latency",name:"信任延迟",description:"建立信任所需的时间",highLabel:"慢信任",lowLabel:"快信任",highInterpretation:"你通常不会很快完全信任一个人。你要确认安全、稳定、靠谱之后才会真正放松。优势在于谨慎和保护自己，盲点是可能错过一些值得信任的人。",lowInterpretation:"你倾向于先假设对方是善意的。优势在于容易建立初始连接，盲点是可能在信任被辜负后感到受伤。"},
    { id:"withdrawal_tendency",name:"撤退倾向",description:"在关系中感到不适时的撤离倾向",highLabel:"高撤退",lowLabel:"低撤退",highInterpretation:"一旦觉得被消耗、被误解或被冒犯，你会很想撤。这不是逃避——是你的自我保护机制在说'这里不安全'。优势在于能快速止损，盲点是可能在需要坚持的关系中过早退出。",lowInterpretation:"即使关系里不舒服你通常也会继续留在场里慢慢处理。优势在于韧性和包容，盲点是可能在明显不对等的关系中停留过久。"},
  ],
  crossBridges: [
    { conditions:[{moduleId:"social_attachment_lab",dimension:"boundary_strength",threshold:"high"},{moduleId:"social_attachment_lab",dimension:"withdrawal_tendency",threshold:"high"},{moduleId:"social_attachment_lab",dimension:"trust_latency",threshold:"high"}],insight:"高边界+高撤退+慢信任——你的关系风格更像是'先观察、再试探、确认安全才投入'。别人靠太快不一定让你觉得亲近，反而可能先触发防御。",recommendModule:"enneagram_lab",recommendReason:"九型人格可以帮你理解这种关系模式背后的深层动机。"},
  ],
  versions: {
    quick: { estimated_time:"3-5分钟",question_count:12,questions:[
      {id:"sa_q1",dimension:"closeness_need",text:"我其实很需要稳定、可靠、可依赖的关系。",reverse:false},
      {id:"sa_q2",dimension:"closeness_need",text:"别人离我太近时，我有时会本能地想往后退。",reverse:true},
      {id:"sa_q3",dimension:"boundary_strength",text:"我对什么是我的事、什么不是我的事，分得比较清楚。",reverse:false},
      {id:"sa_q4",dimension:"boundary_strength",text:"我容易不好意思拒绝别人，哪怕其实已经很烦了。",reverse:true},
      {id:"sa_q5",dimension:"emotional_labor_tolerance",text:"长期接别人的情绪，会让我明显感到消耗。",reverse:false},
      {id:"sa_q6",dimension:"emotional_labor_tolerance",text:"就算别人状态很差，我通常也能稳定接住而不太受影响。",reverse:true},
      {id:"sa_q7",dimension:"conflict_style",text:"关系里一旦有问题，我更倾向直接说出来。",reverse:false},
      {id:"sa_q8",dimension:"conflict_style",text:"很多时候我宁愿先压着，也不想让局面立刻变僵。",reverse:true},
      {id:"sa_q9",dimension:"trust_latency",text:"我通常不会很快完全信任一个人。",reverse:false},
      {id:"sa_q10",dimension:"trust_latency",text:"我要确认安全、稳定、靠谱之后，才会真正放松下来。",reverse:false},
      {id:"sa_q11",dimension:"withdrawal_tendency",text:"一旦我觉得被消耗、被误解或被冒犯，我会很想撤。",reverse:false},
      {id:"sa_q12",dimension:"withdrawal_tendency",text:"即使关系里不舒服，我通常也会继续留在场里慢慢处理。",reverse:true},
    ]},
    standard: { estimated_time:"6-10分钟",question_count:24,questions:SOCIAL_ATTACHMENT_STANDARD },
    pro: { estimated_time:"10-20分钟",question_count:48,questions:SOCIAL_ATTACHMENT_PRO },
  },
};
