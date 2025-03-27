import { Link } from "react-router-dom";

export default function HomePage() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-100 to-blue-300 flex flex-col items-center justify-center px-4 text-gray-800">
      <div className="max-w-4xl w-full text-center">
        <h1 className="text-4xl sm:text-5xl font-bold mb-4">
          Welcome to TaskManagerApp
        </h1>
        <p className="text-lg sm:text-xl mb-8">
          Organize your tasks, manage your projects, and stay productive – all in one place.
        </p>

        <div className="flex justify-center space-x-4 mb-12">
          <Link
            to="/login"
            className="bg-blue-600 text-white px-6 py-3 rounded-md text-lg hover:bg-blue-700 transition"
          >
            Log In
          </Link>
          <Link
            to="/register"
            className="border border-blue-600 text-blue-600 px-6 py-3 rounded-md text-lg hover:bg-blue-100 transition"
          >
            Get Started
          </Link>
        </div>

        <div className="bg-white rounded-lg shadow-lg p-8 text-left">
          <h2 className="text-2xl font-semibold mb-4">Why TaskManagerApp?</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>✔️ Fast and secure task tracking</li>
            <li>✔️ Beautiful and intuitive UI</li>
            <li>✔️ Built with modern web technologies</li>
            <li>✔️ Always accessible from any device</li>
          </ul>
        </div>
      </div>
    </div>
  );
}
