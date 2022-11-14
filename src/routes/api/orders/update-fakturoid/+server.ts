import { json } from "@sveltejs/kit";
import { check } from "../../auth";
import { updateFakturoidID } from "../db";
import type { RequestHandler } from "./$types";

export const POST: RequestHandler = async ({ cookies, request }) => {
  const checkResult = await check(cookies);
  if (checkResult !== null) return checkResult;

  const params = (await request.json()) as {
    order_id: number;
    fakturoid_id: number;
  };

  return json(await updateFakturoidID(params));
};
