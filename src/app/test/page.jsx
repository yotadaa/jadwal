'use client'
import JadwalForm from '../lihatjadwal/jadwal-form';
import { useState } from 'react';
export default function Home() {
    const [showJadwalForm, setShowJadwalForm] = useState(true);
    return (
        <div>
            <JadwalForm component={{ showJadwalForm, setShowJadwalForm }} />
        </div>
    )
}