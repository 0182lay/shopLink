export class HttpError extends Error {
    statusCode: number;
    isOperational: boolean;

    // 1. ສ້າງ error ແບບທີ່ເຮົາກຳນົດ status code ໄດ້
    // 2. ໃຊ້ເວລາຢາກສົ່ງ error ທີ່ອ່ານງ່າຍໃຫ້ client
    // 3. ສົ່ງຕໍ່ໃຫ້ error middleware ຈັດ response ກາງ
    constructor(statusCode: number, message: string) {
        super(message);

        this.statusCode = statusCode;
        this.isOperational = true;
    }
}
