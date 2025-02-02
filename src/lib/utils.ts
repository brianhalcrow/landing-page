import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function toStringOrNull(value: any): string | null {
  if (value === undefined || value === null || value === '') {
    return null;
  }
  return String(value);
}