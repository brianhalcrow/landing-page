import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function toStringOrNull(value: any): string | null {
  if (value === null || value === undefined || value === '') {
    return null;
  }
  return String(value);
}