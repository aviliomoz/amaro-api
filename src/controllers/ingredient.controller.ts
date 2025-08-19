import { Request, Response } from "express"
import { Ingredient, IngredientType } from "../models/ingredient.model"
import { ApiResponse } from "../classes/response.class"
import { ItemType } from "../models/item.model"
import { UMEnum } from "../utils/types"
import { getDeepIngredients } from "../utils/recipes"

export type ConversionIngredientType = { id: string, name: string, um: UMEnum, amount: number, products: { name: string, amount: number }[] }

export class IngredientController {
    static async getItemRecipe(req: Request, res: Response) {
        const item_id = req.params.item_id as string

        try {
            const recipe = await Ingredient.getItemRecipe(item_id)
            ApiResponse.send(res, 200, null, recipe)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener la receta del ítem")
        }
    }

    static async getIngredientUses(req: Request, res: Response) {
        const ingredient_id = req.params.ingredient_id as string

        try {
            const uses = await Ingredient.getIngredientUses(ingredient_id)
            ApiResponse.send(res, 200, null, uses)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener los usos del ingrediente")
        }
    }

    static async updateRecipe(req: Request, res: Response) {
        const item_id = req.params.item_id as string
        const ingredients = req.body as IngredientType[]

        try {
            const recipe = await Ingredient.getItemRecipe(item_id)

            ingredients.forEach(async (ingredient) => {
                const found = recipe.find((i) => i.id === ingredient.id)

                if (found) {
                    await Ingredient.updateIngredient(item_id, ingredient)
                } else {
                    await Ingredient.addIngredient(item_id, ingredient)
                }
            })

            recipe.forEach(async (ingredient) => {
                const found = ingredients.find((i) => i.id === ingredient.id)

                if (!found) {
                    await Ingredient.deleteIngredient(item_id, ingredient)
                }
            })

            ApiResponse.send(res, 200, null, null, "Receta actualizada")
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al obtener la receta del ítem")
        }

    }

    static async searchIngredients(req: Request, res: Response) {
        const search = req.query.search as string
        const restaurant_id = req.query.restaurant_id as string

        try {
            const ingredients = await Ingredient.searchIngredient(search, restaurant_id)
            ApiResponse.send(res, 200, null, ingredients)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al buscar ingredientes")
        }
    }

    static async getConsumedIngredients(req: Request, res: Response) {
        const products = req.body as { item: ItemType, amount: number }[]
        const level = req.query.level as "superficial" | "deep"

        let consumedIngredients: ConversionIngredientType[] = []

        try {
            for await (const product of products) {
                if (product.item.subtype === "unprocessed") {
                    consumedIngredients.push({
                        id: product.item.id!,
                        name: product.item.name,
                        um: product.item.um,
                        amount: product.amount,
                        products: [{ name: product.item.name, amount: product.amount }]
                    })
                } else {
                    const ingredients = await Ingredient.getItemRecipe(product.item.id!)

                    for (const ingredient of ingredients) {
                        consumedIngredients.push({
                            id: ingredient.id!,
                            name: ingredient.name,
                            um: ingredient.um,
                            amount: ingredient.amount * product.amount,
                            products: [{ name: product.item.name, amount: product.amount }]
                        })
                    }
                }
            }

            if (level === "deep") {
                consumedIngredients = await getDeepIngredients(consumedIngredients);
            }

            ApiResponse.send(res, 200, null, consumedIngredients)
        } catch (error) {
            ApiResponse.send(res, 500, error, null, "Error al optener los ingredientes consumidos")
        }
    }
}