import React from 'react'
import { InventorySection } from '@/App'

export default function InventarioPage(){
  return (
    <div className="mx-auto max-w-7xl px-4 py-6 min-h-0 flex-1">
      <div className="flex items-start justify-between mb-6">
        <div>
          <h2 className="text-3xl font-semibold">Inventario — Piezas</h2>
          <p className="text-sm text-slate-400 mt-1">Listado completo de piezas con búsquedas rápidas y filtros. Haz clic en una fila para ver más detalles.</p>
        </div>

        <div className="flex items-center gap-2">
          <button className="rounded-md bg-[#0f1724] text-white px-3 py-2 text-sm hover:bg-[#0b1220]">Exportar CSV</button>
          <button className="rounded-md border border-slate-700 text-slate-200 px-3 py-2 text-sm bg-slate-800 hover:bg-slate-700">Importar</button>
        </div>
      </div>

  <div className="grid grid-cols-1 gap-4 min-h-0">
        <section>
          <div className="rounded-2xl bg-transparent">
            <InventorySection />
          </div>
        </section>
      </div>
    </div>
  )
}
