export interface Rate {
  rateId: number;
  userId: number;
  rateValue: number;
}

export const LevelRanges = [
  { level: "뉴비", min: 0, max: 499 },
  { level: "D조", min: 500, max: 999 },
  { level: "C조", min: 1000, max: 1999 },
  { level: "B조", min: 2000, max: 2999 },
  { level: "A조", min: 3000, max: 3999 },
  { level: "S조", min: 4000, max: 5000 },
];
