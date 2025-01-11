import { z } from "zod";
import { db } from "../lib/database";

export const CurrencySchema = z.object({
  code: z.string().length(3),
  name: z.string().max(50),
  symbol: z.string().max(10),
});

export type Currency = z.infer<typeof CurrencySchema>;

export const Currency = {
  
  getCurrencies: async (): Promise<Currency[]> => {
    const query = "SELECT * FROM currencies";
    const result = await db.query(query);

    return result.rows as Currency[];
  },

  getCurrencyByCode: async (code: string): Promise<Currency> => {
    const query = "SELECT * FROM currencies WHERE code = $1";
    const values = [code];

    const result = await db.query(query, values);
    return result.rows[0] as Currency;
  },

  createCurrency: async (currency: Currency): Promise<Currency> => {
    const query = "INSERT INTO currencies (code, name, symbol) VALUES ($1, $2, $3) RETURNING *";
    const values = [currency.code, currency.name, currency.symbol];

    const result = await db.query(query, values);
    return result.rows[0] as Currency;
  },

  updateCurrency: async (currency: Currency): Promise<Currency> => {
    const query = "UPDATE currencies SET code = $1, name = $2, symbol = $3 WHERE code = $1 RETURNING *";
    const values = [currency.code, currency.name, currency.symbol];

    const result = await db.query(query, values);
    return result.rows[0] as Currency
  }
};
