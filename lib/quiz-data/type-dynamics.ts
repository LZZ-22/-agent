import type { QuizModule } from "../quiz-types";
export const TYPE_DYNAMICS_LAB: QuizModule = {
  module_id: "type_dynamics_lab", module_name: "16型人格/认知偏好实验室",
  description: "基于信息加工偏好与决策倾向的16型娱乐测评。它看的是你更习惯怎么接收信息、怎么判断、怎么安排生活——不是能力等级，是偏好倾向。结果会受环境和阶段影响，不是一成不变的标签。",
  disclaimer: "本测试用于娱乐和自我观察，不构成临床诊断。这不是MBTI官方工具。",
  dimensions: [
    { id:"EI",name:"外向/内向",description:"能量来源和注意力方向",highLabel:"偏外向(E)",lowLabel:"偏内向(I)",highInterpretation:"你更习惯边说边想，和人互动通常让你更快进入状态。优势在于活跃、善于连接，盲点是可能需要在独处中找到平衡。",lowInterpretation:"很多事情你需要先在心里过一遍才愿意表达。你不是没社交能力，而是需要把能量收回来才能处理信息。优势在于深思熟虑，盲点是可能被误解为冷淡或犹豫。"},
    { id:"SN",name:"感觉/直觉",description:"信息获取方式",highLabel:"偏直觉(N)",lowLabel:"偏感觉(S)",highInterpretation:"你经常会先看到趋势、隐含意义和可能性。抽象联系和模式感对你来说更敏感。优势在于大局观和创意，盲点是可能忽略实际细节。",lowInterpretation:"你更相信清楚、具体、已经发生过的东西。一步一个脚印是你的节奏。优势在于务实和可靠，盲点是可能在需要想象力的场景中感到受限。"},
    { id:"TF",name:"思考/情感",description:"判断和决策方式",highLabel:"偏思考(T)",lowLabel:"偏情感(F)",highInterpretation:"你做判断时更先看是否合理、是否一致。如果必须二选一，你更愿意保留正确而不是和气。优势在于逻辑和公正，盲点是可能被误解为冷漠。",lowInterpretation:"你做判断时会很在意人会不会因此受伤或失衡。即使结论没错，你也会在意表达方式。优势在于共情和维护关系，盲点是可能在需要强硬决策时犹豫。"},
    { id:"JP",name:"判断/感知",description:"生活方式和节奏偏好",highLabel:"偏判断(J)",lowLabel:"偏感知(P)",highInterpretation:"你更喜欢事情有清楚安排，而不是一直悬着。一旦定下来你会希望尽快推进。优势在于执行力，盲点是可能对计划外变化感到焦虑。",lowInterpretation:"你更喜欢边走边看，保留调整空间。过早定死安排会让你觉得被束住。优势在于灵活和适应力，盲点是可能拖延或难以收束。"},
  ],
  crossBridges: [
    { conditions:[{moduleId:"type_dynamics_lab",dimension:"SN",threshold:"high"},{moduleId:"type_dynamics_lab",dimension:"TF",threshold:"high"}],insight:"NT组合——抽象思维+逻辑判断，意味着你习惯用概念和结构理解世界。",recommendModule:"cognitive_style_lab",recommendReason:"认知风格模块可以帮你进一步看清自己的思维模式。"},
  ],
  versions: {
    quick: { estimated_time:"3-5分钟",question_count:16,questions:[
      {id:"td_q1",dimension:"EI",key:"E",text:"我更习惯边说边想，而不是想好再说。",reverse:false},
      {id:"td_q2",dimension:"EI",key:"I",text:"很多事情我需要先在心里过一遍，才愿意表达。",reverse:false},
      {id:"td_q3",dimension:"EI",key:"E",text:"和人互动通常会让我更快进入状态。",reverse:false},
      {id:"td_q4",dimension:"EI",key:"I",text:"连续社交后，我通常需要独处恢复。",reverse:false},
      {id:"td_q5",dimension:"SN",key:"S",text:"我更相信清楚、具体、已经发生过的东西。",reverse:false},
      {id:"td_q6",dimension:"SN",key:"N",text:"我经常会先看到趋势、隐含意义和可能性。",reverse:false},
      {id:"td_q7",dimension:"SN",key:"S",text:"我偏好一步一步、落到细节的说明。",reverse:false},
      {id:"td_q8",dimension:"SN",key:"N",text:"我对抽象联系和模式感更敏感。",reverse:false},
      {id:"td_q9",dimension:"TF",key:"T",text:"我做判断时更先看是否合理、是否一致。",reverse:false},
      {id:"td_q10",dimension:"TF",key:"F",text:"我做判断时会很在意人会不会因此受伤或失衡。",reverse:false},
      {id:"td_q11",dimension:"TF",key:"T",text:"如果必须二选一，我更愿意保留正确而不是和气。",reverse:false},
      {id:"td_q12",dimension:"TF",key:"F",text:"就算结论没错，我也会在意表达方式是否合适。",reverse:false},
      {id:"td_q13",dimension:"JP",key:"J",text:"我更喜欢事情有清楚安排，而不是一直悬着。",reverse:false},
      {id:"td_q14",dimension:"JP",key:"P",text:"我更喜欢边走边看，保留调整空间。",reverse:false},
      {id:"td_q15",dimension:"JP",key:"J",text:"任务一旦定下来，我会希望尽快推进到明确状态。",reverse:false},
      {id:"td_q16",dimension:"JP",key:"P",text:"过早定死安排会让我觉得被束住。",reverse:false},
    ]},
    standard: { estimated_time:"6-10分钟",question_count:32,questions:[
      {id:"td_s01",dimension:"EI",key:"E",text:"我更习惯边说边想，而不是想好再说。",reverse:false},{id:"td_s02",dimension:"EI",key:"I",text:"很多事情我需要先在心里过一遍，才愿意表达。",reverse:false},{id:"td_s03",dimension:"EI",key:"E",text:"和人互动通常会让我更快进入状态。",reverse:false},{id:"td_s04",dimension:"EI",key:"I",text:"连续社交后，我通常需要独处恢复。",reverse:false},{id:"td_s05",dimension:"EI",key:"E",text:"我更喜欢团队工作而不是独立工作。",reverse:false},{id:"td_s06",dimension:"EI",key:"I",text:"一个人工作时我的效率更高。",reverse:false},{id:"td_s07",dimension:"EI",key:"E",text:"我在会议上通常是活跃发言的人。",reverse:false},{id:"td_s08",dimension:"EI",key:"I",text:"我倾向于先听完所有人的观点再发表自己的。",reverse:false},
      {id:"td_s09",dimension:"SN",key:"S",text:"我更相信清楚、具体、已经发生过的东西。",reverse:false},{id:"td_s10",dimension:"SN",key:"N",text:"我经常会先看到趋势、隐含意义和可能性。",reverse:false},{id:"td_s11",dimension:"SN",key:"S",text:"我偏好一步一步、落到细节的说明。",reverse:false},{id:"td_s12",dimension:"SN",key:"N",text:"我对抽象联系和模式感更敏感。",reverse:false},{id:"td_s13",dimension:"SN",key:"S",text:"我更信任经验而不是直觉。",reverse:false},{id:"td_s14",dimension:"SN",key:"N",text:"我经常能在看似无关的信息中发现联系。",reverse:false},{id:"td_s15",dimension:"SN",key:"S",text:"我不喜欢过于模糊或不确定的计划。",reverse:false},{id:"td_s16",dimension:"SN",key:"N",text:"想象力比实操技能对我来说更重要。",reverse:false},
      {id:"td_s17",dimension:"TF",key:"T",text:"我做判断时更先看是否合理、是否一致。",reverse:false},{id:"td_s18",dimension:"TF",key:"F",text:"我做判断时会很在意人会不会因此受伤或失衡。",reverse:false},{id:"td_s19",dimension:"TF",key:"T",text:"如果必须二选一，我更愿意保留正确而不是和气。",reverse:false},{id:"td_s20",dimension:"TF",key:"F",text:"就算结论没错，我也会在意表达方式是否合适。",reverse:false},{id:"td_s21",dimension:"TF",key:"T",text:"批评时我更看重准确性而不是语气。",reverse:false},{id:"td_s22",dimension:"TF",key:"F",text:"做决定时我会考虑对相关人员的影响。",reverse:false},{id:"td_s23",dimension:"TF",key:"T",text:"在辩论中我更看重逻辑而非情感诉求。",reverse:false},{id:"td_s24",dimension:"TF",key:"F",text:"维持和谐有时比坚持自己的观点更重要。",reverse:false},
      {id:"td_s25",dimension:"JP",key:"J",text:"我更喜欢事情有清楚安排，而不是一直悬着。",reverse:false},{id:"td_s26",dimension:"JP",key:"P",text:"我更喜欢边走边看，保留调整空间。",reverse:false},{id:"td_s27",dimension:"JP",key:"J",text:"任务一旦定下来，我会希望尽快推进到明确状态。",reverse:false},{id:"td_s28",dimension:"JP",key:"P",text:"过早定死安排会让我觉得被束住。",reverse:false},{id:"td_s29",dimension:"JP",key:"J",text:"我需要明确的截止日期才能高效工作。",reverse:false},{id:"td_s30",dimension:"JP",key:"P",text:"计划赶不上变化，我宁愿保持弹性。",reverse:false},{id:"td_s31",dimension:"JP",key:"J",text:"完成一件事带来的满足感对我很重要。",reverse:false},{id:"td_s32",dimension:"JP",key:"P",text:"我对最后时刻的灵感爆发比较依赖。",reverse:false},
    ] },
    pro: { estimated_time:"10-20分钟",question_count:64,questions:[] },
  },
};
