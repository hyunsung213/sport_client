import { Game, GameDetail } from "@/utils/interface/game";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { DateTime } from "luxon";

export default function GameInfoCard({ game }: { game?: GameDetail }) {
  const dateTime = DateTime.fromISO(game?.date ?? "");
  const today = DateTime.local().startOf("day");
  const gameDate = DateTime.fromISO(game?.date ?? "").startOf("day");
  const diff = Math.floor(gameDate.diff(today, "days").days);

  return (
    <div className="w-full">
      {/* 우측 정보 카드 */}
      <Card className="p-4 space-y-4 w-72">
        <CardContent className="space-y-2">
          <div className="p-3 space-y-2 border rounded">
            <p className="text-lg font-bold">
              {dateTime.toFormat("yyyy-MM-dd")}
            </p>
            <p>{dateTime.toFormat("HH:mm")}</p>
            <p>
              <span className="text-red-500">{game?.Users.length}</span> /{" "}
              {game?.numOfMember}명
            </p>
            <p className="font-bold text-right text-red-500">
              {diff === 0 ? "D-DAY" : `D-${diff}`}
            </p>
          </div>
          <Button className="w-full">신청하기</Button>
        </CardContent>
      </Card>
    </div>
  );
}
