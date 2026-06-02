/* ========================================
   TypeScript Types for the Simulation API
   ======================================== */

export interface ResumenDia {
  dia: number;
  totalDesmantelamiento: number;
  totalCRT: number;
  totalLCD: number;
  totalLED: number;
  totalRefurbishment: number;
  totalDescartados: number;
  pesoTotalKg: number;
  pesoToxiKg: number;
  costoDisposicionToxico: number;
  totalCobreKG: number;
  totalOroKG: number;
  totalPlataKG: number;
  totalPCBKg: number;
  ingresosDia: number;
  costosDia: number;
  gananciaDia: number;
  pcBacumuladoKg: number;
}

export interface ResumenTotal {
  totalCRT: number;
  totalLCD: number;
  totalLED: number;
  totalRefurbishment: number;
  totalDescartados: number;
  totalDesmantelamiento: number;
  totalPeso: number;
  totalPesoToxico: number;
  totalCostoDisposicionToxico: number;
  totalPesoOro: number;
  totalPesoPlata: number;
  totalPesoCobre: number;
  ingresosTotales: number;
  costosTotales: number;
  gananciaNeta: number;
}

export interface ResultadoSimulacion {
  dias: number;
  camionetasPorDia: number;
  resumenPorDia: ResumenDia[];
  totales: ResumenTotal;
}
