import { type ReactNode } from 'react';

interface MetricCardProps {
  label: string;
  value: string | number;
  sub?: string;
  icon: ReactNode;
  variant: 'emerald' | 'indigo' | 'amber' | 'rose' | 'sky' | 'teal' | 'violet' | 'orange';
  delay?: number;
}

export default function MetricCard({ label, value, sub, icon, variant, delay = 0 }: MetricCardProps) {
  return (
    <div className={`metric-card metric-card--${variant} animate-in animate-in-delay-${delay}`}>
      <div className="metric-card__header">
        <span className="metric-card__label">{label}</span>
        <div className="metric-card__icon">{icon}</div>
      </div>
      <div className="metric-card__value">{value}</div>
      {sub && <div className="metric-card__sub">{sub}</div>}
    </div>
  );
}
