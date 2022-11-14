import { json } from "@sveltejs/kit";
import { check } from "../auth";
import type { RequestHandler } from "./$types";
import { list } from "./db";

export const GET: RequestHandler = async ({ cookies }) => {
  const checkResult = await check(cookies);
  if (checkResult !== null) return checkResult;
  return json(await list());
};
