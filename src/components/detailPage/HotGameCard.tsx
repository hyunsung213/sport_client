export default function HotGameCard() {
  return (
    <div className="flex items-center justify-center w-full gap-2 p-3 bg-white shadow-md rounded-xl w-fit">
      <img src="/images/badminton.png" className="object-contain w-8 h-8" />
      <span className="text-sm font-semibold text-black">
        강서구에서 가장 관심받는 게임
      </span>
    </div>
  );
}
