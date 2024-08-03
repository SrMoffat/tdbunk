import React, { PropsWithChildren } from 'react'
import { BunkerContextProvider } from '@/app/contexts'


export default function CursorsContainer({ children }: PropsWithChildren) {


  return (
      <BunkerContextProvider>
        {children}
      </BunkerContextProvider>
  )
}
