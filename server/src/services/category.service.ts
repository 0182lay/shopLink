import { prisma } from "../config/prisma";

type CreateCategoryData = {
    storeId: number;
    name: string;
    slug: string;
    iconUrl?: string;
};

type UpdateCategoryData = Partial<Omit<CreateCategoryData, "storeId">> & {
    isActive?: boolean;
};

export const categoryService = {
    // 1. ດຶງ category ທັງໝົດຈາກ database
    // 2. ເລືອກແຕ່ category ທີ່ຍັງບໍ່ຖືກ soft delete
    // 3. ຈັດລຽງຂໍ້ມູນໃໝ່ສຸດໄວ້ເທິງ
    getAllCategories() {
        return prisma.category.findMany({
            where: {
                deletedAt: null,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },

    // 1. ຮັບ storeId ຈາກ controller
    // 2. ດຶງ category ຂອງຮ້ານນັ້ນ
    // 3. ບໍ່ດຶງ category ທີ່ຖືກ soft delete ແລ້ວ
    getCategoriesByStoreId(storeId: number) {
        return prisma.category.findMany({
            where: {
                storeId,
                deletedAt: null,
            },
            orderBy: {
                createdAt: "desc",
            },
        });
    },

    // 1. ຮັບ id ຈາກ controller
    // 2. ຄົ້ນຫາ category ຕາມ id
    // 3. ບໍ່ດຶງ category ທີ່ຖືກ soft delete ແລ້ວ
    getCategoryById(id: number) {
        return prisma.category.findFirst({
            where: {
                id,
                deletedAt: null,
            },
        });
    },

    // 1. ຮັບຂໍ້ມູນ category ໃໝ່
    // 2. ສ້າງ record ໃນຕາຕະລາງ categories
    // 3. ສົ່ງຂໍ້ມູນ category ທີ່ສ້າງກັບ
    createCategory(data: CreateCategoryData) {
        return prisma.category.create({
            data,
        });
    },

    // 1. ຮັບ id ແລະຂໍ້ມູນທີ່ຈະແກ້
    // 2. update record ໃນ database
    // 3. ສົ່ງຂໍ້ມູນ category ຫຼັງ update ກັບ
    updateCategory(id: number, data: UpdateCategoryData) {
        return prisma.category.update({
            where: {
                id,
            },
            data,
        });
    },

    // 1. ຮັບ id ຂອງ category
    // 2. ຕັ້ງ deletedAt ເປັນວັນເວລາປັດຈຸບັນ
    // 3. ປິດ isActive ເພື່ອຊ່ອນ category
    softDeleteCategory(id: number) {
        return prisma.category.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
                isActive: false,
            },
        });
    },

    // 1. ຮັບ id ຂອງ category
    // 2. ຕັ້ງ deletedAt ກັບເປັນ null
    // 3. ເປີດ isActive ເພື່ອໃຫ້ category ກັບມາສະແດງ
    restoreCategory(id: number) {
        return prisma.category.update({
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
