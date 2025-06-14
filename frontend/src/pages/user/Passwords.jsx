import React, { useEffect } from 'react'
import useAuth from '../../services/useAuth'

export default function () {
  const usuario = useAuth('Usuario');
  return (
    <div className='text-4xl p-10 font-mono '>
        <p className='p-10 text-white'>Contraseñas</p>
    </div>
  )
}
