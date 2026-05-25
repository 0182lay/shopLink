import { RequestHandler } from "express";
import { HttpError } from "../utils/http-error";

type RuleType = "string" | "number" | "boolean" | "array" | "enum";

type ValidationRule = {
    type: RuleType;
    required?: boolean;
    min?: number;
    minLength?: number;
    values?: readonly string[];
    custom?: (value: unknown, body: Record<string, unknown>) => string | null;
};

type ValidationSchema = Record<string, ValidationRule>;

type ValidateOptions = {
    requireAtLeastOne?: boolean;
};

const isEmpty = (value: unknown) => {
    return value === undefined || value === null || value === "";
};

const validateValue = (
    field: string,
    value: unknown,
    rule: ValidationRule,
    body: Record<string, unknown>,
) => {
    if (isEmpty(value)) {
        return rule.required ? `${field} is required` : null;
    }

    if (rule.type === "string" && typeof value !== "string") {
        return `${field} must be a string`;
    }

    if (rule.type === "number" && Number.isNaN(Number(value))) {
        return `${field} must be a number`;
    }

    if (rule.type === "boolean" && typeof value !== "boolean") {
        return `${field} must be a boolean`;
    }

    if (rule.type === "array" && !Array.isArray(value)) {
        return `${field} must be an array`;
    }

    if (
        rule.type === "enum" &&
        (!rule.values || !rule.values.includes(String(value)))
    ) {
        return `${field} must be one of: ${rule.values?.join(", ")}`;
    }

    if (
        rule.minLength !== undefined &&
        typeof value === "string" &&
        value.trim().length < rule.minLength
    ) {
        return `${field} must be at least ${rule.minLength} characters`;
    }

    if (rule.min !== undefined && Number(value) < rule.min) {
        return `${field} must be at least ${rule.min}`;
    }

    return rule.custom?.(value, body) ?? null;
};

export const validateBody = (
    schema: ValidationSchema,
    options: ValidateOptions = {},
): RequestHandler => {
    // 1. ຮັບ schema ທີ່ກຳນົດວ່າ body ຕ້ອງມີ field ຫຍັງ
    // 2. ກວດ type, required, min ແລະ custom rule ກ່ອນເຂົ້າ controller
    // 3. ຖ້າຂໍ້ມູນຜິດຈະສົ່ງ 400 ກັບ ຖ້າຖືກຈະໄປ controller ຕໍ່
    return (req, _res, next) => {
        const errors: string[] = [];
        const body = req.body as Record<string, unknown>;

        if (options.requireAtLeastOne) {
            const hasAnyField = Object.keys(schema).some(
                (field) => !isEmpty(body[field]),
            );

            if (!hasAnyField) {
                errors.push("At least one field is required");
            }
        }

        for (const [field, rule] of Object.entries(schema)) {
            const error = validateValue(field, body[field], rule, body);

            if (error) {
                errors.push(error);
            }
        }

        if (errors.length > 0) {
            return next(new HttpError(400, errors.join(", ")));
        }

        return next();
    };
};
