import { prisma } from "../config/prisma";

const publicStoreSelect = {
    id: true,
    name: true,
    slug: true,
    description: true,
    logoUrl: true,
    bannerUrl: true,
    isActive: true,
} as const;

type CreateStoreData = {
    name: string;
    slug: string;
    description?: string;
    logoUrl?: string;
    bannerUrl?: string;
};

type UpdateStoreData = Partial<CreateStoreData> & {
    isActive?: boolean;
};

export const storeService = {
    // 1. ດຶງຮ້ານທັງໝົດຈາກ database
    // 2. ເລືອກແຕ່ຮ້ານທີ່ deletedAt ເປັນ null
    // 3. ຈັດລຽງຮ້ານໃໝ່ສຸດໄວ້ເທິງ
    getAllStores() {
        return prisma.store.findMany({
            where: {
                deletedAt: null,
                isActive: true,
            },
            select: publicStoreSelect,
            orderBy: {
                createdAt: "desc",
            },
        });
    },

    // 1. ຮັບ id ຈາກ controller
    // 2. ຄົ້ນຫາຮ້ານຕາມ id
    // 3. ບໍ່ດຶງຮ້ານທີ່ຖືກ soft delete ແລ້ວ
    getStoreById(id: number) {
        return prisma.store.findFirst({
            where: {
                id,
                deletedAt: null,
                isActive: true,
            },
            select: publicStoreSelect,
        });
    },

    // 1. ຮັບ slug ຈາກ controller
    // 2. ຄົ້ນຫາຮ້ານຕາມ slug
    // 3. ບໍ່ດຶງຮ້ານທີ່ຖືກ soft delete ແລ້ວ
    getStoreBySlug(slug: string) {
        return prisma.store.findFirst({
            where: {
                slug,
                deletedAt: null,
                isActive: true,
            },
            select: publicStoreSelect,
        });
    },

    // 1. ຮັບຂໍ້ມູນຮ້ານໃໝ່
    // 2. ສ້າງ record ໃນຕາຕະລາງ stores
    // 3. ສົ່ງຂໍ້ມູນຮ້ານທີ່ສ້າງກັບ
    createStore(data: CreateStoreData) {
        return prisma.store.create({
            data,
        });
    },

    // 1. ຮັບ id ແລະຂໍ້ມູນທີ່ຈະແກ້
    // 2. update record ໃນ database
    // 3. ສົ່ງຂໍ້ມູນຮ້ານຫຼັງ update ກັບ
    updateStore(id: number, data: UpdateStoreData) {
        return prisma.store.update({
            where: {
                id,
            },
            data,
        });
    },

    // 1. ຮັບ id ຂອງຮ້ານ
    // 2. ຕັ້ງ deletedAt ເປັນວັນເວລາປັດຈຸບັນ
    // 3. ປິດ isActive ເພື່ອຊ່ອນຮ້ານຈາກໜ້າ public
    softDeleteStore(id: number) {
        return prisma.store.update({
            where: {
                id,
            },
            data: {
                deletedAt: new Date(),
                isActive: false,
            },
        });
    },

    // 1. ຮັບ id ຂອງຮ້ານ
    // 2. ຕັ້ງ deletedAt ກັບເປັນ null
    // 3. ເປີດ isActive ເພື່ອໃຫ້ຮ້ານກັບມາສະແດງ
    restoreStore(id: number) {
        return prisma.store.update({
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
