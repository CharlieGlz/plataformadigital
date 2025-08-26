import React from 'react'
import { InventorySection } from '@/App'

export default function InventarioPage(){
  return (
    <div className="mx-auto max-w-7xl px-4 py-6">
      <h2 className="text-2xl font-semibold mb-4">Inventario — Página dedicada</h2>
      <div className="rounded-2xl bg-transparent">
        <InventorySection />
      </div>
    </div>
  )
}
