import { redirect } from "@sveltejs/kit";
import { list } from "../../api/orders/db";
import { check } from "../../api/auth";
import type { PageServerLoad } from "./$types";

export const load: PageServerLoad = async ({ cookies }) => {
  const checkResult = await check(cookies);
  if (checkResult !== null) {
    cookies.set("oauth_go", "orders", { httpOnly: true, secure: true, path: "/" });
    throw redirect(302, "/api/oauth/start");
  }

  const orders = await list();
  return {
    orders,
  };
};
