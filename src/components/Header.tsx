import Link from "next/link";
import { FaRegUserCircle } from "react-icons/fa";

export default function Header() {
  return (
    <header className="bg-[#E4F4FF] text-black shadow-md w-full">
      <nav className="container flex items-center justify-between px-6 py-3">
        <div className="flex justify-center flex-1">
          <div className="flex items-center space-x-8 text-xl font-bold">
            <Link href="/" className="transition-colors hover:text-blue-600">
              홈
            </Link>
            <Link
              href="/users"
              className="transition-colors hover:text-blue-600"
            >
              배드민턴장 제휴
            </Link>
            <Link
              href="/games"
              className="transition-colors hover:text-blue-600"
            >
              매니저 지원
            </Link>
          </div>
        </div>
        <Link href="/users" className="ml-4">
          <button className="flex items-center gap-3 px-3 py-1 transition-colors bg-white rounded-full shadow hover:bg-blue-100">
            <FaRegUserCircle size={24} />
          </button>
        </Link>
      </nav>
    </header>
  );
}
