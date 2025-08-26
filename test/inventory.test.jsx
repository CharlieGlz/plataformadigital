import React from 'react'
import { describe, it, expect } from 'vitest'
import { render, screen, fireEvent } from '@testing-library/react'
import { InventorySection } from '../src/App'

describe('InventorySection', () => {
  it('shows empty table message when no items', () => {
    render(<InventorySection parts={[]} />)
    expect(screen.getByText(/no hay registros/i)).toBeInTheDocument()
  })

  it('shows carousel empty message when mode is carousel and no items', () => {
    render(<InventorySection parts={[]} />)
    const slideBtn = screen.getByRole('button', { name: /slide/i })
    fireEvent.click(slideBtn)
    expect(screen.getByText(/no hay piezas para mostrar/i)).toBeInTheDocument()
  })
})
