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
  // Campos de inventario y almacenamiento
  stockInicialCRT: number;
  stockInicialLCD: number;
  stockInicialLED: number;
  stockFinalCRT: number;
  stockFinalLCD: number;
  stockFinalLED: number;
  porcentajeAlmacenamientoOcupado: number;
  utilizacionOperariosCRT: number;
  utilizacionOperariosPlanas: number;
  camionetasRechazadas: number;
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
  utilizacionPromedioCRT: number;
  utilizacionPromedioPlanas: number;
  diasSaturacionCRT: number;
  diasSaturacionPlanas: number;
  totalCamionetasRechazadas: number;
}

export interface ResultadoSimulacion {
  dias: number;
  camionetasPorDia: number;
  resumenPorDia: ResumenDia[];
  totales: ResumenTotal;
}
