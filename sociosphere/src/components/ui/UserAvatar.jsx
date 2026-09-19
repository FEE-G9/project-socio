import React from "react";
import {
  Flower2,
  Shield,
  Smile,
  Sparkles,
  User,
} from "lucide-react";

export const avatarStyles = [
  { id: "classic", label: "Classic", icon: User, className: "bg-emerald-500 text-white" },
  { id: "smile", label: "Smile", icon: Smile, className: "bg-amber-400 text-amber-950" },
  { id: "nature", label: "Nature", icon: Flower2, className: "bg-teal-500 text-white" },
  { id: "shield", label: "Shield", icon: Shield, className: "bg-blue-500 text-white" },
  { id: "sparkle", label: "Sparkle", icon: Sparkles, className: "bg-violet-500 text-white" },
];

const UserAvatar = ({ user, className = "h-10 w-10", iconSize = 18 }) => {
  const style = avatarStyles.find((item) => item.id === user?.avatarStyle) || avatarStyles[0];
  const Icon = style.icon;

  return (
    <div
      className={`${className} flex items-center justify-center rounded-full ${style.className}`}
      aria-label={`${style.label} avatar`}
    >
      <Icon size={iconSize} strokeWidth={2.2} />
    </div>
  );
};

export default UserAvatar;
