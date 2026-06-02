import { useState } from 'react';
import { Table, Download, ChevronLeft, ChevronRight } from 'lucide-react';
import type { ResumenDia } from '../types';

interface SimulationTableProps {
  data: ResumenDia[];
}

const ROWS_PER_PAGE = 10;

export default function SimulationTable({ data }: SimulationTableProps) {
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(data.length / ROWS_PER_PAGE);
  const paged = data.slice(page * ROWS_PER_PAGE, (page + 1) * ROWS_PER_PAGE);

  const fmt = (n: number, d = 2) => n.toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d });
  const fmtInt = (n: number) => n.toLocaleString('es-AR');

  const handleExportCSV = () => {
    const headers = [
      'Día', 'Desmantelamiento', 'CRT', 'LCD', 'LED', 'Refurbishment', 'Descartados',
      'Peso (kg)', 'Peso Tóxico (kg)', 'Costo Tóxico ($)', 'Cobre (kg)', 'Oro (kg)',
      'Plata (kg)', 'PCB (kg)', 'Ingresos ($)', 'Costos ($)', 'Ganancia ($)',
    ];
    const rows = data.map((d) => [
      d.dia, d.totalDesmantelamiento, d.totalCRT, d.totalLCD, d.totalLED,
      d.totalRefurbishment, d.totalDescartados, d.pesoTotalKg.toFixed(2),
      d.pesoToxiKg.toFixed(2), d.costoDisposicionToxico.toFixed(2),
      d.totalCobreKG.toFixed(4), d.totalOroKG.toFixed(6), d.totalPlataKG.toFixed(6),
      d.totalPCBKg.toFixed(4), d.ingresosDia.toFixed(2), d.costosDia.toFixed(2),
      d.gananciaDia.toFixed(2),
    ]);
    const csv = [headers.join(','), ...rows.map((r) => r.join(','))].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `simulacion_resultados.csv`;
    a.click();
    URL.revokeObjectURL(url);
  };

  return (
    <div className="table-section animate-in">
      <div className="table-section__header">
        <div className="table-section__title">
          <Table size={20} style={{ color: '#818cf8' }} />
          Detalle Diario de la Simulación
        </div>
        <button className="btn btn--secondary" onClick={handleExportCSV} id="export-csv-btn">
          <Download size={14} />
          Exportar CSV
        </button>
      </div>

      <div className="table-wrapper">
        <table className="data-table" id="simulation-table">
          <thead>
            <tr>
              <th>Día</th>
              <th>Desmant.</th>
              <th>CRT</th>
              <th>LCD</th>
              <th>LED</th>
              <th>Refurb.</th>
              <th>Descart.</th>
              <th>Peso (kg)</th>
              <th>Tóxico (kg)</th>
              <th>Cobre (kg)</th>
              <th>Oro (kg)</th>
              <th>Plata (kg)</th>
              <th>Ingresos ($)</th>
              <th>Costos ($)</th>
              <th>Ganancia ($)</th>
            </tr>
          </thead>
          <tbody>
            {paged.map((d) => (
              <tr key={d.dia}>
                <td>{d.dia}</td>
                <td>{fmtInt(d.totalDesmantelamiento)}</td>
                <td>{fmtInt(d.totalCRT)}</td>
                <td>{fmtInt(d.totalLCD)}</td>
                <td>{fmtInt(d.totalLED)}</td>
                <td>{fmtInt(d.totalRefurbishment)}</td>
                <td>{fmtInt(d.totalDescartados)}</td>
                <td>{fmt(d.pesoTotalKg)}</td>
                <td>{fmt(d.pesoToxiKg)}</td>
                <td>{fmt(d.totalCobreKG, 4)}</td>
                <td>{fmt(d.totalOroKG, 6)}</td>
                <td>{fmt(d.totalPlataKG, 6)}</td>
                <td style={{ color: '#34d399' }}>{fmt(d.ingresosDia)}</td>
                <td style={{ color: '#fb7185' }}>{fmt(d.costosDia)}</td>
                <td style={{ color: d.gananciaDia >= 0 ? '#34d399' : '#fb7185', fontWeight: 600 }}>
                  {fmt(d.gananciaDia)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination__btn"
            onClick={() => setPage((p) => Math.max(0, p - 1))}
            disabled={page === 0}
            id="pagination-prev"
          >
            <ChevronLeft size={16} />
          </button>
          {Array.from({ length: totalPages }, (_, i) => (
            <button
              key={i}
              className={`pagination__btn ${i === page ? 'pagination__btn--active' : ''}`}
              onClick={() => setPage(i)}
              id={`pagination-${i}`}
            >
              {i + 1}
            </button>
          ))}
          <button
            className="pagination__btn"
            onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
            disabled={page === totalPages - 1}
            id="pagination-next"
          >
            <ChevronRight size={16} />
          </button>
        </div>
      )}
    </div>
  );
}
