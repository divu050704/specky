import React from "react";
import { CheckCircle2, AlertCircle, Info, Award } from "lucide-react";

export const ToastSystem = ({ toasts }) => {
  if (toasts.length === 0) return null;

  return (
    <div className="fixed bottom-6 right-6 z-[999] flex flex-col space-y-3 max-w-sm w-full pointer-events-none select-none">
      {toasts.map((toast) => {
        const { id, message, type } = toast;
        
        let icon = <Info className="w-4 h-4 text-aurora shrink-0" />;
        let borderClass = "border-edge";
        let glowClass = "shadow-[0_0_12px_rgba(26,29,48,0.5)]";

        if (type === "success") {
          icon = <CheckCircle2 className="w-4 h-4 text-pulse shrink-0" />;
          borderClass = "border-pulse/30";
          glowClass = "shadow-[0_0_15px_rgba(0,229,160,0.15)]";
        } else if (type === "error") {
          icon = <AlertCircle className="w-4 h-4 text-red-400 shrink-0" />;
          borderClass = "border-red-500/30";
          glowClass = "shadow-[0_0_15px_rgba(239,68,68,0.15)]";
        } else if (type === "achievement") {
          icon = <Award className="w-4 h-4 text-pulse shrink-0 animate-bounce" />;
          borderClass = "border-aurora/40";
          glowClass = "shadow-[0_0_20px_rgba(108,99,255,0.2)]";
        }

        return (
          <div
            key={id}
            className={`pointer-events-auto flex items-center space-x-3 bg-surface border ${borderClass} ${glowClass} px-4 py-3 rounded-xl text-paper text-xs font-medium animate-slide-up`}
            style={{ backdropFilter: "blur(8px)" }}
          >
            {icon}
            <span className="flex-grow">{message}</span>
          </div>
        );
      })}
    </div>
  );
};
