// 'Page.js' on the client side
'use client'
import { useEffect } from 'react';
import Master from './components/master';
import JadwalBar from './components/jadwalBar';

export default function Page() {

  return (
    <Master component={<JadwalBar />}>
      Hello
    </Master>
  );
}
