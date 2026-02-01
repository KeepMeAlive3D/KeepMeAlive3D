import service from "@/service/service.ts";

export type BpInfoData = {
    id: number
    dtId: number
    owner: number
    fileName: string
}

export function getBpmFiles(dt: number) {
    return service.get<BpInfoData[]>(`/api/dt/${dt}/bpm`)
}

export function uploadBpmFile(dt: number, file: File) {
    const formData = new FormData();
    formData.append("file", file);

    return service.post(`/api/dt/${dt}/bpm`, formData);
}

export function deleteBpmFile(dt: number, id: number) {
    return service.delete(`/api/dt/${dt}/bpm/${id}`)
}
