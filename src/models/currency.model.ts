import { z } from "zod";
import { db } from "../database/connection";

export const CurrencySchema = z.object({
  id: z.string().uuid(),
  code: z.string().max(10),
  name: z.string().max(100),
  symbol: z.string().max(5),
});

export type CurrencyType = z.infer<typeof CurrencySchema>;
export type NewCurrencyType = Partial<CurrencyType>;

const getCurrencies = async (): Promise<CurrencyType[] | undefined> => {
  const data = await db.query(
    `
        SELECT *
        FROM currencies
    `
  );

  return data.rows;
};

const getCurrencyById = async (
  id: string
): Promise<CurrencyType | undefined> => {
  const data = await db.query(
    `
        SELECT *
        FROM currencies
        WHERE id = $1
    `,
    [id]
  );

  return data.rows[0];
};

const createCurrency = async (
  currency: NewCurrencyType
): Promise<CurrencyType | undefined> => {
  const data = await db.query(
    `
        INSERT INTO currencies (code, name, symbol)
        VALUES ($1, $2, $3)
        RETURNING *
    `,
    [currency.code, currency.name, currency.symbol]
  );

  return data.rows[0];
};

const updateCurrency = async (
  id: string,
  currency: NewCurrencyType
): Promise<CurrencyType | undefined> => {
  const data = await db.query(
    `
        UPDATE currencies
        SET code = $2, name = $3, symbol = $4
        WHERE id = $1
        RETURNING *
    `,
    [id, currency.code, currency.name, currency.symbol]
  );

  return data.rows[0];
};

export const Currency = {
  getCurrencies,
  getCurrencyById,
  createCurrency,
  updateCurrency,
};
