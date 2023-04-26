export async function hashPassword(password: string, uid: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password + uid);
  const hashBuffer = await crypto.subtle.digest("SHA-512", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return hashHex;
}