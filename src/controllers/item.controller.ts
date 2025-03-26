import { Request, Response } from "express";
import { ItemTypeEnum } from "../utils/types";
import { ApiResponse } from "../classes/response.class";
import { Item, FullItemType } from "../models/item.model";

export class ItemController {
    static async getItems(req: Request, res: Response) {
        const branch_id = req.query.branch_id as string
        const type = req.query.type as ItemTypeEnum

        try {
            const items = await Item.getItems(branch_id, type)
            ApiResponse.send(res, 200, null, items)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener los ítems")
        }
    }

    static async getItemById(req: Request, res: Response) {
        const id = req.params.id as string
        const branch_id = req.query.branch_id as string

        try {
            const item = await Item.getItemById(id)
            const prices = await Item.getItemPrices(id, branch_id)
            const equivalence = await Item.getItemEquivalence(id)
            const recipe = await Item.getItemRecipe(id, branch_id)
            ApiResponse.send(res, 200, null, { ...item, prices, equivalence, recipe })
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener el ítem")
        }
    }

    static async createItem(req: Request, res: Response) {
        const data = req.body as FullItemType
        const branch_id = req.query.branch_id as string

        try {
            const item = await Item.createItem(data)
            await Item.addItemToBranch(branch_id, item.id!, data.prices?.sale_price!, data.prices?.purchase_price!, data.prices?.cost_price!)
            if (data.equivalence) {
                await Item.addItemEquivalence(item.id!, data.equivalence!)
            }
            // Add item recipe
            ApiResponse.send(res, 201, null, item)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al crear el ítem")
        }
    }

    static async updateItem(req: Request, res: Response) {
        const id = req.params.id as string
        const branch_id = req.query.branch_id as string
        const data = req.body as FullItemType

        try {
            const item = await Item.updateItem(id, data)
            await Item.updateItemOnBranch(branch_id, id, data.prices?.sale_price!, data.prices?.purchase_price!, data.prices?.cost_price!)

            const equivalence = await Item.getItemEquivalence(id)

            if (equivalence && !data.equivalence) {
                await Item.deleteItemEquivalence(id)
            } else if (equivalence && data.equivalence) {
                await Item.updateItemEquivalence(id, data.equivalence)
            } else if (!equivalence && data.equivalence) {
                await Item.addItemEquivalence(id, data.equivalence!)
            }

            const recipe = await Item.getItemRecipe(id, branch_id)

            for await (const ingredient of data.recipe) {
                if (recipe.some(ingr => ingr.id === ingredient.id)) {
                    await Item.updateIngredient(id, ingredient)
                } else {
                    await Item.addIngredient(id, ingredient)
                }
            }

            for await (const ingredient of recipe) {
                if (!data.recipe.some(ingr => ingr.id === ingredient.id)) {
                    await Item.deleteIngredient(id, ingredient)
                }
            }

            ApiResponse.send(res, 200, null, item)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al actualizar el ítem")
        }
    }

    static async searchIngredients(req: Request, res: Response) {
        const search = req.query.search as string
        const branch_id = req.query.branch_id as string

        try {
            const ingredients = await Item.searchIngredient(search, branch_id)
            ApiResponse.send(res, 200, null, ingredients)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al buscar ingredientes")
        }
    }
}