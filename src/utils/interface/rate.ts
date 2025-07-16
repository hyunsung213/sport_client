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

// rate를 조로 바꿔주는 함수
export function getLevelFromRate(rateValue?: number | null): string {
  if (rateValue == null) return "뉴비";
  const level = LevelRanges.find(
    (range) => rateValue >= range.min && rateValue <= range.max
  );
  return level?.level ?? "뉴비"; // fallback
}

// 평균 rate를 계산해주는 함수
export function calculateTeamLevel(rate1: number, rate2: number) {
  if (rate1 < 500 || rate2 < 500) {
    return null;
  }
  const average = Math.round((rate1 + rate2) / 2);
  return average;
}
