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
};

export async function list(): Promise<DBOrder[]> {
  return (await pool.query("SELECT id, data, order_time FROM orders")).rows;
}
