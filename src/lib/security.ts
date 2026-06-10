import crypto from "crypto";

export function clean(value: unknown, maxLength = 120) {
  return String(value || "")
    .trim()
    .replaceAll("@everyone", "[everyone]")
    .replaceAll("@here", "[here]")
    .slice(0, maxLength);
}

export function timingSafeCompare(a: string, b: string) {
  const aBuffer = Buffer.from(a);
  const bBuffer = Buffer.from(b);

  if (aBuffer.length !== bBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(aBuffer, bBuffer);
}

export function isInternalRequest(req: Request) {
  const secret = process.env.INTERNAL_API_SECRET;

  if (!secret) {
    return false;
  }

  const headerSecret = req.headers.get("x-internal-api-secret");
  const authHeader = req.headers.get("authorization");

  return headerSecret === secret || authHeader === `Bearer ${secret}`;
}
