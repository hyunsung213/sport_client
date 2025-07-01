import GameCard from "@/components/mainPage/GameCard";

export default function Home() {
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        height: "100vh",
      }}
    >
      <GameCard />
    </div>
  );
}
