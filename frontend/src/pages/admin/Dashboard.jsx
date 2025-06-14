import React, { useEffect } from 'react';
import useAuth from '../../services/useAuth';

export default function Dashboard() { 
  const usuario = useAuth('Admin');
  return (
    <div className='text-4xl p-10 font-mono'>
      <p className='p-10 text-white'>Dashboard</p>
    </div>
  );
}