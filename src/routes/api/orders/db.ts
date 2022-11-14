import { env } from "$env/dynamic/private";
import type { Address, Item } from "$lib/utils";
import pg from "pg";
const { Pool } = pg;

const pool = new Pool({ connectionString: env.DATABASE_URL, ssl: { rejectUnauthorized: false } });

type OrderData = [
  {
    price: number;
    title: string;
    storedData: { cart: Record<string, number>; shopItems: Record<string, Item> };
  },
  {
    price: number;
    title: string;
    storedData: Address;
  },
  {
    price: number;
    title: string;
    storedData: unknown;
  },
  {
    price: number;
    title: string;
    storedData: { email: string; phone: string };
  }
];

export type DBOrder = {
  id: number;
  data: OrderData;
  order_time: string;
  fakturoid_id: null | number;
  packeta_id: null | number;
};

export async function list(): Promise<DBOrder[]> {
  return (await pool.query("SELECT id, data, order_time, fakturoid_id, packeta_id FROM orders")).rows;
}

export async function updateFakturoidID({
  order_id,
  fakturoid_id,
}: {
  order_id: number;
  fakturoid_id: number;
}) {
  if (!Number.isInteger(order_id) || !Number.isInteger(fakturoid_id))
    return { error: "Parameters must be integers" };
  await pool.query("UPDATE orders SET fakturoid_id = $1 WHERE id = $2", [fakturoid_id, order_id]);
  return { ok: true as const };
}
