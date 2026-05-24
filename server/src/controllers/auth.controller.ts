import { Request, Response } from "express";
import { authService } from "../services/auth.service";

// 1. ຮັບ name, email ແລະ password ຈາກ request body
// 2. ກວດວ່າຂໍ້ມູນຈຳເປັນຖືກສົ່ງມາຄົບຫຼືບໍ່
// 3. ເອີ້ນ service ເພື່ອສ້າງ admin ແລະສົ່ງ token ກັບ
export const registerAdmin = async (req: Request, res: Response) => {
    const { name, email, password } = req.body;

    if (!name || !email || !password) {
        return res.status(400).json({
            success: false,
            message: "Name, email and password are required",
        });
    }

    const result = await authService.registerAdmin({
        name,
        email,
        password,
    });

    return res.status(201).json({
        success: true,
        data: result.admin,
        token: result.token,
    });
};

// 1. ຮັບ email ແລະ password ຈາກ request body
// 2. ກວດວ່າສົ່ງຂໍ້ມູນ login ມາຄົບຫຼືບໍ່
// 3. ເອີ້ນ service ເພື່ອກວດຕົວຕົນ ແລະສົ່ງ JWT token ກັບ
export const loginAdmin = async (req: Request, res: Response) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({
            success: false,
            message: "Email and password are required",
        });
    }

    const result = await authService.loginAdmin({
        email,
        password,
    });

    return res.status(200).json({
        success: true,
        data: result.admin,
        token: result.token,
    });
};
