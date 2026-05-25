import { Request, Response } from "express";
import { storeService } from "../services/store.service";

const parseId = (id: string) => Number.parseInt(id, 10);

// 1. ຮັບຂໍ້ມູນຮ້ານຈາກ request body
// 2. ກວດວ່າ name ແລະ slug ຖືກສົ່ງມາຫຼືບໍ່
// 3. ເອີ້ນ service ເພື່ອສ້າງຮ້ານໃນ database
export const createStore = async (req: Request, res: Response) => {
    const { name, slug, description, logoUrl } = req.body;

    if (!name || !slug) {
        return res.status(400).json({
            success: false,
            message: "ຕ້ອງລະບຸຊື່ຮ້ານ ແລະ slug",
        });
    }

    const store = await storeService.createStore({
        name,
        slug,
        description,
        logoUrl,
    });

    return res.status(201).json({
        success: true,
        data: store,
    });
};

// 1. ຮັບ request ເພື່ອດຶງຮ້ານທັງໝົດ
// 2. ເອີ້ນ service ໃຫ້ດຶງແຕ່ຮ້ານທີ່ຍັງບໍ່ຖືກລຶບ
// 3. ສົ່ງລາຍການຮ້ານກັບໄປໃຫ້ client
export const getStores = async (_req: Request, res: Response) => {
    const stores = await storeService.getAllStores();

    return res.status(200).json({
        success: true,
        data: stores,
    });
};

// 1. ຮັບ id ຂອງຮ້ານຈາກ URL
// 2. ກວດວ່າ id ເປັນຕົວເລກຖືກຕ້ອງຫຼືບໍ່
// 3. ດຶງຮ້ານຈາກ database ແລ້ວສົ່ງກັບ
export const getStoreById = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const id = parseId(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "store id ບໍ່ຖືກຕ້ອງ",
        });
    }

    const store = await storeService.getStoreById(id);

    if (!store) {
        return res.status(404).json({
            success: false,
            message: "ບໍ່ພົບຮ້ານ",
        });
    }

    return res.status(200).json({
        success: true,
        data: store,
    });
};

// 1. ຮັບ slug ຂອງຮ້ານຈາກ URL
// 2. ເອີ້ນ service ເພື່ອຄົ້ນຫາຮ້ານຕາມ slug
// 3. ຖ້າພົບກໍສົ່ງຂໍ້ມູນກັບ ຖ້າບໍ່ພົບສົ່ງ 404
export const getStoreBySlug = async (
    req: Request<{ slug: string }>,
    res: Response,
) => {
    const store = await storeService.getStoreBySlug(req.params.slug);

    if (!store) {
        return res.status(404).json({
            success: false,
            message: "ບໍ່ພົບຮ້ານ",
        });
    }

    return res.status(200).json({
        success: true,
        data: store,
    });
};

// 1. ຮັບ id ຈາກ URL ແລະຂໍ້ມູນໃໝ່ຈາກ body
// 2. ກວດ id ໃຫ້ຖືກຕ້ອງ
// 3. ເອີ້ນ service ເພື່ອ update ຮ້ານ
export const updateStore = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const id = parseId(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "store id ບໍ່ຖືກຕ້ອງ",
        });
    }

    const { name, slug, description, logoUrl, isActive } = req.body;
    const store = await storeService.updateStore(id, {
        name,
        slug,
        description,
        logoUrl,
        isActive,
    });

    return res.status(200).json({
        success: true,
        data: store,
    });
};

// 1. ຮັບ id ຂອງຮ້ານທີ່ຈະລຶບ
// 2. ກວດ id ໃຫ້ຖືກຕ້ອງ
// 3. ເຮັດ soft delete ໂດຍຕັ້ງ deletedAt ແທນການລຶບຖາວອນ
export const deleteStore = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const id = parseId(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "store id ບໍ່ຖືກຕ້ອງ",
        });
    }

    const store = await storeService.softDeleteStore(id);

    return res.status(200).json({
        success: true,
        data: store,
    });
};

// 1. ຮັບ id ຂອງຮ້ານທີ່ຈະກູ້ຄືນ
// 2. ກວດ id ໃຫ້ຖືກຕ້ອງ
// 3. ຕັ້ງ deletedAt ເປັນ null ເພື່ອໃຫ້ຮ້ານກັບມາໃຊ້ງານ
export const restoreStore = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const id = parseId(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "store id ບໍ່ຖືກຕ້ອງ",
        });
    }

    const store = await storeService.restoreStore(id);

    return res.status(200).json({
        success: true,
        data: store,
    });
};
