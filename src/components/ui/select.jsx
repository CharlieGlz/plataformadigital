import React from "react";
export function Select({ value, onChange, children }) {
  return <select value={value} onChange={onChange}>{children}</select>;
}
export function SelectTrigger({ children, className }) {
  return <span className={className}>{children}</span>;
}
export function SelectValue({ placeholder }) { return <>{placeholder}</>; }
export function SelectContent({ children }) { return <>{children}</>; }
export function SelectItem({ value, children }) { return <option value={value}>{children}</option>; }
