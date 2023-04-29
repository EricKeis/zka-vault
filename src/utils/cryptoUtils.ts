async function getKeyMaterialFromPassword(password: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();

  return window.crypto.subtle.importKey(
    "raw",
    encoder.encode(password),
    {name: "PBKDF2"},
    false,
    ["deriveBits", "deriveKey"]
  ); 
}

async function deriveKeyFromPassword(keyMaterial: CryptoKey, salt: string): Promise<CryptoKey> {
  const encoder = new TextEncoder();
  
  return window.crypto.subtle.deriveKey(
    {
      name: "PBKDF2",
      salt: encoder.encode(salt),
      iterations: 100000,
      hash: "SHA-256"
    },
    keyMaterial,
    { name: "AES-GCM", length: 256},
    false,
    ["encrypt", "decrypt"]
  );
}

export async function encryptData(iv: string, password: string, salt: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const keyMaterial = await getKeyMaterialFromPassword(password);
  const key = await deriveKeyFromPassword(keyMaterial, salt);
  const encryptedData = await window.crypto.subtle.encrypt(
    {
      name: "AES-GCM",
      iv: encoder.encode(iv)
    },
    key,
    encoder.encode(data)
  );
  
  return  window.btoa(String.fromCharCode(...new Uint8Array(encryptedData)));
}

export async function decryptData(iv: string, password: string, salt: string, data: string): Promise<string> {
  const encoder = new TextEncoder();
  const decoder = new TextDecoder();
  const keyMaterial = await getKeyMaterialFromPassword(password);
  const key = await deriveKeyFromPassword(keyMaterial, salt);
  const encryptedData = window.atob(data).split("").map(char => char.charCodeAt(0));
  const encryptedArray = new Uint8Array(encryptedData);
  const decryptedData = await window.crypto.subtle.decrypt(
    {
      name: "AES_GCM",
      iv: encoder.encode(iv);
    },
    key,
    encryptedArray
  );

  return decoder.decode(decryptedData);
}

export async function getPasswordHash(password: string, uid: string): Promise<string> {
  const msgUint8 = new TextEncoder().encode(password + uid);
  const hashBuffer = await crypto.subtle.digest("SHA-512", msgUint8);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  const hashHex = hashArray.map((b) => b.toString(16).padStart(2, "0")).join("");

  return hashHex;
}