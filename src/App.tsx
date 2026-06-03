import { useState } from 'react';
import {
  Recycle, Play, DollarSign, Weight, Cpu, Truck,
  FlaskConical, Gem, AlertTriangle, TrendingUp, Users, AlertOctagon
} from 'lucide-react';
import MetricCard from './components/MetricCard';
import ChartsSection from './components/ChartsSection';
import SimulationTable from './components/SimulationTable';
import type { ResultadoSimulacion } from './types';

const API_BASE = 'http://localhost:5262';

function App() {
  const [dias, setDias] = useState<number | ''>(30);
  const [camionetas, setCamionetas] = useState<number | ''>(5);
  const [capacidadAlmacen, setCapacidadAlmacen] = useState<number | ''>(375.0);
  const [operariosCRT, setOperariosCRT] = useState<number | ''>(2);
  const [operariosPlanas, setOperariosPlanas] = useState<number | ''>(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [result, setResult] = useState<ResultadoSimulacion | null>(null);

  const handleRun = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch(
        `${API_BASE}/api/simulacion/ejecutar?dias=${dias || 30}&camionetasPorDia=${camionetas || 1}&capacidadAlmacenM3=${capacidadAlmacen || 1}&operariosCRT=${operariosCRT || 1}&operariosPlanas=${operariosPlanas || 1}`,
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

  return (
    <div className="app-container">
      {/* ─── Header ─── */}
      <header className="app-header">
        <div className="app-header__brand">
          <div className="app-header__icon">
            <Recycle size={26} color="#0a0e1a" />
          </div>
          <div>
            <h1 className="app-header__title">Planta de Reciclaje Electrónico</h1>
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
            className="config-panel__input"
            type="number"
            min={1}
            max={30}
            value={dias}
            onChange={(e) => {
              const val = e.target.value;
              if (val === '') setDias('');
              else {
                const num = Number(val);
                setDias(num > 30 ? 30 : num);
              }
            }}
          />
        </div>
        <div className="config-panel__group">
          <label className="config-panel__label" htmlFor="input-camionetas">Camionetas por día</label>
          <input
            id="input-camionetas"
            className="config-panel__input"
            type="number"
            min={1}
            step={1}
            value={camionetas}
            onChange={(e) => setCamionetas(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>
        <div className="config-panel__group">
          <label className="config-panel__label" htmlFor="input-almacen">Almacén (m²)</label>
          <input
            id="input-almacen"
            className="config-panel__input"
            type="number"
            min={1}
            step={1}
            value={capacidadAlmacen}
            onChange={(e) => setCapacidadAlmacen(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>
        <div className="config-panel__group">
          <label className="config-panel__label" htmlFor="input-op-crt">Operarios CRT</label>
          <input
            id="input-op-crt"
            className="config-panel__input"
            type="number"
            min={1}
            step={1}
            value={operariosCRT}
            onChange={(e) => setOperariosCRT(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>
        <div className="config-panel__group">
          <label className="config-panel__label" htmlFor="input-op-planas">Operarios LCD/LED</label>
          <input
            id="input-op-planas"
            className="config-panel__input"
            type="number"
            min={1}
            step={1}
            value={operariosPlanas}
            onChange={(e) => setOperariosPlanas(e.target.value === '' ? '' : Number(e.target.value))}
          />
        </div>
        <button
          className="btn btn--primary"
          onClick={handleRun}
          disabled={loading}
          id="run-simulation-btn"
        >
          {loading ? <span className="btn__spinner" /> : <Play size={16} />}
          {loading ? 'Simulando...' : 'Ejecutar Simulación'}
        </button>
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
        Simulación · Planta de Reciclaje Electrónico · {new Date().getFullYear()}
      </footer>
    </div>
  );
}

export default App;
