import type { QuizModule, QuizModuleId } from "../quiz-types";
import { BIG_FIVE_LAB } from "./big-five";
import { ENNEAGRAM_LAB } from "./enneagram";
import { CAREER_INTEREST_LAB } from "./career-interest";
import { TYPE_DYNAMICS_LAB } from "./type-dynamics";
import { COGNITIVE_STYLE_LAB } from "./cognitive-style";
import { SOCIAL_ATTACHMENT_LAB } from "./social-attachment";

export const QUIZ_MODULES: Record<QuizModuleId, QuizModule> = {
  big_five_lab: BIG_FIVE_LAB,
  enneagram_lab: ENNEAGRAM_LAB,
  career_interest_lab: CAREER_INTEREST_LAB,
  type_dynamics_lab: TYPE_DYNAMICS_LAB,
  cognitive_style_lab: COGNITIVE_STYLE_LAB,
  social_attachment_lab: SOCIAL_ATTACHMENT_LAB,
};

export const QUIZ_MODULE_LIST = Object.values(QUIZ_MODULES).map((m) => ({
  module_id: m.module_id,
  module_name: m.module_name,
  description: m.description,
}));
