import { Mail, Lock } from "lucide-react";

interface AuthFormProps {
  onToggleView: () => void;
}

const LoginForm: React.FC<AuthFormProps> = ({ onToggleView }) => {



  return (
    <div className="p-8">
      <div className="text-center mb-8">
        <h2 className="text-2xl font-bold">Welcome Back</h2>
        <p className="text-gray-500 text-sm">Login to your account</p>
      </div>
      <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
        <div className="relative">
          <Mail className="absolute left-3 top-3 text-gray-400" size={18} />
          <input type="email" placeholder="Email Address" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg outline-none focus:border-blue-500" />
        </div>
        <div className="relative">
          <Lock className="absolute left-3 top-3 text-gray-400" size={18} />
          <input type="password" placeholder="Password" className="w-full pl-10 pr-4 py-2.5 bg-gray-50 border rounded-lg outline-none focus:border-blue-500" />
        </div>
        <button className="w-full bg-orange-500 text-white font-bold py-3 rounded-lg hover:bg-orange-600 transition">Login</button>
      </form>
      <p className="mt-6 text-center text-sm text-gray-600">
        New to Elvekas? <button onClick={onToggleView} className="text-blue-600 font-bold">Register</button>
      </p>
    </div>
  );
};
export default LoginForm;