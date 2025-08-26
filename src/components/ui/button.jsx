import React from "react";
export function Button({ children, onClick, className = "", disabled, size, variant }) {
  return <button className={className + (disabled?" opacity-50 cursor-not-allowed":"")} onClick={onClick} disabled={disabled}>{children}</button>;
}
