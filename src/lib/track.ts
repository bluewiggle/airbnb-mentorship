export function track(event: string, params: Record<string, any> = {}) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const gtag = (globalThis as any).gtag;
  if (typeof gtag === "function") gtag("event", event, params);
}
