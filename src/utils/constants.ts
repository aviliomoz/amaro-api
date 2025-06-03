export const ITEM_TYPES = ["supplies", "base-recipes", "products", "combos"] as const

export const PRODUCT_SUBTYPES = ["unprocessed", "transformed"] as const
export const COMBO_SUBTYPES = ["promotions", "menus", "buffets"] as const
export const SUPPLY_SUBTYPES = ["ingredients", "derivatives", "consumables"] as const
export const BASE_RECIPE_SUBTYPES = ["preparations", "portions"] as const

export const ITEM_STATUSES = ["active", "inactive"] as const
export const UMS = ["kilogram", "liter", "unit", "ounce"] as const
export const ITEM_DISCHARGE_TYPE = ["recipe", "unit"] as const