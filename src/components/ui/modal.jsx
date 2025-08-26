import React from 'react';

export function Modal({ open, onClose, title, children }){
  if(!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      <div className="absolute inset-0 bg-black/40" onClick={onClose}></div>
      <div className="relative z-10 w-full max-w-2xl mx-4">
        <div className="bg-white rounded-xl shadow-xl overflow-hidden">
          <div className="flex items-center justify-between px-4 py-3 border-b">
            <div className="text-lg font-semibold">{title}</div>
            <button className="text-slate-500 hover:text-slate-700" onClick={onClose}>Cerrar</button>
          </div>
          <div className="p-4">
            {children}
          </div>
        </div>
      </div>
    </div>
  )
}
