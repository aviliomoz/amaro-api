import { ITEM_TYPES } from "./constants"

export type ItemType = typeof ITEM_TYPES[number]

export type AuthPayload = {
    user_id: string
}
