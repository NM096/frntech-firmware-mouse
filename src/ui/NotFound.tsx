// src/pages/NotFound.tsx
import { Link } from "react-router-dom";

export default function NotFound() {
  return (
    <div className="flex flex-col justify-center items-center px-4 w-full min-h-screen bg-gray-50">
      <h1 className="mb-4 text-6xl font-bold text-gray-800">404</h1>
      <p className="mb-8 text-lg text-gray-600">抱歉，你访问的页面不存在</p>
      <Link
        to="/"
        className="px-6 py-3 text-white bg-blue-600 rounded transition hover:bg-blue-700"
      >
        返回首页
      </Link>
    </div>
  );
}
