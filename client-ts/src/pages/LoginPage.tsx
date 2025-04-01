import LoginForm from "../components/LoginForm";

export default function LoginPage() {
  return (
    <div
      className="min-h-screen flex items-center justify-center px-4 
        bg-gradient-to-b from-blue-100 to-blue-300 
        dark:from-slate-900 dark:to-slate-950 transition-colors duration-300"
    >
      <LoginForm />
    </div>
  );
}

