import { Request, Response } from "express";
import { categoryService } from "../services/category.service";

const parseId = (id: string) => Number.parseInt(id, 10);

// 1. ຮັບຂໍ້ມູນ category ຈາກ request body
// 2. ກວດວ່າ storeId, name ແລະ slug ຖືກສົ່ງມາຫຼືບໍ່
// 3. ເອີ້ນ service ເພື່ອສ້າງ category ໃນ database
export const createCategory = async (req: Request, res: Response) => {
    const { storeId, name, slug, iconUrl } = req.body;
    const parsedStoreId = Number(storeId);

    if (!parsedStoreId || !name || !slug) {
        return res.status(400).json({
            success: false,
            message: "ຕ້ອງລະບຸ store id, ຊື່ໝວດໝູ່ ແລະ slug",
        });
    }

    const category = await categoryService.createCategory({
        storeId: parsedStoreId,
        name,
        slug,
        iconUrl,
    });

    return res.status(201).json({
        success: true,
        data: category,
    });
};

// 1. ຮັບ request ເພື່ອດຶງ category ທັງໝົດ
// 2. ເອີ້ນ service ໃຫ້ດຶງແຕ່ category ທີ່ຍັງບໍ່ຖືກລຶບ
// 3. ສົ່ງລາຍການ category ກັບໄປໃຫ້ client
export const getCategories = async (_req: Request, res: Response) => {
    const categories = await categoryService.getAllCategories();

    return res.status(200).json({
        success: true,
        data: categories,
    });
};

// 1. ຮັບ storeId ຈາກ URL
// 2. ກວດວ່າ storeId ເປັນຕົວເລກຖືກຕ້ອງຫຼືບໍ່
// 3. ດຶງ category ຂອງຮ້ານນັ້ນແລ້ວສົ່ງກັບ
export const getCategoriesByStoreId = async (
    req: Request<{ storeId: string }>,
    res: Response,
) => {
    const storeId = parseId(req.params.storeId);

    if (Number.isNaN(storeId)) {
        return res.status(400).json({
            success: false,
            message: "store id ບໍ່ຖືກຕ້ອງ",
        });
    }

    const categories = await categoryService.getCategoriesByStoreId(storeId);

    return res.status(200).json({
        success: true,
        data: categories,
    });
};

// 1. ຮັບ id ຂອງ category ຈາກ URL
// 2. ກວດວ່າ id ເປັນຕົວເລກຖືກຕ້ອງຫຼືບໍ່
// 3. ດຶງ category ຈາກ database ແລ້ວສົ່ງກັບ
export const getCategoryById = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const id = parseId(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "category id ບໍ່ຖືກຕ້ອງ",
        });
    }

    const category = await categoryService.getCategoryById(id);

    if (!category) {
        return res.status(404).json({
            success: false,
            message: "ບໍ່ພົບໝວດໝູ່",
        });
    }

    return res.status(200).json({
        success: true,
        data: category,
    });
};

// 1. ຮັບ id ຈາກ URL ແລະຂໍ້ມູນໃໝ່ຈາກ body
// 2. ກວດ id ໃຫ້ຖືກຕ້ອງ
// 3. ເອີ້ນ service ເພື່ອ update category
export const updateCategory = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const id = parseId(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "category id ບໍ່ຖືກຕ້ອງ",
        });
    }

    const { name, slug, iconUrl, isActive } = req.body;
    const category = await categoryService.updateCategory(id, {
        name,
        slug,
        iconUrl,
        isActive,
    });

    return res.status(200).json({
        success: true,
        data: category,
    });
};

// 1. ຮັບ id ຂອງ category ທີ່ຈະລຶບ
// 2. ກວດ id ໃຫ້ຖືກຕ້ອງ
// 3. ເຮັດ soft delete ໂດຍຕັ້ງ deletedAt ແທນການລຶບຖາວອນ
export const deleteCategory = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const id = parseId(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "category id ບໍ່ຖືກຕ້ອງ",
        });
    }

    const category = await categoryService.softDeleteCategory(id);

    return res.status(200).json({
        success: true,
        data: category,
    });
};

// 1. ຮັບ id ຂອງ category ທີ່ຈະກູ້ຄືນ
// 2. ກວດ id ໃຫ້ຖືກຕ້ອງ
// 3. ຕັ້ງ deletedAt ເປັນ null ເພື່ອໃຫ້ category ກັບມາໃຊ້ງານ
export const restoreCategory = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const id = parseId(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "category id ບໍ່ຖືກຕ້ອງ",
        });
    }

    const category = await categoryService.restoreCategory(id);

    return res.status(200).json({
        success: true,
        data: category,
    });
};
