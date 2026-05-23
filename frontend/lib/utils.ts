import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

// shadcn/ui standard utility for merging Tailwind classes
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Format a number as USD currency
export function formatCurrency(amount: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(amount);
}

// Format a percentage
export function formatPercent(value: number): string {
  return `${Math.round(value)}%`;
}

// Generate a simple unique ID (no external dependency)
export function generateId(): string {
  return Math.random().toString(36).substring(2, 9);
}
