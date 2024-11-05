import fs from "node:fs";
import rsaPemtoJwk from "rsa-pem-to-jwk";

const privateKey = fs.readFileSync("./certs/private.pem");

const jwk = rsaPemtoJwk(privateKey, { use: "sig" }, "public");

console.log(jwk);
