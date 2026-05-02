import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";
import ForgotPasswordForm from "./ForgotPassword";

interface AuthModalsProps {
  isOpen: boolean;
  onClose: () => void;
  onBack?: () => void; // Optional prop for going back to login from forgot password
  initialView?: "login" | "register" | "forgot";
}

const AuthModals: React.FC<AuthModalsProps> = ({
  isOpen,
  onClose,
  initialView = "login",
}) => {
  // Initialize state from props
  const [view, setView] = useState(initialView);

  // Handle Body Scroll Lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      // Re-mounts the modal content when it opens, ensuring state resets to initialView
      key={`modal-${isOpen}`}
    >
      <div
        className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative animate-in fade-in zoom-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 z-10 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
        </button>

        <div className="max-h-[90vh] overflow-y-auto">
          {/* View Switcher */}
          {view === "login" && (
            <LoginForm
              onToggleView={() => setView("register")}
              onForgotPassword={() => setView("forgot")}
              onClose={onClose} // Fixed: changed from closeModal to onClose
            />
          )}

          {view === "register" && (
            <RegisterForm
              onToggleView={() => setView("login")}
              onClose={onClose} // Fixed: changed from closeModal to onClose
            />
          )}

          {view === "forgot" && (
            <ForgotPasswordForm onToggleView={() => setView("login")}
              onBack={() => setView("login")} 
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModals;