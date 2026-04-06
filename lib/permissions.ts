export const WRITE_ROLES = ["GESTIONNAIRE", "ADMIN"] as const;

export function canWrite(role?: string | null) {
  return !!role && WRITE_ROLES.includes(role as (typeof WRITE_ROLES)[number]);
}
