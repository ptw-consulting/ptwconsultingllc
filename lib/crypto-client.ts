export type CipherBundle = {
  ciphertext: string;
  salt: string;
  iv: string;
  iterations: number;
};

function b64ToBuffer(b64: string): ArrayBuffer {
  const bin = atob(b64);
  const out = new Uint8Array(bin.length);
  for (let i = 0; i < bin.length; i++) out[i] = bin.charCodeAt(i);
  return out.buffer;
}

function strToBuffer(s: string): ArrayBuffer {
  const bytes = new TextEncoder().encode(s);
  return bytes.buffer.slice(
    bytes.byteOffset,
    bytes.byteOffset + bytes.byteLength,
  ) as ArrayBuffer;
}

async function deriveKey(
  password: string,
  salt: ArrayBuffer,
  iterations: number,
): Promise<CryptoKey> {
  const baseKey = await crypto.subtle.importKey(
    "raw",
    strToBuffer(password),
    "PBKDF2",
    false,
    ["deriveKey"],
  );
  return crypto.subtle.deriveKey(
    { name: "PBKDF2", salt, iterations, hash: "SHA-256" },
    baseKey,
    { name: "AES-GCM", length: 256 },
    false,
    ["decrypt"],
  );
}

export async function decryptProposal(
  bundle: CipherBundle,
  password: string,
): Promise<string> {
  const salt = b64ToBuffer(bundle.salt);
  const iv = b64ToBuffer(bundle.iv);
  const ct = b64ToBuffer(bundle.ciphertext);
  const key = await deriveKey(password, salt, bundle.iterations);
  const plain = await crypto.subtle.decrypt({ name: "AES-GCM", iv }, key, ct);
  return new TextDecoder().decode(plain);
}
