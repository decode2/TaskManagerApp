import LoginForm from "../components/LoginForm";
import useDarkMode from "../hooks/useDarkMode";

export default function LoginPage() {
  useDarkMode();

  return (
    <div className="min-h-screen transition-colors duration-300 bg-gradient-to-br 
                    from-blue-100 to-blue-300 
                    dark:from-slate-900 dark:to-slate-950 
                    flex items-center justify-center px-4">
      <LoginForm />
    </div>
  );
}
