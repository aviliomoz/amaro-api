import { BASE_RECIPE_SUBTYPES, COMBO_SUBTYPES, ITEM_TYPES, PRODUCT_SUBTYPES, SUPPLY_SUBTYPES, UMS } from "./constants"

export type ItemTypeEnum = typeof ITEM_TYPES[number]

export type ProductSubtypeEnum = typeof PRODUCT_SUBTYPES[number]
export type ComboSubtypeEnum = typeof COMBO_SUBTYPES[number]
export type SupplySubtypeEnum = typeof SUPPLY_SUBTYPES[number]
export type BaseRecipeSubtypeEnum = typeof BASE_RECIPE_SUBTYPES[number]

export type ItemSubtypeEnum = ProductSubtypeEnum | ComboSubtypeEnum | SupplySubtypeEnum | BaseRecipeSubtypeEnum
export type UMEnum = typeof UMS[number]

export type AuthPayload = {
    user_id: string
}
