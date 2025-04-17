import service from "@/service/service.ts";

export function getKmaVersion() {
  return service.get<string>(`/api/version`)
}