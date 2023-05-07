import { createHash } from "crypto";

export function getServerSidePasswordHash(passwordClientHash: string, salt: string) {
  const saltedClientHash = passwordClientHash + salt;
  const hash = createHash('sha512');
  hash.update(saltedClientHash);

  return hash.digest('hex');
}