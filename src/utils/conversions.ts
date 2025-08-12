import { UMEnum } from "./types";

export const umConversion = (amount: number, fromUM: UMEnum, toUM: UMEnum): number => {
    if (fromUM === toUM) return amount;

    if (fromUM === "ounce" && toUM === "kilogram") {
        return amount * 0.0283495; // 1 ounce = 0.0283495 kilograms
    }

    if (fromUM === "kilogram" && toUM === "ounce") {
        return amount / 0.0283495; // 1 kilogram = 35.274 ounces
    }

    if (fromUM === "ounce" && toUM === "liter") {
        return amount * 0.0295735; // 1 ounce = 0.0295735 liters
    }

    if (fromUM === "liter" && toUM === "ounce") {
        return amount / 0.0295735; // 1 liter = 33.814 ounces
    }

    return amount; // If no conversion is needed, return the original amount
}