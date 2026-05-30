import React from 'react'

export const Button = ({ label, onClick }: { label: string; onClick: () => void }) => {
  return (
    <button
      className="rounded-full bg-white/10 text-xs px-4 py-2 font-semibold text-white transition hover:bg-white/20"
      onClick={onClick}
    >
      {label}
    </button>
  )
}

export const SubmitButton = ({ label, onClick, type}: { label: string; onClick?: () => void, type?: "submit" | "reset" | "button" | undefined; }) => {
  return (
    <button
      type={type ?? "button"}
      onClick={onClick}
      className="rounded-full whitespace-nowrap bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/80"
    >
      {label}
    </button>
  )
}
