import { prisma } from "../config/prisma";

const publicProductSelect = {
    id: true,
    storeId: true,
    categoryId: true,
    name: true,
    description: true,
    price: true,
    stock: true,
    imageUrl: true,
    isActive: true,
    isFeatured: true,
} as const;

type CreateProductData = {
    storeId: number;
    categoryId?: number;
    name: string;
    description?: string;
    price: number;
    stock?: number;
    imageUrl?: string;
    isFeatured?: boolean;
};

type UpdateProductData = Partial<Omit<CreateProductData, "storeId">> & {
    storeId?: number;
    isActive?: boolean;
};

export const productService = {
    // 1. ດຶງ product ທັງໝົດຈາກ database
    // 2. ເລືອກແຕ່ product ທີ່ຍັງບໍ່ຖືກ soft delete
    // 3. ຈັດລຽງ product ໃໝ່ສຸດໄວ້ເທິງ
    getAllProducts() {
        return prisma.product.findMany({
            where: {
                deletedAt: null,
                isActive: true,
            },
            select: publicProductSelect,
            orderBy: {
                createdAt: "desc",
            },
        });
    },

    getFeaturedProducts() {
        return prisma.product.findMany({
            where: {
                deletedAt: null,
                isActive: true,
                isFeatured: true,
            },
            select: publicProductSelect,
            orderBy: {
                createdAt: "desc",
            },
        });
    },

    // 1. ຮັບ storeId ຈາກ controller
    // 2. ດຶງ product ຂອງຮ້ານນັ້ນ
    // 3. ບໍ່ດຶງ product ທີ່ຖືກ soft delete ແລ້ວ
    getProductsByStoreId(storeId: number) {
        return prisma.product.findMany({
            where: {
                storeId,
                deletedAt: null,
                isActive: true,
            },
            select: publicProductSelect,
            orderBy: {
                createdAt: "desc",
            },
        });
    },

    // 1. ຮັບ categoryId ຈາກ controller
    // 2. ດຶງ product ໃນ category ນັ້ນ
    // 3. ບໍ່ດຶງ product ທີ່ຖືກ soft delete ແລ້ວ
    getProductsByCategoryId(categoryId: number) {
        return prisma.product.findMany({
            where: {
                categoryId,
                deletedAt: null,
                isActive: true,
            },
            select: publicProductSelect,
            orderBy: {
                createdAt: "desc",
            },
        });
    },

    // 1. ຮັບ id ຈາກ controller
    // 2. ຄົ້ນຫາ product ຕາມ id
    // 3. ບໍ່ດຶງ product ທີ່ຖືກ soft delete ແລ້ວ
    getProductById(id: number) {
        return prisma.product.findFirst({
            where: {
                id,
                deletedAt: null,
                isActive: true,
            },
            select: publicProductSelect,
        });
    },

    // 1. ຮັບຂໍ້ມູນ product ໃໝ່
    // 2. ສ້າງ record ໃນຕາຕະລາງ products
    // 3. ສົ່ງຂໍ້ມູນ product ທີ່ສ້າງກັບ
    createProduct(data: CreateProductData) {
        return prisma.product.create({
            data,
        });
    },

    // 1. ຮັບ id ແລະຂໍ້ມູນທີ່ຈະແກ້
    // 2. update record ໃນ database
    // 3. ສົ່ງຂໍ້ມູນ product ຫຼັງ update ກັບ
    updateProduct(id: number, data: UpdateProductData) {
        return prisma.product.update({
            where: {
                id,
            },
            data,
        });
    },

    // 1. ຮັບ id ຂອງ product
    // 2. ຕັ້ງ deletedAt ເປັນວັນເວລາປັດຈຸບັນ
    // 3. ປິດ isActive ເພື່ອຊ່ອນ product
    softDeleteProduct(id: number) {
        return prisma.product.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
                isActive: false,
            },
        });
    },

    // 1. ຮັບ id ຂອງ product
    // 2. ຕັ້ງ deletedAt ກັບເປັນ null
    // 3. ເປີດ isActive ເພື່ອໃຫ້ product ກັບມາສະແດງ
    restoreProduct(id: number) {
        return prisma.product.update({
            where: {
                id,
            },
            data: {
                deletedAt: null,
                isActive: true,
            },
        });
    },
};
