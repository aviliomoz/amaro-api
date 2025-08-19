import { ConversionIngredientType } from "../controllers/ingredient.controller";
import { Derivative } from "../models/derivative.model";
import { Ingredient } from "../models/ingredient.model";
import { Item, ItemType } from "../models/item.model";
import { umConversion } from "./conversions";

export const getDeepIngredients = async (ingredients: ConversionIngredientType[]): Promise<ConversionIngredientType[]> => {
    let supplies: ConversionIngredientType[] = []

    for await (const ingredient of ingredients) {

        const parentItem = await Item.getItemById(ingredient.id)

        if (parentItem.type === "products" || parentItem.type === "supplies") {

            if (parentItem.um !== ingredient.um) {
                supplies.push({
                    ...ingredient,
                    um: parentItem.um,
                    amount: (umConversion(ingredient.amount, ingredient.um, parentItem.equivalence_um!)) / parentItem.equivalence_amount!,
                    products: ingredient.products
                })
            } else if (parentItem.subtype === "derivatives") {
                const mainSupply = await Derivative.getDerivativeParentItem(parentItem.id!)
                supplies.push({
                    id: mainSupply.id!,
                    name: mainSupply.name,
                    um: mainSupply.um,
                    amount: ingredient.amount / ((100 - mainSupply.waste) / 100),
                    products: ingredient.products
                })
            } else {
                supplies.push(ingredient)
            }
        } else if (parentItem.type == "base-recipes") {
            const recipe = await Ingredient.getItemRecipe(ingredient.id)
            let recipeIngredients: ConversionIngredientType[] = [];

            for await (const recipeIngredient of recipe) {

                const yieldCalc = umConversion(parentItem.yield, parentItem.um, ingredient.um);

                recipeIngredients.push({
                    id: recipeIngredient.id,
                    name: recipeIngredient.name,
                    um: recipeIngredient.um,
                    amount: ingredient.amount * recipeIngredient.amount / yieldCalc,
                    products: ingredient.products
                });

            }
            // Recursively get deep ingredients for the recipe
            // This will flatten the recipe ingredients into a single array of supplies
            const deepIngredients = await getDeepIngredients(recipeIngredients);
            supplies.push(...deepIngredients);

        } else {
            supplies.push(ingredient)
        }
    }

    return supplies
}