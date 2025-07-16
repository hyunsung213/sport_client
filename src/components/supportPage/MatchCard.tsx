import { useState } from "react";
import { IMatchScore, MatchDetail } from "@/utils/interface/match";
import { updateMatch } from "@/utils/update";
import { Badge } from "lucide-react";
import { Input } from "../ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Button } from "../ui/button";
import { calculateTeamLevel, getLevelFromRate } from "@/utils/interface/rate";

// MatchCard 컴포넌트 분리 (선택 사항)
export default function MatchCard({
  match,
  isFinished,
}: {
  match: MatchDetail;
  isFinished: boolean;
}) {
  const [teamAScore, setTeamAScore] = useState<number>(match.teamAScore || 0);
  const [teamBScore, setTeamBScore] = useState<number>(match.teamBScore || 0);
  const [winnerTeam, setWinnerTeam] = useState<string>(match.winnerTeam);
  const [playerOfMatch, setPlayerOfMatch] = useState<number>();
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  const matchId = match.matchId;
  const isMatchAlreadyScored =
    match.teamAScore != null && match.teamBScore != null;
  const isDisabled = isFinished || (!isEditing && isMatchAlreadyScored);

  // 🏆 승리 팀 자동 계산
  const decideWinnerTeam = (aScore: number, bScore: number) => {
    return aScore > bScore ? "TeamA" : "TeamB";
  };

  // 📦 점수 저장용 데이터 생성
  const prepareScoreData = (): IMatchScore => {
    const winner = decideWinnerTeam(teamAScore, teamBScore);
    return {
      matchId,
      teamAScore,
      teamBScore,
      winnerTeam: winner,
      playerOfMatch,
    };
  };

  // 💾 점수 저장 요청
  const handleSaveScore = async () => {
    setIsSaving(true);
    try {
      const data = prepareScoreData();
      await updateMatch(data);
      alert("점수가 저장되었습니다!");
    } catch (error) {
      console.error("저장 실패:", error);
      alert("저장에 실패했습니다.");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div
      key={match.matchId}
      className="p-4 space-y-4 bg-white border rounded-lg shadow-sm"
    >
      <p className="text-lg font-semibold text-gray-700">
        🏸 Match #{match.matchId}
      </p>

      {isMatchAlreadyScored && match.winnerTeam && (
        <div className="mt-4 text-center">
          <span className="inline-block px-3 py-1 text-sm font-semibold text-white bg-purple-600 rounded-full">
            🏆 {match.winnerTeam === "TeamA" ? "Team A 승리" : "Team B 승리"}
          </span>
        </div>
      )}

      <div className="grid items-start grid-cols-3 gap-6 text-center">
        {/* === Team A === */}
        <div>
          <p className="flex items-center justify-center gap-2 text-lg font-bold text-blue-700">
            Team A
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-medium">
              평균{" "}
              {calculateTeamLevel(
                match.TeamA.PlayerA.Rate?.rateValue,
                match.TeamA.PlayerB.Rate?.rateValue
              )}
            </span>
          </p>
          <ul className="mt-2 space-y-1">
            {[match.TeamA.PlayerA, match.TeamA.PlayerB].map((player) => (
              <li
                key={player.userId}
                className="flex items-center justify-center gap-2"
              >
                <span className="font-medium text-gray-800">
                  {player.userName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-semibold">
                  {getLevelFromRate(player.Rate?.rateValue)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-center mt-3">
            <Input
              type="number"
              value={teamAScore}
              onChange={(e) => setTeamAScore(Number(e.target.value))}
              className="text-center w-28"
              placeholder="점수"
              min={0}
              disabled={isDisabled}
            />
          </div>
        </div>

        {/* === VS 가운데 === */}
        <div className="flex items-center justify-center">
          <p className="text-xl font-bold text-gray-500">VS</p>
        </div>

        {/* === Team B === */}
        <div>
          <p className="flex items-center justify-center gap-2 text-lg font-bold text-red-600">
            Team B
            <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-medium">
              평균{" "}
              {calculateTeamLevel(
                match.TeamB.PlayerA.Rate?.rateValue,
                match.TeamB.PlayerB.Rate?.rateValue
              )}
            </span>
          </p>
          <ul className="mt-2 space-y-1">
            {[match.TeamB.PlayerA, match.TeamB.PlayerB].map((player) => (
              <li
                key={player.userId}
                className="flex items-center justify-center gap-2"
              >
                <span className="font-medium text-gray-800">
                  {player.userName}
                </span>
                <span className="text-xs px-2 py-0.5 rounded-full bg-orange-100 text-orange-800 font-semibold">
                  {getLevelFromRate(player.Rate?.rateValue)}
                </span>
              </li>
            ))}
          </ul>
          <div className="flex justify-center mt-3">
            <Input
              type="number"
              value={teamBScore}
              onChange={(e) => setTeamBScore(Number(e.target.value))}
              className="text-center w-28"
              placeholder="점수"
              min={0}
              disabled={isDisabled}
            />
          </div>
        </div>
      </div>

      {/* === Player of the Match === */}
      <div>
        <p className="mb-1 font-medium text-gray-700">🏅 Player of the Match</p>
        <Select
          onValueChange={(value) => setPlayerOfMatch(Number(value))}
          disabled={isDisabled}
        >
          <SelectTrigger className="w-full">
            <SelectValue placeholder="선수를 선택하세요" />
          </SelectTrigger>
          <SelectContent>
            {[
              match.TeamA.PlayerA,
              match.TeamA.PlayerB,
              match.TeamB.PlayerA,
              match.TeamB.PlayerB,
            ].map((player) => (
              <SelectItem key={player.userId} value={String(player.userId)}>
                {player.userName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {!isFinished && (
        <Button
          onClick={() => {
            if (!isMatchAlreadyScored) {
              handleSaveScore(); // 점수 저장
            } else if (!isEditing) {
              setIsEditing(true); // 수정 모드 진입
            } else {
              handleSaveScore(); // 수정 저장
              setIsEditing(false); // 수정 모드 종료
            }
          }}
          className={`w-full px-4 py-2 mt-4 font-semibold rounded-md 
      ${
        isSaving
          ? "bg-gray-400 text-white"
          : isEditing
          ? "bg-green-600 hover:bg-green-700 text-white"
          : "bg-gray-200 hover:bg-gray-300 text-gray-800"
      }`}
          disabled={isSaving}
        >
          {isSaving
            ? "저장 중..."
            : !isMatchAlreadyScored
            ? "점수 저장"
            : isEditing
            ? "수정 저장"
            : "수정하기"}
        </Button>
      )}
    </div>
  );
}
