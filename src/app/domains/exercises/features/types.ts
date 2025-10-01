export type FillGapsItem = {
    prompt: string;
    answer: string | string[];
    hint?: string;
    wrongMessage?: string;
  };
  
  export type ChooseDefinitionItem = {
    word: string;
    options: string[];
    correctIndex: number;
    hint?: string;
    wrongMessage?: string;
  };
  
  export type TranslateItem = {
    source: string;
    target: string | string[];
    hint?: string;
    wrongMessage?: string;
  };
  
// src/app/domains/exercise/features/types.ts
export type ExerciseData = {
  fillGaps: FillGapsItem[];
  chooseDefinition: ChooseDefinitionItem[];
  translate: TranslateItem[];
};
