import React, { useState, useEffect } from "react";
import { X } from "lucide-react";
import LoginForm from "./LoginForm";
import RegisterForm from "./RegisterForm";

interface AuthModalsProps {
  isOpen: boolean;
  onClose: () => void;
  initialView?: "login" | "register";
}

const AuthModals: React.FC<AuthModalsProps> = ({ isOpen, onClose, initialView = "login" }) => {
  // 1. Set the initial state directly from props. 
  // Because of the 'key' trick below, this will re-run when the modal opens.
  const [view, setView] = useState(initialView);

  // 2. Keep the effect ONLY for side effects (the DOM scroll lock)
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => { document.body.style.overflow = "unset"; };
  }, [isOpen]);

  if (!isOpen) return null;

  const handleBackdropClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) onClose();
  };

  return (
    <div 
      className="fixed inset-0 z-[100] flex items-center justify-center bg-black/60 px-4 backdrop-blur-sm"
      onClick={handleBackdropClick}
      // 3. THE KEY TRICK: Whenever the modal opens or the view type changes, 
      // React treats this as a brand-new component and resets the 'view' state.
      key={`${isOpen}-${initialView}`}
    >
      <div 
        className="bg-white w-full max-w-md rounded-2xl overflow-hidden shadow-2xl relative"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute right-4 top-4 text-gray-400 hover:text-gray-900 z-10 p-1 hover:bg-gray-100 rounded-full transition-colors"
        >
          <X size={20} />
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