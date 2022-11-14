import { env } from "$env/dynamic/private";
import { json, type Cookies } from "@sveltejs/kit";
import { importJWK, jwtVerify, SignJWT } from "jose";

if (env.SECRET_KEY === undefined) throw new Error("Missing environment variable: SECRET_KEY");

const key = await importJWK(JSON.parse(env.SECRET_KEY), "ES384");

export async function check(cookies: Cookies): Promise<null | Response> {
  const token = cookies.get("token");
  if (token) {
    const result = await jwtVerify(token, key)
      .then((x) => x.payload)
      .catch((e) => {
        console.log(e);
        return { authorized: false as const };
      });
    if (result.authorized) return null;
  }
  cookies.delete("token");
  return json({ message: "Unauthorized" }, { status: 401 });
}

export function signToken(unsigned: SignJWT): Promise<string> {
  return unsigned.sign(key);
}
