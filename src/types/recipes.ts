export type Recipe = {
    id: string;
    title: string;
    ingredients: string[];
    instructions: string[];
    prepTime: number; // in minutes
    servings: number;
    difficulty: 'easy' | 'medium' | 'hard';
    image?: string; // base64 encoded image
    createdAt: string;
    createdBy: string;
    createdByName: string;
  };
  
  export type SavedRecipe = Recipe & {
    savedAt: string;
  };