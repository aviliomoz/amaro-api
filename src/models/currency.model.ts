import { z } from "zod";
import { db } from "../database/connection";
import { ModelResult } from "../utils/types";

export const CurrencySchema = z.object({
  id: z.string().uuid().optional(),
  code: z.string().max(10),
  name: z.string().max(100),
  symbol: z.string().max(5),
});

export type CurrencyType = z.infer<typeof CurrencySchema>;

const getCurrencies = async (): Promise<ModelResult<CurrencyType[]>> => {
  await db.query("BEGIN");

  try {
    const query = `SELECT * FROM currencies;`;
    const result = await db.query(query);

    await db.query("COMMIT");

    return {
      data: result.rows,
      error: null,
    };
  } catch (error) {
    await db.query("ROLLBACK");

    return {
      data: null,
      error: error as Error,
    };
  }
};

const getCurrencyById = async (
  id: string
): Promise<ModelResult<CurrencyType>> => {
  await db.query("BEGIN");

  try {
    const query = `SELECT * FROM currencies WHERE id = $1;`;
    const values = [id];

    const result = await db.query(query, values);

    await db.query("COMMIT");
    return {
      error: null,
      data: result.rows[0],
    };
  } catch (error) {
    await db.query("ROLLBACK");

    return {
      data: null,
      error: error as Error,
    };
  }
};

const createCurrency = async (
  currency: CurrencyType
): Promise<ModelResult<CurrencyType>> => {
  await db.query("BEGIN");

  try {
    const query = `
        INSERT INTO currencies (code, name, symbol)
        VALUES ($1, $2, $3)
        RETURNING *;
    `;

    const values = [currency.code, currency.name, currency.symbol];

    const result = await db.query(query, values);

    await db.query("COMMIT");
    return {
      data: result.rows[0],
      error: null,
    };
  } catch (error) {
    await db.query("ROLLBACK");

    return {
      error: error as Error,
      data: null,
    };
  }
};

const updateCurrency = async (
  id: string,
  currency: CurrencyType
): Promise<ModelResult<CurrencyType>> => {
  await db.query("BEGIN");

  try {
    const query = `UPDATE currencies SET code = $2, name = $3, symbol = $4 WHERE id = $1 RETURNING *;`;
    const values = [id, currency.code, currency.name, currency.symbol];

    const result = await db.query(query, values);

    await db.query("COMMIT");
    return {
      data: result.rows[0],
      error: null,
    };
  } catch (error) {
    await db.query("ROLLBACK");

    return {
      error: error as Error,
      data: null,
    };
  }
};

export const Currency = {
  getCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
};
