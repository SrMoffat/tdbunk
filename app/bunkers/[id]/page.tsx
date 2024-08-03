import React from 'react'

export default function BunkerPage({ params }: { params: { id: string }}) {
  return (
    <div>{`Bunker ${params.id}`}</div>
  )
}
