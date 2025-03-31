import LoginForm from "../components/LoginForm";
import useDarkMode from "../hooks/useDarkMode";

export default function LoginPage() {
  
  return (
    <div
      className="min-h-screen flex items-center justify-center transition-colors duration-300
                bg-gradient-to-br from-blue-100 to-blue-300 
                dark:from-slate-900 dark:to-slate-950"
    >

      <LoginForm />
    </div>
  );
}
