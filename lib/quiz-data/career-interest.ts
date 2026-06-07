import type { QuizModule } from "../quiz-types";
export const CAREER_INTEREST_LAB: QuizModule = {
  module_id: "career_interest_lab", module_name: "霍兰德职业兴趣实验室",
  description: "基于六类职业兴趣倾向，帮你理解自己更容易被什么类型的任务、环境和协作方式吸引。不是告诉你'该做什么工作'，而是让你看到自己的兴趣模式。",
  disclaimer: "本测试用于娱乐和自我观察，不构成职业咨询或临床诊断。",
  dimensions: [
    { id:"R",name:"现实型",description:"动手操作、具体任务",highLabel:"",lowLabel:"",highInterpretation:"你偏好看得见摸得着的任务。动手操作、搭建、调试这类事让你有掌控感。优势在于务实、直接，盲点是可能对纯抽象或纯社交的工作缺乏耐心。",lowInterpretation:""},
    { id:"I",name:"研究型",description:"分析、研究、找规律",highLabel:"",lowLabel:"",highInterpretation:"你被'搞明白'这件事本身吸引。分析问题、找规律、研究原因是你的默认模式。优势在于深入、严谨，盲点是可能过于沉浸而忽略实际落地。",lowInterpretation:""},
    { id:"A",name:"艺术型",description:"创意、表达、审美",highLabel:"",lowLabel:"",highInterpretation:"你对写作、设计、表达、创意呈现比较有感觉。不喜欢太僵硬的框架。优势在于独特视角和创造力，盲点是可能在需要严格流程的环境中感到压抑。",lowInterpretation:""},
    { id:"S",name:"社会型",description:"助人、合作、回应需求",highLabel:"",lowLabel:"",highInterpretation:"如果一件事能对人产生直接帮助，你会更有动力。优势在于共情和协作，盲点是可能因过度关注他人而消耗自己。",lowInterpretation:""},
    { id:"E",name:"企业型",description:"推动、说服、组织",highLabel:"",lowLabel:"",highInterpretation:"你对说服、推动、组织、带动别人有一定兴趣。不排斥竞争和结果导向。优势在于领导力和执行力，盲点是可能过度追求结果而忽视过程。",lowInterpretation:""},
    { id:"C",name:"常规型",description:"秩序、流程、准确",highLabel:"",lowLabel:"",highInterpretation:"你做事时会在意规则、流程、秩序和准确性。相比开放模糊的任务，更喜欢标准明确的工作。优势在于可靠和细致，盲点是可能在需要灵活应变时感到不适。",lowInterpretation:""},
  ],
  crossBridges: [
    { conditions:[{moduleId:"career_interest_lab",dimension:"I",threshold:"high"},{moduleId:"career_interest_lab",dimension:"A",threshold:"high"}],insight:"研究型+艺术型的组合意味着你既想搞明白，也想表达出来。",recommendModule:"cognitive_style_lab",recommendReason:"如果你想看自己的思维和表达方式，可以接着做认知风格模块。"},
  ],
  versions: {
    quick: { estimated_time:"3-5分钟",question_count:12,questions:[
      {id:"ri_q1",dimension:"R",text:"我对动手操作、修理、搭建、调试具体事物有兴趣。",reverse:false},
      {id:"ri_q2",dimension:"R",text:"比起纯聊天或纯想法，我更喜欢看得见摸得着的任务。",reverse:false},
      {id:"ri_q3",dimension:"I",text:"我喜欢分析问题、找规律、研究原因。",reverse:false},
      {id:"ri_q4",dimension:"I",text:"面对复杂问题，我会被'搞明白'这件事本身吸引。",reverse:false},
      {id:"ri_q5",dimension:"A",text:"我对写作、设计、表达、创意呈现比较有感觉。",reverse:false},
      {id:"ri_q6",dimension:"A",text:"我不喜欢太僵硬死板的框架，更偏爱有创造空间的任务。",reverse:false},
      {id:"ri_q7",dimension:"S",text:"我愿意理解别人、帮助别人、回应别人的需求。",reverse:false},
      {id:"ri_q8",dimension:"S",text:"如果一件事能对人产生直接帮助，我会更有动力。",reverse:false},
      {id:"ri_q9",dimension:"E",text:"我对说服、推动、组织、带动别人有一定兴趣。",reverse:false},
      {id:"ri_q10",dimension:"E",text:"我不排斥竞争、目标压力和结果导向的场景。",reverse:false},
      {id:"ri_q11",dimension:"C",text:"我做事时会在意规则、流程、秩序和准确性。",reverse:false},
      {id:"ri_q12",dimension:"C",text:"相比开放模糊的任务，我更喜欢标准明确的工作。",reverse:false},
    ]},
    standard: { estimated_time:"6-10分钟",question_count:30,questions:[
      {id:"ri_s01",dimension:"R",text:"我对动手操作、修理、搭建、调试具体事物有兴趣。",reverse:false},{id:"ri_s02",dimension:"R",text:"比起纯聊天或纯想法，我更喜欢看得见摸得着的任务。",reverse:false},{id:"ri_s03",dimension:"R",text:"使用工具或设备解决问题让我有成就感。",reverse:false},{id:"ri_s04",dimension:"R",text:"户外或动手的工作环境比办公室更吸引我。",reverse:false},{id:"ri_s05",dimension:"R",text:"我更喜欢通过实际操作而不是阅读来学习新东西。",reverse:false},
      {id:"ri_s06",dimension:"I",text:"我喜欢分析问题、找规律、研究原因。",reverse:false},{id:"ri_s07",dimension:"I",text:"面对复杂问题，我会被搞明白这件事本身吸引。",reverse:false},{id:"ri_s08",dimension:"I",text:"独立研究一个问题比在团队中讨论更让我专注。",reverse:false},{id:"ri_s09",dimension:"I",text:"我对数据、实验和逻辑推理有天然兴趣。",reverse:false},{id:"ri_s10",dimension:"I",text:"看到问题时我的第一反应是找出根本原因。",reverse:false},
      {id:"ri_s11",dimension:"A",text:"我对写作、设计、表达、创意呈现比较有感觉。",reverse:false},{id:"ri_s12",dimension:"A",text:"我不喜欢太僵硬死板的框架，更偏爱有创造空间的任务。",reverse:false},{id:"ri_s13",dimension:"A",text:"我会被美的、独特的或有感染力的事物吸引。",reverse:false},{id:"ri_s14",dimension:"A",text:"重复性的标准化工作让我感到压抑。",reverse:false},{id:"ri_s15",dimension:"A",text:"我更看重作品的独特性而不是它的实用价值。",reverse:false},
      {id:"ri_s16",dimension:"S",text:"我愿意理解别人、帮助别人、回应别人的需求。",reverse:false},{id:"ri_s17",dimension:"S",text:"如果一件事能对人产生直接帮助，我会更有动力。",reverse:false},{id:"ri_s18",dimension:"S",text:"我比较擅长察觉别人的情绪和需求。",reverse:false},{id:"ri_s19",dimension:"S",text:"帮助别人解决问题让我觉得自己的工作有意义。",reverse:false},{id:"ri_s20",dimension:"S",text:"我更喜欢团队合作而不是单打独斗。",reverse:false},
      {id:"ri_s21",dimension:"E",text:"我对说服、推动、组织、带动别人有一定兴趣。",reverse:false},{id:"ri_s22",dimension:"E",text:"我不排斥竞争、目标压力和结果导向的场景。",reverse:false},{id:"ri_s23",dimension:"E",text:"在团队中我通常是发起或推动事情的那个人。",reverse:false},{id:"ri_s24",dimension:"E",text:"我享受完成任务和达成目标的快感。",reverse:false},{id:"ri_s25",dimension:"E",text:"我不介意承担风险来换取更大的回报。",reverse:false},
      {id:"ri_s26",dimension:"C",text:"我做事时会在意规则、流程、秩序和准确性。",reverse:false},{id:"ri_s27",dimension:"C",text:"相比开放模糊的任务，我更喜欢标准明确的工作。",reverse:false},{id:"ri_s28",dimension:"C",text:"我会因为数据不准确或流程混乱而感到烦躁。",reverse:false},{id:"ri_s29",dimension:"C",text:"整理和分类信息对我来说是舒服的事。",reverse:false},{id:"ri_s30",dimension:"C",text:"我很注重细节，能发现别人忽略的小问题。",reverse:false},
    ] },
    pro: { estimated_time:"10-20分钟",question_count:60,questions:[] },
  },
};
