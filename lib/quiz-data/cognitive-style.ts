import type { QuizModule } from "../quiz-types";
import { COGNITIVE_STYLE_STANDARD, COGNITIVE_STYLE_PRO } from "./standard-pro";
export const COGNITIVE_STYLE_LAB: QuizModule = {
  module_id: "cognitive_style_lab", module_name: "认知风格与表达方式实验室",
  description: "这个是重点模块。它不贴人格标签，而是看你的思维方式本身：抽象还是具体、结构还是发散、快决策还是慢决策、表达是压缩还是延展。这个模块的结果可以直接影响Agent如何回应你。",
  disclaimer: "本测试用于娱乐和自我观察，不构成临床诊断。",
  dimensions: [
    { id:"abstractness",name:"抽象性",description:"从具体事物联想到更大结构的倾向",highLabel:"高抽象",lowLabel:"高具体",highInterpretation:"你经常会从一件小事联想到更大的结构、意义或规律。优势在于能看到别人看不到的联系，盲点是可能'飘'在概念层而忽略执行细节。",lowInterpretation:"你更喜欢讨论具体怎么做。优势在于务实落地，盲点是可能错过一些有价值的抽象洞察。"},
    { id:"expression_structure",name:"表达结构性",description:"组织语言和逻辑的能力",highLabel:"高结构",lowLabel:"低结构",highInterpretation:"你表达时通常会下意识整理逻辑和顺序。优势在于清楚、有条理，盲点是可能在需要直觉性表达时显得'太工整'。",lowInterpretation:"你脑子里有东西但说出来常觉得乱。这不一定是表达差——更像是想法太多导致输出通道拥堵。优势在于有很多东西可以挖掘，盲点是可能让人误解你没想清楚。"},
    { id:"cognitive_branching",name:"思维分叉倾向",description:"从一个点联想到多个方向的能力",highLabel:"高分叉",lowLabel:"低分叉",highInterpretation:"你很容易从一个点想到很多相关的点。优势在于创意和联想力丰富，盲点是可能很难收束、容易跑题或决策困难。",lowInterpretation:"你更习惯一条线想到底。优势在于专注和深入，盲点是可能错过其他有价值的视角。"},
    { id:"reflection_depth",name:"反思深度",description:"反复审视自己的想法和情绪的程度",highLabel:"高反思",lowLabel:"低反思",highInterpretation:"你会反复回看自己的想法、反应和情绪来源。优势在于自我觉察和成长意愿，盲点是可能过度反刍、把简单问题复杂化。",lowInterpretation:"很多事情过去就过去了。优势在于不纠结、行动力强，盲点是可能错过一些需要深度反思的信号。"},
    { id:"decision_latency",name:"决策延迟",description:"做决定前需要的考虑时间",highLabel:"高延迟",lowLabel:"低延迟",highInterpretation:"你经常因为考虑太多可能性而延迟下决定。这不是优柔寡断，是你真的看到了多个维度和后果。优势在于考虑周全，盲点是在需要快速决策时可能卡住。",lowInterpretation:"你通常能比较快做决定。优势在于果断和效率，盲点是可能在信息不足时过早收敛。"},
    { id:"language_density",name:"语言密度",description:"表达时信息的压缩或延展程度",highLabel:"高密度",lowLabel:"高压缩",highInterpretation:"你表达时常常想说得更准确，结果越说越多。优势在于能把事情讲清楚，盲点是可能让听者觉得'太长'。",lowInterpretation:"你通常能用较短的话把复杂意思压缩清楚。优势在于简洁有力，盲点是可能被误解为敷衍或不够认真。"},
  ],
  crossBridges: [
    { conditions:[{moduleId:"cognitive_style_lab",dimension:"abstractness",threshold:"high"},{moduleId:"cognitive_style_lab",dimension:"cognitive_branching",threshold:"high"},{moduleId:"cognitive_style_lab",dimension:"reflection_depth",threshold:"high"}],insight:"高抽象+高分叉+高反思——你大概率是一个'想很多'的人，而且想得比较深。",recommendModule:"social_attachment_lab",recommendReason:"这种思维模式通常也会影响你的社交和关系风格，可以接着做社交边界模块。"},
  ],
  versions: {
    quick: { estimated_time:"3-5分钟",question_count:12,questions:[
      {id:"cs_q1",dimension:"abstractness",text:"我经常会从一件小事联想到更大的结构、意义或规律。",reverse:false},
      {id:"cs_q2",dimension:"abstractness",text:"比起讨论概念，我更愿意直接讨论具体怎么做。",reverse:true},
      {id:"cs_q3",dimension:"expression_structure",text:"我表达时通常会下意识整理逻辑和顺序。",reverse:false},
      {id:"cs_q4",dimension:"expression_structure",text:"我脑子里明明有东西，但一说出来常常变得乱。",reverse:true},
      {id:"cs_q5",dimension:"cognitive_branching",text:"我很容易从一个点想到很多相关的点。",reverse:false},
      {id:"cs_q6",dimension:"cognitive_branching",text:"我更习惯一条线想到底，不太会同时开很多思路。",reverse:true},
      {id:"cs_q7",dimension:"reflection_depth",text:"我会反复回看自己的想法、反应和情绪来源。",reverse:false},
      {id:"cs_q8",dimension:"reflection_depth",text:"很多事情过去就过去了，我一般不会反复想。",reverse:true},
      {id:"cs_q9",dimension:"decision_latency",text:"我经常因为考虑太多可能性而延迟下决定。",reverse:false},
      {id:"cs_q10",dimension:"decision_latency",text:"我通常能比较快做决定，不太会卡在反复权衡里。",reverse:true},
      {id:"cs_q11",dimension:"language_density",text:"我表达时常常想说得更准确，结果越说越多。",reverse:false},
      {id:"cs_q12",dimension:"language_density",text:"我通常能用较短的话把复杂意思压缩清楚。",reverse:true},
    ]},
    standard: { estimated_time:"6-10分钟",question_count:24,questions:COGNITIVE_STYLE_STANDARD },
    pro: { estimated_time:"10-20分钟",question_count:48,questions:COGNITIVE_STYLE_PRO },
  },
};
