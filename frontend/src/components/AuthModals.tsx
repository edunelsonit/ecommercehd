import { useState, useEffect } from "react";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

const AuthModals = ({ isOpen, onClose, initialView = "login" }) => {
  const [view, setView] = useState(initialView);

  useEffect(() => {
    if (isOpen) setView(initialView);
  }, [initialView, isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black bg-opacity-60 px-4 backdrop-blur-sm">
      <div className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 z-10"
        >
          <X size={24} />
        </button>

        <div className="max-h-[90vh] overflow-y-auto">
          {view === "login" ? (
            <LoginForm onToggleView={() => setView("register")} />
          ) : (
            <RegisterForm onToggleView={() => setView("login")} />
          )}
        </div>
      </div>
    </div>
  );
};
export default AuthModals;
