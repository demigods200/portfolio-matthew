export function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function jitter(base: number, variance: number): number {
  return base + Math.floor(Math.random() * variance);
}
