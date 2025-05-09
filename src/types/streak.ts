export type Streak = {
    currentStreak: number;
    longestStreak: number;
    lastActiveDate: string; // ISO date string
    history: {
      [date: string]: boolean; // Date as YYYY-MM-DD
    };
  };