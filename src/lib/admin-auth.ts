import { createRemoteJWKSet, errors, jwtVerify, type JWTVerifyGetKey } from "jose";
import { SITE_URL } from "@/data/site";

export class AdminAuthError extends Error {
  constructor(
    message: string,
    public readonly status: number,
  ) {
    super(message);
    this.name = "AdminAuthError";
  }
}

export function getAdminOrigin() {
  try {
    return new URL(process.env.ADMIN_SITE_URL?.trim() || SITE_URL).origin;
  } catch {
    return "";
  }
}

function getCanonicalHost() {
  try {
    return new URL(getAdminOrigin()).host.toLowerCase();
  } catch {
    return "";
  }
}

function isDevelopmentHost(host: string, canonicalHost: string) {
  const devHosts = new Set([
    "localhost",
    "localhost:3000",
    "127.0.0.1",
    "127.0.0.1:3000",
    canonicalHost,
  ]);
  return devHosts.has(host.toLowerCase());
}

const jwksByTeamDomain = new Map<string, JWTVerifyGetKey>();

function getJwks(teamDomain: string) {
  const cached = jwksByTeamDomain.get(teamDomain);
  if (cached) return cached;

  const jwks = createRemoteJWKSet(
    new URL(`${teamDomain}/cdn-cgi/access/certs`),
  );
  jwksByTeamDomain.set(teamDomain, jwks);
  return jwks;
}

function assertCanonicalHost(headers: Headers) {
  const canonicalHost = getCanonicalHost();
  const host = (headers.get("host") ?? "").toLowerCase();

  if (process.env.NODE_ENV === "development") {
    if (!isDevelopmentHost(host, canonicalHost)) {
      throw new AdminAuthError("Invalid host", 403);
    }
    return;
  }

  if (!canonicalHost || host !== canonicalHost) {
    throw new AdminAuthError("Invalid host", 403);
  }
}

export async function verifyAdminAccess(headers: Headers) {
  assertCanonicalHost(headers);

  const teamDomain = process.env.CLOUDFLARE_ACCESS_TEAM_DOMAIN
    ?.trim()
    .replace(/\/$/, "");
  const audience = process.env.CLOUDFLARE_ACCESS_AUD?.trim();
  const allowedEmailsRaw = process.env.ADMIN_ALLOWED_EMAILS?.trim();

  if (!teamDomain || !audience || !allowedEmailsRaw) {
    throw new AdminAuthError("Admin access is not configured", 503);
  }

  const token = headers.get("cf-access-jwt-assertion");
  if (!token) {
    throw new AdminAuthError("Unauthorized", 401);
  }

  let payload;
  try {
    ({ payload } = await jwtVerify(token, getJwks(teamDomain), {
      issuer: teamDomain,
      audience,
      algorithms: ["RS256"],
    }));
  } catch (error) {
    if (error instanceof errors.JOSEError) {
      throw new AdminAuthError("Unauthorized", 401);
    }
    throw error;
  }

  const email =
    typeof payload.email === "string"
      ? payload.email.toLowerCase().trim()
      : "";

  const allowedEmails = allowedEmailsRaw
    .split(",")
    .map((entry) => entry.toLowerCase().trim())
    .filter(Boolean);

  if (!allowedEmails.includes(email)) {
    throw new AdminAuthError("Forbidden", 403);
  }

  return { email };
}
