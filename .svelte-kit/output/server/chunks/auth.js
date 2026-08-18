import { jwtVerify, SignJWT } from "jose";
import { b as private_env } from "./shared-server.js";
function getJwtSecret() {
  const secret = private_env.JWT_SECRET || process?.env?.JWT_SECRET || "ujian-madrasah-jwt-secret-2024-ganti-di-production";
  return new TextEncoder().encode(secret);
}
const COOKIE_NAME = "ujian_auth_token";
async function hashPassword(password) {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 1e5,
      hash: "SHA-256"
    },
    keyMaterial,
    256
  );
  const saltHex = Array.from(salt).map((b) => b.toString(16).padStart(2, "0")).join("");
  const hashHex = Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${saltHex}:${hashHex}`;
}
async function verifyPassword(password, storedHash) {
  const [saltHex, expectedHashHex] = storedHash.split(":");
  if (!saltHex || !expectedHashHex) return false;
  const salt = new Uint8Array(saltHex.match(/.{2}/g).map((byte) => parseInt(byte, 16)));
  const encoder = new TextEncoder();
  const keyMaterial = await crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    "PBKDF2",
    false,
    ["deriveBits"]
  );
  const hash = await crypto.subtle.deriveBits(
    {
      name: "PBKDF2",
      salt,
      iterations: 1e5,
      hash: "SHA-256"
    },
    keyMaterial,
    256
  );
  const computedHex = Array.from(new Uint8Array(hash)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return computedHex === expectedHashHex;
}
async function createToken(user) {
  return new SignJWT({ ...user }).setProtectedHeader({ alg: "HS256" }).setIssuedAt().setExpirationTime("8h").sign(getJwtSecret());
}
async function verifyToken(token) {
  try {
    const { payload } = await jwtVerify(token, getJwtSecret());
    return {
      id: payload.id,
      school_id: payload.school_id,
      username: payload.username,
      name: payload.name,
      role: payload.role,
      class_id: payload.class_id,
      photo: payload.photo,
      session_token: payload.session_token
    };
  } catch {
    return null;
  }
}
async function signExamToken(attemptId, studentId) {
  const data = new TextEncoder().encode(`exam_attempt_${attemptId}_student_${studentId}`);
  const key = await crypto.subtle.importKey("raw", getJwtSecret(), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, data);
  const sigHex = Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `${attemptId}:${sigHex}`;
}
async function verifyExamTokenSignature(signedValue, attemptId, studentId) {
  if (!signedValue) return false;
  const expected = await signExamToken(attemptId, studentId);
  return signedValue === expected;
}
function generateTokenCode(length = 6) {
  const chars = "ABCDEFGHJKLMNPQRSTUVWXYZ23456789";
  let result = "";
  const randomValues = crypto.getRandomValues(new Uint8Array(length));
  for (let i = 0; i < length; i++) {
    result += chars[randomValues[i] % chars.length];
  }
  return result;
}
async function createQrLoginToken(userId, username, passwordHash) {
  const data = new TextEncoder().encode(`qr_login_user_${userId}_${username}_${passwordHash}`);
  const key = await crypto.subtle.importKey("raw", getJwtSecret(), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const signature = await crypto.subtle.sign("HMAC", key, data);
  const sigHex = Array.from(new Uint8Array(signature)).map((b) => b.toString(16).padStart(2, "0")).join("");
  return `QRL_${userId}_${sigHex.slice(0, 32)}`;
}
async function verifyQrLoginToken(userId, username, passwordHash, qrToken) {
  if (!qrToken || typeof qrToken !== "string" || !qrToken.startsWith("QRL_")) return false;
  const expected = await createQrLoginToken(userId, username, passwordHash);
  return qrToken === expected;
}
export {
  COOKIE_NAME as C,
  createQrLoginToken as a,
  verifyQrLoginToken as b,
  createToken as c,
  verifyPassword as d,
  verifyExamTokenSignature as e,
  generateTokenCode as g,
  hashPassword as h,
  signExamToken as s,
  verifyToken as v
};
