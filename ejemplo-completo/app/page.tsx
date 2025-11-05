'use client';

import { useState, useEffect } from 'react';
import styles from './SheetManager.module.css'; 

type RowData = {
  rowIndex: number;
  [key: string]: any;
};

type SheetData = {
  headers: string[];
  data: RowData[];
};

export default function SheetData() {
  const [sheetData, setSheetData] = useState<SheetData | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<'table' | 'json'>('table');
  const [formData, setFormData] = useState<Record<string, string>>({});
  const [editingIndex, setEditingIndex] = useState<number | null>(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('/api/sheets');
      if (!res.ok) {
        const errorResult = await res.json();
        throw new Error(errorResult.details || `API error: ${res.statusText}`);
      }
      const result = await res.json();
      setSheetData(result);
      
      if (result.headers) {
        const initialForm = result.headers.reduce((acc: Record<string, string>, header: string) => {
          acc[header] = '';
          return acc;
        }, {});
        setFormData(initialForm);
      }
      
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error desconocido");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (editingIndex !== null) {
      await handleUpdateRow(editingIndex, formData);
    } else {
      await handleCreateRow(formData);
    }
    const initialForm = sheetData?.headers.reduce((acc: Record<string, string>, header: string) => {
      acc[header] = '';
      return acc;
    }, {}) || {};
    setFormData(initialForm);
    setEditingIndex(null);
  };

  const handleCreateRow = async (rowData: Record<string, string>) => {
    try {
      const res = await fetch('/api/sheets', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(rowData),
      });
      if (!res.ok) throw new Error("Failed to create row");
      fetchData(); 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error creando");
    }
  };
  const handleUpdateRow = async (rowIndex: number, rowData: Record<string, string>) => {
     try {
      const res = await fetch('/api/sheets', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rowIndex, data: rowData }),
      });
      if (!res.ok) throw new Error("Failed to update row");
      fetchData(); 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error actualizando");
    }
  };
  const handleDeleteRow = async (rowIndex: number) => {
    if (!confirm('¿Seguro que deseas eliminar esta fila?')) return;
    try {
      const res = await fetch('/api/sheets', {
        method: 'DELETE',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ rowIndex }),
      });
      if (!res.ok) throw new Error("Failed to delete row");
      fetchData(); 
    } catch (err) {
      setError(err instanceof Error ? err.message : "Error eliminando");
    }
  };

  const startEditing = (row: RowData) => {
    setEditingIndex(row.rowIndex);
    const formDataForEdit = { ...row };
    delete formDataForEdit.rowIndex; 
    setFormData(formDataForEdit);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };
  
  const cancelEditing = () => {
    setEditingIndex(null);
    const initialForm = sheetData?.headers.reduce((acc: Record<string, string>, header: string) => {
      acc[header] = '';
      return acc;
    }, {}) || {};
    setFormData(initialForm);
  };

  if (loading && !sheetData) {
    return <div className={styles.loading}>Cargando datos de Google Sheets...</div>;
  }
  if (error) {
    return <div className={styles.error}>Error: {error}</div>;
  }
  if (!sheetData) {
    return <div className={styles.loading}>No se encontraron datos.</div>;
  }

  const { headers, data } = sheetData;

  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Gestor de Google Sheets</h1>

      <div className={styles.tabContainer}>
        <button 
          onClick={() => setView('table')} 
          className={`${styles.tabButton} ${view === 'table' ? styles.activeTab : ''}`}
        >
          Vista de Tabla
        </button>
        <button 
          onClick={() => setView('json')} 
          className={`${styles.tabButton} ${view === 'json' ? styles.activeTab : ''}`}
        >
          Vista JSON Crudo
        </button>
      </div>

      {view === 'table' && (
        <>
          <form onSubmit={handleSubmit} className={styles.form}>
            <h3 className={styles.subtitle}>{editingIndex !== null ? 'Editando Fila' : 'Añadir Nueva Fila'}</h3>
            <div className={styles.formGrid}>
              {headers.map((header) => (
                <div key={header} className={styles.formGroup}>
                  <label htmlFor={header}>{header}</label>
                  <input
                    type="text"
                    id={header}
                    name={header}
                    value={formData[header] || ''}
                    onChange={handleInputChange}
                    className={styles.input}
                  />
                </div>
              ))}
            </div>
            <div className={styles.formActions}>
              <button type="submit" className={styles.buttonPrimary}>
                {editingIndex !== null ? 'Actualizar Fila' : 'Añadir Fila'}
              </button>
              {editingIndex !== null && (
                <button type="button" onClick={cancelEditing} className={styles.buttonSecondary}>
                  Cancelar Edición
                </button>
              )}
            </div>
          </form>

          <h3>Datos Actuales</h3>
          <div className={styles.tableWrapper}>
            <table className={styles.table}>
              <thead>
                <tr>
                  {headers.map((header) => <th key={header}>{header}</th>)}
                  <th>Acciones</th>
                </tr>
              </thead>
              <tbody>
                {data.length === 0 ? (
                  <tr>
                    <td colSpan={headers.length + 1}>No hay datos para mostrar.</td>
                  </tr>
                ) : (
                  data.map((row) => (
                    <tr key={row.rowIndex}>
                      {headers.map((header) => (
                        <td key={`${row.rowIndex}-${header}`}>{row[header]}</td>
                      ))}
                      <td className={styles.actionButtons}>
                        <button onClick={() => startEditing(row)} className={styles.buttonSecondary}>
                          Editar
                        </button>
                        <button onClick={() => handleDeleteRow(row.rowIndex)} className={styles.buttonDanger}>
                          Eliminar
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {view === 'json' && (
        <>
          <h3 className={styles.subtitle}>JSON Crudo (Solo Lectura)</h3>
          <pre className={styles.jsonPre}>
            {JSON.stringify(sheetData, null, 2)}
          </pre>
        </>
      )}
    </div>
  );
}