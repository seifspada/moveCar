// types/reservation.ts
export interface CreateReservationInput {
  missionId: string;    // ✅ Requis
  dateDepart: string;   // ✅ Requis - Format: "2026-02-20"
  heureDepart: string;  // ✅ Requis - Format: "09:00"
}