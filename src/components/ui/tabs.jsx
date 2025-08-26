import React, { useState } from "react";
export function Tabs({ children, defaultValue, className }) {
  const [value, setValue] = useState(defaultValue);
  return <div className={className}>{React.Children.map(children, child => {
    if (!child) return null;
    if (child.type === TabsList) return React.cloneElement(child, { current:value, onChange:setValue });
    if (child.type === TabsContent) return child.props.value===value? child : null;
    return child;
  })}</div>;
}
export function TabsList({ children, current, onChange, className }) {
  return <div className={className}>{React.Children.map(children, child => {
    if (!child) return null;
    if (child.type === TabsTrigger) return React.cloneElement(child, { current, onChange });
    return child;
  })}</div>;
}
export function TabsTrigger({ children, value, current, onChange, className }) {
  const active = current===value;
  return <button className={className + (active?" font-bold underline":"")} onClick={()=>onChange(value)}>{children}</button>;
}
export function TabsContent({ children, value, className }) { return <div className={className}>{children}</div>; }
