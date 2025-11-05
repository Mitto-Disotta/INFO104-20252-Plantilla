'use client';

import { useState, useEffect } from 'react';

export default function SheetData() {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      try {
        const res = await fetch('/api/sheets');
        if (!res.ok) {
          throw new Error(`API error: ${res.statusText}`);
        }
        const result = await res.json();
        setData(result.data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, []);

  if (loading) return <p>Cargando datos...</p>;

  return (
    <div>
      <h2>Datos de Google Sheets:</h2>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}
