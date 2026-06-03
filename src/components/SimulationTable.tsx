import { useState } from 'react';
import { Table, ChevronLeft, ChevronRight } from 'lucide-react';
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

  return (
    <div className="table-section animate-in">
      <div className="table-section__header">
        <div className="table-section__title">
          <Table size={20} style={{ color: '#818cf8' }} />
          Detalle Diario de la Simulación
        </div>
      </div>

      <div className="table-wrapper">
        <table className="data-table" id="simulation-table">
          <thead>
            <tr>
              <th>Día</th>
              <th>Desmant.</th>
              <th>% Acopio</th>
              <th>Rechazos</th>
              <th>WIP CRT</th>
              <th>WIP LCD</th>
              <th>WIP LED</th>
              <th>CRT</th>
              <th>LCD</th>
              <th>LED</th>
              <th>Refurb.</th>
              <th>Descart.</th>
              <th>Peso (kg)</th>
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
                <td style={{ color: d.porcentajeAlmacenamientoOcupado >= 100 ? '#fb7185' : '#38bdf8' }}>
                  {fmt(d.porcentajeAlmacenamientoOcupado)}%
                </td>
                <td style={{ color: d.camionetasRechazadas > 0 ? '#fb7185' : 'inherit' }}>
                  {fmtInt(d.camionetasRechazadas)}
                </td>
                <td>{fmtInt(d.stockFinalCRT)}</td>
                <td>{fmtInt(d.stockFinalLCD)}</td>
                <td>{fmtInt(d.stockFinalLED)}</td>
                <td>{fmtInt(d.totalCRT)}</td>
                <td>{fmtInt(d.totalLCD)}</td>
                <td>{fmtInt(d.totalLED)}</td>
                <td>{fmtInt(d.totalRefurbishment)}</td>
                <td>{fmtInt(d.totalDescartados)}</td>
                <td>{fmt(d.pesoTotalKg)}</td>
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
