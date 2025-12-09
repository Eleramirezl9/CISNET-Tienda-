-- AlterTable
ALTER TABLE "ordenes" ADD COLUMN     "estado_pago" VARCHAR(50) NOT NULL DEFAULT 'pendiente',
ADD COLUMN     "paypal_capture_id" VARCHAR(255),
ADD COLUMN     "paypal_order_id" VARCHAR(255);
