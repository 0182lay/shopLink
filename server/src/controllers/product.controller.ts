import { Request, Response } from "express";
import { productService } from "../services/product.service";

const parseId = (id: string) => Number.parseInt(id, 10);

// 1. ຮັບຂໍ້ມູນ product ຈາກ request body
// 2. ກວດວ່າ storeId, name ແລະ price ຖືກສົ່ງມາຫຼືບໍ່
// 3. ເອີ້ນ service ເພື່ອສ້າງ product ໃນ database
export const createProduct = async (req: Request, res: Response) => {
    const {
        storeId,
        categoryId,
        name,
        description,
        price,
        stock,
        imageUrl,
        isFeatured,
    } = req.body;
    const parsedStoreId = Number(storeId);
    const parsedCategoryId =
        categoryId === undefined || categoryId === null
            ? undefined
            : Number(categoryId);
    const parsedPrice = Number(price);
    const parsedStock =
        stock === undefined || stock === null ? undefined : Number(stock);

    if (!parsedStoreId || !name || Number.isNaN(parsedPrice)) {
        return res.status(400).json({
            success: false,
            message: "ຕ້ອງລະບຸ store id, ຊື່ສິນຄ້າ ແລະ ລາຄາ",
        });
    }

    const product = await productService.createProduct({
        storeId: parsedStoreId,
        categoryId: parsedCategoryId,
        name,
        description,
        price: parsedPrice,
        stock: parsedStock,
        imageUrl,
        isFeatured,
    });

    return res.status(201).json({
        success: true,
        data: product,
    });
};

// 1. ຮັບ request ເພື່ອດຶງ product ທັງໝົດ
// 2. ເອີ້ນ service ໃຫ້ດຶງແຕ່ product ທີ່ຍັງບໍ່ຖືກລຶບ
// 3. ສົ່ງລາຍການ product ກັບໄປໃຫ້ client
export const getProducts = async (_req: Request, res: Response) => {
    const products = await productService.getAllProducts();

    return res.status(200).json({
        success: true,
        data: products,
    });
};

export const getFeaturedProducts = async (_req: Request, res: Response) => {
    const products = await productService.getFeaturedProducts();

    return res.status(200).json({
        success: true,
        data: products,
    });
};

// 1. ຮັບ storeId ຈາກ URL
// 2. ກວດວ່າ storeId ເປັນຕົວເລກຖືກຕ້ອງຫຼືບໍ່
// 3. ດຶງ product ຂອງຮ້ານນັ້ນແລ້ວສົ່ງກັບ
export const getProductsByStoreId = async (
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

    const products = await productService.getProductsByStoreId(storeId);

    return res.status(200).json({
        success: true,
        data: products,
    });
};

// 1. ຮັບ categoryId ຈາກ URL
// 2. ກວດວ່າ categoryId ເປັນຕົວເລກຖືກຕ້ອງຫຼືບໍ່
// 3. ດຶງ product ໃນ category ນັ້ນແລ້ວສົ່ງກັບ
export const getProductsByCategoryId = async (
    req: Request<{ categoryId: string }>,
    res: Response,
) => {
    const categoryId = parseId(req.params.categoryId);

    if (Number.isNaN(categoryId)) {
        return res.status(400).json({
            success: false,
            message: "category id ບໍ່ຖືກຕ້ອງ",
        });
    }

    const products = await productService.getProductsByCategoryId(categoryId);

    return res.status(200).json({
        success: true,
        data: products,
    });
};

// 1. ຮັບ id ຂອງ product ຈາກ URL
// 2. ກວດວ່າ id ເປັນຕົວເລກຖືກຕ້ອງຫຼືບໍ່
// 3. ດຶງ product ຈາກ database ແລ້ວສົ່ງກັບ
export const getProductById = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const id = parseId(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "product id ບໍ່ຖືກຕ້ອງ",
        });
    }

    const product = await productService.getProductById(id);

    if (!product) {
        return res.status(404).json({
            success: false,
            message: "ບໍ່ພົບສິນຄ້າ",
        });
    }

    return res.status(200).json({
        success: true,
        data: product,
    });
};

// 1. ຮັບ id ຈາກ URL ແລະຂໍ້ມູນໃໝ່ຈາກ body
// 2. ກວດ id ໃຫ້ຖືກຕ້ອງ
// 3. ເອີ້ນ service ເພື່ອ update product
export const updateProduct = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const id = parseId(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "product id ບໍ່ຖືກຕ້ອງ",
        });
    }

    const {
        storeId,
        categoryId,
        name,
        description,
        price,
        stock,
        imageUrl,
        isActive,
        isFeatured,
    } = req.body;
    const product = await productService.updateProduct(id, {
        storeId: storeId === undefined ? undefined : Number(storeId),
        categoryId:
            categoryId === undefined || categoryId === null
                ? undefined
                : Number(categoryId),
        name,
        description,
        price: price === undefined ? undefined : Number(price),
        stock: stock === undefined ? undefined : Number(stock),
        imageUrl,
        isActive,
        isFeatured,
    });

    return res.status(200).json({
        success: true,
        data: product,
    });
};

// 1. ຮັບ id ຂອງ product ທີ່ຈະລຶບ
// 2. ກວດ id ໃຫ້ຖືກຕ້ອງ
// 3. ເຮັດ soft delete ໂດຍຕັ້ງ deletedAt ແທນການລຶບຖາວອນ
export const deleteProduct = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const id = parseId(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "product id ບໍ່ຖືກຕ້ອງ",
        });
    }

    const product = await productService.softDeleteProduct(id);

    return res.status(200).json({
        success: true,
        data: product,
    });
};

// 1. ຮັບ id ຂອງ product ທີ່ຈະກູ້ຄືນ
// 2. ກວດ id ໃຫ້ຖືກຕ້ອງ
// 3. ຕັ້ງ deletedAt ເປັນ null ເພື່ອໃຫ້ product ກັບມາໃຊ້ງານ
export const restoreProduct = async (
    req: Request<{ id: string }>,
    res: Response,
) => {
    const id = parseId(req.params.id);

    if (Number.isNaN(id)) {
        return res.status(400).json({
            success: false,
            message: "product id ບໍ່ຖືກຕ້ອງ",
        });
    }

    const product = await productService.restoreProduct(id);

    return res.status(200).json({
        success: true,
        data: product,
    });
};
