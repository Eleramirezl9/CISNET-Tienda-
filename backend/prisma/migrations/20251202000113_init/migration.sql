-- CreateTable
CREATE TABLE "productos" (
    "id" TEXT NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "descripcion" TEXT NOT NULL,
    "slug" VARCHAR(255) NOT NULL,
    "precio" DECIMAL(10,2) NOT NULL,
    "precioAnterior" DECIMAL(10,2),
    "stock" INTEGER NOT NULL DEFAULT 0,
    "imagenPrincipal" VARCHAR(500) NOT NULL,
    "imagenes" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "categoriaId" TEXT NOT NULL,
    "categoria" VARCHAR(100) NOT NULL,
    "etiquetas" TEXT[] DEFAULT ARRAY[]::TEXT[],
    "caracteristicas" JSONB NOT NULL DEFAULT '{}',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "destacado" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "productos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "usuarios" (
    "id" TEXT NOT NULL,
    "email" VARCHAR(255) NOT NULL,
    "password" VARCHAR(255) NOT NULL,
    "nombre" VARCHAR(200) NOT NULL,
    "apellido" VARCHAR(200),
    "telefono" VARCHAR(20),
    "rol" VARCHAR(50) NOT NULL DEFAULT 'cliente',
    "activo" BOOLEAN NOT NULL DEFAULT true,
    "email_verificado" BOOLEAN NOT NULL DEFAULT false,
    "refresh_token_hash" VARCHAR(255),
    "refresh_token_expira" TIMESTAMP(3),
    "proveedor_oauth" VARCHAR(50),
    "proveedor_id" VARCHAR(255),
    "foto" VARCHAR(500),
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "usuarios_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "direcciones" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "nombre" VARCHAR(100) NOT NULL,
    "direccion_linea_1" VARCHAR(255) NOT NULL,
    "direccion_linea_2" VARCHAR(255),
    "ciudad" VARCHAR(100) NOT NULL,
    "departamento" VARCHAR(100) NOT NULL,
    "codigo_postal" VARCHAR(20),
    "telefono" VARCHAR(20) NOT NULL,
    "predeterminada" BOOLEAN NOT NULL DEFAULT false,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,

    CONSTRAINT "direcciones_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pedidos" (
    "id" TEXT NOT NULL,
    "usuario_id" TEXT NOT NULL,
    "direccion_id" TEXT NOT NULL,
    "estado" VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    "subtotal" DECIMAL(10,2) NOT NULL,
    "impuestos" DECIMAL(10,2) NOT NULL,
    "envio" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "metodo_pago" VARCHAR(50) NOT NULL,
    "estado_pago" VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    "notas_cliente" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pedidos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_pedido" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "items_pedido_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "pagos" (
    "id" TEXT NOT NULL,
    "pedido_id" TEXT NOT NULL,
    "metodo_pago" VARCHAR(50) NOT NULL,
    "proveedor" VARCHAR(50) NOT NULL,
    "transaccion_id" VARCHAR(255),
    "estado" VARCHAR(50) NOT NULL,
    "monto" DECIMAL(10,2) NOT NULL,
    "moneda" VARCHAR(3) NOT NULL DEFAULT 'GTQ',
    "metadatos" JSONB DEFAULT '{}',
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "pagos_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "ordenes" (
    "id" TEXT NOT NULL,
    "numero_orden" VARCHAR(20) NOT NULL,
    "nombre_completo" VARCHAR(200) NOT NULL,
    "telefono" VARCHAR(8) NOT NULL,
    "email" VARCHAR(255),
    "direccion" VARCHAR(500) NOT NULL,
    "departamento" VARCHAR(100) NOT NULL,
    "municipio" VARCHAR(100) NOT NULL,
    "zona_o_colonia" VARCHAR(100) NOT NULL,
    "referencia" VARCHAR(200),
    "estado" VARCHAR(50) NOT NULL DEFAULT 'pendiente',
    "metodo_pago" VARCHAR(50) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,
    "impuestos" DECIMAL(10,2) NOT NULL,
    "envio" DECIMAL(10,2) NOT NULL,
    "total" DECIMAL(10,2) NOT NULL,
    "notas" TEXT,
    "fecha_creacion" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "fecha_actualizacion" TIMESTAMP(3) NOT NULL,

    CONSTRAINT "ordenes_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "items_orden" (
    "id" TEXT NOT NULL,
    "orden_id" TEXT NOT NULL,
    "producto_id" TEXT NOT NULL,
    "nombre_producto" VARCHAR(200) NOT NULL,
    "cantidad" INTEGER NOT NULL,
    "precio_unitario" DECIMAL(10,2) NOT NULL,
    "subtotal" DECIMAL(10,2) NOT NULL,

    CONSTRAINT "items_orden_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "productos_slug_key" ON "productos"("slug");

-- CreateIndex
CREATE INDEX "productos_categoriaId_idx" ON "productos"("categoriaId");

-- CreateIndex
CREATE INDEX "productos_slug_idx" ON "productos"("slug");

-- CreateIndex
CREATE INDEX "productos_activo_destacado_idx" ON "productos"("activo", "destacado");

-- CreateIndex
CREATE INDEX "productos_precio_idx" ON "productos"("precio");

-- CreateIndex
CREATE UNIQUE INDEX "usuarios_email_key" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_email_idx" ON "usuarios"("email");

-- CreateIndex
CREATE INDEX "usuarios_proveedor_oauth_proveedor_id_idx" ON "usuarios"("proveedor_oauth", "proveedor_id");

-- CreateIndex
CREATE INDEX "direcciones_usuario_id_idx" ON "direcciones"("usuario_id");

-- CreateIndex
CREATE INDEX "pedidos_usuario_id_idx" ON "pedidos"("usuario_id");

-- CreateIndex
CREATE INDEX "pedidos_estado_idx" ON "pedidos"("estado");

-- CreateIndex
CREATE INDEX "pedidos_fecha_creacion_idx" ON "pedidos"("fecha_creacion");

-- CreateIndex
CREATE INDEX "items_pedido_pedido_id_idx" ON "items_pedido"("pedido_id");

-- CreateIndex
CREATE INDEX "items_pedido_producto_id_idx" ON "items_pedido"("producto_id");

-- CreateIndex
CREATE UNIQUE INDEX "pagos_pedido_id_key" ON "pagos"("pedido_id");

-- CreateIndex
CREATE UNIQUE INDEX "pagos_transaccion_id_key" ON "pagos"("transaccion_id");

-- CreateIndex
CREATE INDEX "pagos_transaccion_id_idx" ON "pagos"("transaccion_id");

-- CreateIndex
CREATE INDEX "pagos_estado_idx" ON "pagos"("estado");

-- CreateIndex
CREATE UNIQUE INDEX "ordenes_numero_orden_key" ON "ordenes"("numero_orden");

-- CreateIndex
CREATE INDEX "ordenes_numero_orden_idx" ON "ordenes"("numero_orden");

-- CreateIndex
CREATE INDEX "ordenes_estado_idx" ON "ordenes"("estado");

-- CreateIndex
CREATE INDEX "ordenes_telefono_idx" ON "ordenes"("telefono");

-- CreateIndex
CREATE INDEX "ordenes_fecha_creacion_idx" ON "ordenes"("fecha_creacion");

-- CreateIndex
CREATE INDEX "items_orden_orden_id_idx" ON "items_orden"("orden_id");

-- CreateIndex
CREATE INDEX "items_orden_producto_id_idx" ON "items_orden"("producto_id");

-- AddForeignKey
ALTER TABLE "direcciones" ADD CONSTRAINT "direcciones_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_usuario_id_fkey" FOREIGN KEY ("usuario_id") REFERENCES "usuarios"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pedidos" ADD CONSTRAINT "pedidos_direccion_id_fkey" FOREIGN KEY ("direccion_id") REFERENCES "direcciones"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_pedido" ADD CONSTRAINT "items_pedido_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_pedido" ADD CONSTRAINT "items_pedido_producto_id_fkey" FOREIGN KEY ("producto_id") REFERENCES "productos"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "pagos" ADD CONSTRAINT "pagos_pedido_id_fkey" FOREIGN KEY ("pedido_id") REFERENCES "pedidos"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "items_orden" ADD CONSTRAINT "items_orden_orden_id_fkey" FOREIGN KEY ("orden_id") REFERENCES "ordenes"("id") ON DELETE CASCADE ON UPDATE CASCADE;
