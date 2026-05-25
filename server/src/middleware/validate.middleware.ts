import { RequestHandler } from "express";
import { HttpError } from "../utils/http-error";

type RuleType = "string" | "number" | "boolean" | "array" | "enum";
type RuleFormat = "email" | "url" | "phone";

type ValidationRule = {
    type: RuleType;
    required?: boolean;
    min?: number;
    minLength?: number;
    maxLength?: number;
    integer?: boolean;
    format?: RuleFormat;
    values?: readonly string[];
    custom?: (value: unknown, body: Record<string, unknown>) => string | null;
};

type ValidationSchema = Record<string, ValidationRule>;

type ValidateOptions = {
    requireAtLeastOne?: boolean;
    allowUnknownFields?: boolean;
};

const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
const phonePattern = /^\+?[0-9][0-9\s()-]{4,19}$/;

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
        return rule.required ? `ຕ້ອງລະບຸ ${field}` : null;
    }

    if (rule.type === "string" && typeof value !== "string") {
        return `${field} ຕ້ອງເປັນຂໍ້ຄວາມ`;
    }

    if (rule.type === "number" && Number.isNaN(Number(value))) {
        return `${field} ຕ້ອງເປັນຕົວເລກ`;
    }

    if (rule.type === "boolean" && typeof value !== "boolean") {
        return `${field} ຕ້ອງເປັນ true ຫຼື false`;
    }

    if (rule.type === "array" && !Array.isArray(value)) {
        return `${field} ຕ້ອງເປັນລາຍການ`;
    }

    if (
        rule.type === "enum" &&
        (!rule.values || !rule.values.includes(String(value)))
    ) {
        return `${field} ຕ້ອງເປັນຄ່າໃດໜຶ່ງນີ້: ${rule.values?.join(", ")}`;
    }

    if (
        rule.minLength !== undefined &&
        typeof value === "string" &&
        value.trim().length < rule.minLength
    ) {
        return `${field} ຕ້ອງມີຢ່າງໜ້ອຍ ${rule.minLength} ຕົວອັກສອນ`;
    }

    if (
        rule.maxLength !== undefined &&
        typeof value === "string" &&
        value.trim().length > rule.maxLength
    ) {
        return `${field} ຕ້ອງບໍ່ເກີນ ${rule.maxLength} ຕົວອັກສອນ`;
    }

    if (rule.min !== undefined && Number(value) < rule.min) {
        return `${field} ຕ້ອງມີຄ່າຢ່າງໜ້ອຍ ${rule.min}`;
    }

    if (rule.integer && !Number.isInteger(Number(value))) {
        return `${field} ຕ້ອງເປັນຈຳນວນເຕັມ`;
    }

    if (rule.format === "email" && !emailPattern.test(String(value).trim())) {
        return `${field} ຕ້ອງເປັນອີເມວທີ່ຖືກຕ້ອງ`;
    }

    if (rule.format === "url") {
        try {
            const url = new URL(String(value));

            if (url.protocol !== "http:" && url.protocol !== "https:") {
                return `${field} ຕ້ອງເປັນ URL ທີ່ຖືກຕ້ອງ`;
            }
        } catch {
            return `${field} ຕ້ອງເປັນ URL ທີ່ຖືກຕ້ອງ`;
        }
    }

    if (rule.format === "phone" && !phonePattern.test(String(value).trim())) {
        return `${field} ຕ້ອງເປັນເບີໂທທີ່ຖືກຕ້ອງ`;
    }

    return rule.custom?.(value, body) ?? null;
};

const normalizeValue = (value: unknown, rule: ValidationRule) => {
    if (typeof value === "string") {
        const trimmedValue = value.trim();

        if (rule.type === "number" && trimmedValue !== "") {
            return Number(trimmedValue);
        }

        return trimmedValue;
    }

    return value;
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
        const allowedFields = new Set(Object.keys(schema));

        if (!options.allowUnknownFields) {
            const unknownFields = Object.keys(body).filter(
                (field) => !allowedFields.has(field),
            );

            if (unknownFields.length > 0) {
                errors.push(`ມີ field ທີ່ບໍ່ຮອງຮັບ: ${unknownFields.join(", ")}`);
            }
        }

        if (options.requireAtLeastOne) {
            const hasAnyField = Object.keys(schema).some(
                (field) => !isEmpty(body[field]),
            );

            if (!hasAnyField) {
                errors.push("ຕ້ອງສົ່ງຂໍ້ມູນຢ່າງໜ້ອຍ 1 field");
            }
        }

        for (const [field, rule] of Object.entries(schema)) {
            if (!isEmpty(body[field])) {
                body[field] = normalizeValue(body[field], rule);
            }

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
