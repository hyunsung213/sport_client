"use client";

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { GameDetail } from "@/utils/interface/game";
import { updateIsConfirm } from "@/utils/update";

export default function PayModal({
  open,
  game,
  onClose,
}: {
  open: boolean;
  game?: GameDetail;
  onClose: () => void;
}) {
  const router = useRouter();
  const handlePayment = async (gameId?: number) => {
    // TODO: 실제 결제 연동 또는 결제 완료 API 호출
    if (gameId) {
      await updateIsConfirm(gameId);
    }
    alert("결제가 완료되었습니다!");
    router.push("/"); // 완료 후 리다이렉션
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>결제하기</DialogTitle>
        </DialogHeader>

        <div className="space-y-2 text-sm text-gray-700">
          <p>🎮 게임 이름: 번개 배드민턴 매치</p>
          <p>📅 날짜: 2025-08-01 19:00</p>
          <p>💰 가격: {game?.cost}원</p>
        </div>

        <DialogFooter className="flex justify-end gap-2 pt-4">
          <Button variant="ghost" onClick={onClose}>
            취소
          </Button>
          <Button onClick={() => handlePayment(game?.gameId)}>결제하기</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
