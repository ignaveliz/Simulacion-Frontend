import { useState } from 'react';
import {
  Recycle, Play, DollarSign, Weight, Cpu, Truck,
  FlaskConical, Gem, AlertTriangle, TrendingUp, Users, AlertOctagon, CircuitBoard
} from 'lucide-react';
import MetricCard from './components/MetricCard';
import ChartsSection from './components/ChartsSection';
import SimulationTable from './components/SimulationTable';
import type { ResultadoSimulacion } from './types';

const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5262';

function App() {
  const [dias, setDias] = useState<number | ''>(30);
  const [camionetas, setCamionetas] = useState<number | ''>(5);
  const [capacidadAlmacen, setCapacidadAlmacen] = useState<number | ''>(375.0);
  const [operariosCRT, setOperariosCRT] = useState<number | ''>(2);
  const [operariosPlanas, setOperariosPlanas] = useState<number | ''>(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultadoSimulacion | null>(null);

  // Validaciones del lado del cliente
  const errors = {
    dias: dias === '' ? 'Requerido' : (isNaN(dias) ? 'Número inválido' : (!Number.isInteger(dias) ? 'Debe ser entero' : (dias <= 0 ? 'Debe ser mayor a 0' : (dias > 30 ? 'Máximo 30 días' : null)))),
    camionetas: camionetas === '' ? 'Requerido' : (isNaN(camionetas) ? 'Número inválido' : (!Number.isInteger(camionetas) ? 'Debe ser entero' : (camionetas <= 0 ? 'Debe ser mayor a 0' : (camionetas > 100 ? 'Máximo 100' : null)))),
    capacidadAlmacen: capacidadAlmacen === '' ? 'Requerido' : (isNaN(capacidadAlmacen) ? 'Número inválido' : (capacidadAlmacen <= 0 ? 'Debe ser mayor a 0' : (capacidadAlmacen > 10000 ? 'Máximo 10000' : null))),
    operariosCRT: operariosCRT === '' ? 'Requerido' : (isNaN(operariosCRT) ? 'Número inválido' : (!Number.isInteger(operariosCRT) ? 'Debe ser entero' : (operariosCRT <= 0 ? 'Debe ser mayor a 0' : (operariosCRT > 100 ? 'Máximo 100' : null)))),
    operariosPlanas: operariosPlanas === '' ? 'Requerido' : (isNaN(operariosPlanas) ? 'Número inválido' : (!Number.isInteger(operariosPlanas) ? 'Debe ser entero' : (operariosPlanas <= 0 ? 'Debe ser mayor a 0' : (operariosPlanas > 100 ? 'Máximo 100' : null)))),
  };

  const hasErrors = Object.values(errors).some(err => err !== null);

  const handleRun = async () => {
    if (hasErrors) return;
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/simulacion/ejecutar?dias=${dias}&camionetasPorDia=${camionetas}&capacidadAlmacenM3=${capacidadAlmacen}&operariosCRT=${operariosCRT}&operariosPlanas=${operariosPlanas}`,
        { method: 'POST' },
      );
      if (!res.ok) {
        const text = await res.text();
        throw new Error(text || `Error ${res.status}`);
      }
      const data: ResultadoSimulacion = await res.json();
      setResult(data);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : 'Error desconocido al conectar con la API';
      setError(msg);
    } finally {
      setLoading(false);
    }
  };

  const fmt = (n: number, d = 2) =>
    n.toLocaleString('es-AR', { minimumFractionDigits: d, maximumFractionDigits: d });

  const t = result?.totales;
  const totalPCB = result?.resumenPorDia.reduce((acc, dia) => acc + dia.totalPCBKg, 0) || 0;

  return (
    <div className="app-container">
      {/* ─── Header ─── */}
      <header className="app-header">
        <div className="app-header__brand">
          <div className="app-header__icon">
            <Recycle size={26} color="#0a0e1a" />
          </div>
          <div>
            <h1 className="app-header__title">Simulación · EMA SRL - Evaluación Medioambiental S.R.L.</h1>
            <p className="app-header__subtitle">Panel de simulación</p>
          </div>
        </div>
        <div className="app-header__status">
          <span className={`status-dot ${result ? 'status-dot--online' : 'status-dot--offline'}`} />
          {result ? `Simulación completada · ${result.dias} días` : 'Sin simulación ejecutada'}
        </div>
      </header>

      {/* ─── Config Panel ─── */}
      <section className="config-panel" id="config-panel">
        <div className="config-panel__group">
          <label className="config-panel__label" htmlFor="input-dias">Días de simulación</label>
          <input
            id="input-dias"
            className={`config-panel__input ${errors.dias ? 'config-panel__input--error' : ''}`}
            type="number"
            value={dias}
            onChange={(e) => {
              const val = e.target.value;
              setDias(val === '' ? '' : Number(val));
            }}
          />
          <span className="config-panel__error" style={!errors.dias ? { opacity: 0, userSelect: 'none' } : undefined}>
            {errors.dias || '\u00A0'}
          </span>
        </div>
        <div className="config-panel__group">
          <label className="config-panel__label" htmlFor="input-camionetas">Camionetas por día</label>
          <input
            id="input-camionetas"
            className={`config-panel__input ${errors.camionetas ? 'config-panel__input--error' : ''}`}
            type="number"
            value={camionetas}
            onChange={(e) => {
              const val = e.target.value;
              setCamionetas(val === '' ? '' : Number(val));
            }}
          />
          <span className="config-panel__error" style={!errors.camionetas ? { opacity: 0, userSelect: 'none' } : undefined}>
            {errors.camionetas || '\u00A0'}
          </span>
        </div>
        <div className="config-panel__group">
          <label className="config-panel__label" htmlFor="input-almacen">Almacén (m³)</label>
          <input
            id="input-almacen"
            className={`config-panel__input ${errors.capacidadAlmacen ? 'config-panel__input--error' : ''}`}
            type="number"
            value={capacidadAlmacen}
            onChange={(e) => {
              const val = e.target.value;
              setCapacidadAlmacen(val === '' ? '' : Number(val));
            }}
          />
          <span className="config-panel__error" style={!errors.capacidadAlmacen ? { opacity: 0, userSelect: 'none' } : undefined}>
            {errors.capacidadAlmacen || '\u00A0'}
          </span>
        </div>
        <div className="config-panel__group">
          <label className="config-panel__label" htmlFor="input-op-crt">Operarios CRT</label>
          <input
            id="input-op-crt"
            className={`config-panel__input ${errors.operariosCRT ? 'config-panel__input--error' : ''}`}
            type="number"
            value={operariosCRT}
            onChange={(e) => {
              const val = e.target.value;
              setOperariosCRT(val === '' ? '' : Number(val));
            }}
          />
          <span className="config-panel__error" style={!errors.operariosCRT ? { opacity: 0, userSelect: 'none' } : undefined}>
            {errors.operariosCRT || '\u00A0'}
          </span>
        </div>
        <div className="config-panel__group">
          <label className="config-panel__label" htmlFor="input-op-planas">Operarios LCD/LED</label>
          <input
            id="input-op-planas"
            className={`config-panel__input ${errors.operariosPlanas ? 'config-panel__input--error' : ''}`}
            type="number"
            value={operariosPlanas}
            onChange={(e) => {
              const val = e.target.value;
              setOperariosPlanas(val === '' ? '' : Number(val));
            }}
          />
          <span className="config-panel__error" style={!errors.operariosPlanas ? { opacity: 0, userSelect: 'none' } : undefined}>
            {errors.operariosPlanas || '\u00A0'}
          </span>
        </div>
        <div className="config-panel__group">
          <span className="config-panel__label" style={{ opacity: 0, userSelect: 'none' }}>&nbsp;</span>
          <button
            className="btn btn--primary"
            onClick={handleRun}
            disabled={loading || hasErrors}
            id="run-simulation-btn"
            style={{ width: '100%' }}
          >
            {loading ? <span className="btn__spinner" /> : <Play size={16} />}
            {loading ? 'Simulando...' : 'Ejecutar Simulación'}
          </button>
          <span className="config-panel__error" style={{ opacity: 0, userSelect: 'none' }}>&nbsp;</span>
        </div>
      </section>

      {/* ─── Error ─── */}
      {error && (
        <div className="error-banner" id="error-banner">
          <AlertTriangle size={20} className="error-banner__icon" />
          <span>{error}</span>
        </div>
      )}

      {/* ─── Results ─── */}
      {!result && !error && (
        <div className="empty-state">
          <div className="empty-state__icon">🏭</div>
          <h2 className="empty-state__title">Configura tu simulación</h2>
          <p className="empty-state__desc">
            Ajusta los parámetros de días y camionetas, luego presiona
            <strong> "Ejecutar Simulación"</strong> para ver los resultados del modelo
            aplicado a la planta de reciclaje.
          </p>
        </div>
      )}

      {result && t && (
        <>
          {/* ─── KPI Cards ─── */}
          <section className="metrics-grid" id="kpi-section">
            <MetricCard
              label="Utilización CRT"
              value={`${t.utilizacionPromedioCRT}%`}
              sub={`Saturación: ${t.diasSaturacionCRT} días`}
              icon={<Users size={20} />}
              variant={t.utilizacionPromedioCRT >= 90 ? "rose" : "indigo"}
              delay={1}
            />
            <MetricCard
              label="Utilización Planas"
              value={`${t.utilizacionPromedioPlanas}%`}
              sub={`Saturación: ${t.diasSaturacionPlanas} días`}
              icon={<Users size={20} />}
              variant={t.utilizacionPromedioPlanas >= 90 ? "rose" : "sky"}
              delay={2}
            />
            <MetricCard
              label="Rechazos por Almacén"
              value={t.totalCamionetasRechazadas.toLocaleString('es-AR')}
              sub="Camionetas rechazadas"
              icon={<AlertOctagon size={20} />}
              variant={t.totalCamionetasRechazadas > 0 ? "rose" : "emerald"}
              delay={3}
            />
            <MetricCard
              label="Ganancia Neta"
              value={`$${fmt(t.gananciaNeta)}`}
              sub={`Ingresos $${fmt(t.ingresosTotales)} · Costos $${fmt(t.costosTotales)}`}
              icon={<DollarSign size={20} />}
              variant="emerald"
              delay={4}
            />
            <MetricCard
              label="Peso Total Procesado"
              value={`${fmt(t.totalPeso)} kg`}
              sub={`Tóxico: ${fmt(t.totalPesoToxico)} kg · Costo disp: $${fmt(t.totalCostoDisposicionToxico)}`}
              icon={<Weight size={20} />}
              variant="indigo"
              delay={2}
            />
            <MetricCard
              label="Dispositivos Desmantelados"
              value={t.totalDesmantelamiento.toLocaleString('es-AR')}
              sub={`CRT: ${t.totalCRT} · LCD: ${t.totalLCD} · LED: ${t.totalLED}`}
              icon={<Cpu size={20} />}
              variant="sky"
              delay={3}
            />
            <MetricCard
              label="Refurbishment"
              value={t.totalRefurbishment.toLocaleString('es-AR')}
              sub={`Descartados: ${t.totalDescartados.toLocaleString('es-AR')}`}
              icon={<Truck size={20} />}
              variant="teal"
              delay={4}
            />
            <MetricCard
              label="Cobre Extraído"
              value={`${fmt(t.totalPesoCobre, 4)} kg`}
              icon={<FlaskConical size={20} />}
              variant="orange"
              delay={5}
            />
            <MetricCard
              label="Oro Extraído"
              value={`${fmt(t.totalPesoOro, 4)} kg`}
              icon={<Gem size={20} />}
              variant="amber"
              delay={6}
            />
            <MetricCard
              label="Plata Extraída"
              value={`${fmt(t.totalPesoPlata, 4)} kg`}
              icon={<Gem size={20} />}
              variant="violet"
              delay={7}
            />
            <MetricCard
              label="PCB Extraído"
              value={`${fmt(totalPCB, 4)} kg`}
              icon={<CircuitBoard size={20} />}
              variant="indigo"
              delay={8}
            />
            <MetricCard
              label="Ingresos Totales"
              value={`$${fmt(t.ingresosTotales)}`}
              sub={`Promedio/día: $${fmt(t.ingresosTotales / result.dias)}`}
              icon={<TrendingUp size={20} />}
              variant="rose"
              delay={8}
            />
          </section>

          {/* ─── Charts ─── */}
          <ChartsSection data={result.resumenPorDia} />

          {/* ─── Detail Table ─── */}
          <SimulationTable data={result.resumenPorDia} />
        </>
      )}

      {/* ─── Footer ─── */}
      <footer style={{ textAlign: 'center', padding: '24px 0 32px', color: '#64748b', fontSize: '0.75rem' }}>
        Simulación · EMA SRL - Evaluación Medioambiental S.R.L. · {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;
