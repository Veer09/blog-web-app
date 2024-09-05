import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const useSearch = (type: string, name: string) => {
  const params = new URLSearchParams({
    type: type,
    name: name,
  }).toString();
  return useQuery({
    queryKey: ['search', type, name],
    queryFn: () => {
      return axios.get(`/api/search?${params}`);
    },
    enabled: name.length > 3,
  })
}