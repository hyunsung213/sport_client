import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4">
      <nav className="flex space-x-4">
        <Link href="/">홈</Link>
        <Link href="/users">유저 목록</Link>
        <Link href="/games">게임 목록</Link>
      </nav>
    </header>
  );
}
