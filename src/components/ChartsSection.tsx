import { memo } from 'react';
import {
  AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import { TrendingUp, BarChart3, PieChart as PieChartIcon } from 'lucide-react';
import type { ResumenDia } from '../types';

interface ChartsSectionProps {
  data: ResumenDia[];
}

const COLORS = {
  emerald: '#34d399',
  teal: '#2dd4bf',
  indigo: '#818cf8',
  amber: '#fbbf24',
  rose: '#fb7185',
  sky: '#38bdf8',
  violet: '#a78bfa',
  orange: '#fb923c',
};

const PIE_COLORS = [COLORS.rose, COLORS.sky, COLORS.emerald];

export default memo(function ChartsSection({ data }: ChartsSectionProps) {
  // Financial data for area chart
  const financialData = data.map((d) => ({
    name: `Día ${d.dia}`,
    Ingresos: Math.round(d.ingresosDia * 100) / 100,
    Costos: Math.round(d.costosDia * 100) / 100,
    Ganancia: Math.round(d.gananciaDia * 100) / 100,
  }));

  // Materials extraction for bar chart
  const materialsData = data.map((d) => ({
    name: `D${d.dia}`,
    Cobre: Math.round(d.totalCobreKG * 100) / 100,
    Oro: Math.round(d.totalOroKG * 1000) / 1000,
    Plata: Math.round(d.totalPlataKG * 1000) / 1000,
    PCB: Math.round(d.totalPCBKg * 100) / 100,
  }));

  // Device segmentation for pie chart
  const totalCRT = data.reduce((s, d) => s + d.totalCRT, 0);
  const totalLCD = data.reduce((s, d) => s + d.totalLCD, 0);
  const totalLED = data.reduce((s, d) => s + d.totalLED, 0);

  const deviceData = [
    { name: 'CRT', value: totalCRT },
    { name: 'LCD', value: totalLCD },
    { name: 'LED', value: totalLED },
  ];

  const totalDevices = totalCRT + totalLCD + totalLED;

  return (
    <div className="charts-grid">
      {/* Financial Chart */}
      <div className="chart-card chart-card--wide animate-in">
        <div className="chart-card__title">
          <div className="chart-card__title-icon" style={{ background: 'rgba(52,211,153,0.15)', color: COLORS.emerald }}>
            <TrendingUp size={16} />
          </div>
          Balance Financiero Diario
        </div>
        <ResponsiveContainer width="100%" height={300}>
          <AreaChart data={financialData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <defs>
              <linearGradient id="gradIngresos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.emerald} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.emerald} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradCostos" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.rose} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.rose} stopOpacity={0} />
              </linearGradient>
              <linearGradient id="gradGanancia" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor={COLORS.indigo} stopOpacity={0.3} />
                <stop offset="95%" stopColor={COLORS.indigo} stopOpacity={0} />
              </linearGradient>
            </defs>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: '#0f1423',
                border: '1px solid rgba(100,120,180,0.12)',
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
              labelStyle={{ color: '#f1f5f9', fontWeight: 600 }}
              itemStyle={{ color: '#94a3b8', fontSize: '0.82rem' }}
            />
            <Legend />
            <Area type="monotone" dataKey="Ingresos" stroke={COLORS.emerald} fill="url(#gradIngresos)" strokeWidth={2} />
            <Area type="monotone" dataKey="Costos" stroke={COLORS.rose} fill="url(#gradCostos)" strokeWidth={2} />
            <Area type="monotone" dataKey="Ganancia" stroke={COLORS.indigo} fill="url(#gradGanancia)" strokeWidth={2} />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      {/* Materials Bar Chart */}
      <div className="chart-card animate-in">
        <div className="chart-card__title">
          <div className="chart-card__title-icon" style={{ background: 'rgba(251,191,36,0.15)', color: COLORS.amber }}>
            <BarChart3 size={16} />
          </div>
          Extracción de Materiales (kg)
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <BarChart data={materialsData} margin={{ top: 8, right: 16, left: 0, bottom: 0 }}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" tick={{ fontSize: 10 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip
              contentStyle={{
                background: '#0f1423',
                border: '1px solid rgba(100,120,180,0.12)',
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
              labelStyle={{ color: '#f1f5f9', fontWeight: 600 }}
              itemStyle={{ color: '#94a3b8', fontSize: '0.82rem' }}
            />
            <Legend />
            <Bar dataKey="Cobre" fill={COLORS.orange} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Oro" fill={COLORS.amber} radius={[4, 4, 0, 0]} />
            <Bar dataKey="Plata" fill={COLORS.violet} radius={[4, 4, 0, 0]} />
            <Bar dataKey="PCB" fill={COLORS.teal} radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Device Segmentation Pie */}
      <div className="chart-card animate-in">
        <div className="chart-card__title">
          <div className="chart-card__title-icon" style={{ background: 'rgba(56,189,248,0.15)', color: COLORS.sky }}>
            <PieChartIcon size={16} />
          </div>
          Segmentación por Tecnología
        </div>
        <ResponsiveContainer width="100%" height={280}>
          <PieChart>
            <Pie
              data={deviceData}
              cx="50%"
              cy="50%"
              innerRadius={70}
              outerRadius={110}
              paddingAngle={3}
              dataKey="value"
              stroke="none"
              label={({ name, percent }) => `${name} ${((percent ?? 0) * 100).toFixed(1)}%`}
            >
              {deviceData.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={PIE_COLORS[index % PIE_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                background: '#0f1423',
                border: '1px solid rgba(100,120,180,0.12)',
                borderRadius: '8px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.3)',
              }}
              labelStyle={{ color: '#f1f5f9', fontWeight: 600 }}
              itemStyle={{ color: '#94a3b8', fontSize: '0.82rem' }}
            />
          </PieChart>
        </ResponsiveContainer>
        <div style={{ textAlign: 'center', fontSize: '0.8rem', color: '#64748b', marginTop: '-8px' }}>
          Total: <strong style={{ color: '#f1f5f9' }}>{totalDevices.toLocaleString()}</strong> dispositivos desmantelados
        </div>
      </div>
    </div>
  );
});
