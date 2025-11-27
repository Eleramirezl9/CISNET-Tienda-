/**
 * useCarrito - Hook de gestión del carrito
 * Usa Zustand para el estado global
 */

'use client';

import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import { EstadoCarrito, AccionesCarrito, ItemCarrito } from '../dominio/carrito.types';

// Tasa de IVA en Guatemala (12%)
const TASA_IVA = 0.12;

// Costo de envío base
const COSTO_ENVIO_BASE = 30;

// Envío gratis a partir de
const ENVIO_GRATIS_MINIMO = 500;

type CarritoStore = EstadoCarrito & AccionesCarrito;

export const useCarrito = create<CarritoStore>()(
  persist(
    (set, get) => ({
      // Estado inicial
      items: [],
      subtotal: 0,
      impuestos: 0,
      envio: 0,
      total: 0,
      cantidadTotal: 0,

      // Agregar item al carrito
      agregarItem: (productoId, nombre, slug, precio, imagen, stock) => {
        const { items } = get();
        const itemExistente = items.find((item) => item.productoId === productoId);

        if (itemExistente) {
          // Si ya existe, incrementar cantidad (respetando stock)
          const nuevaCantidad = Math.min(itemExistente.cantidad + 1, stock);
          
          set({
            items: items.map((item) =>
              item.productoId === productoId
                ? { ...item, cantidad: nuevaCantidad }
                : item
            ),
          });
        } else {
          // Si no existe, agregarlo
          const nuevoItem: ItemCarrito = {
            productoId,
            nombre,
            slug,
            precio,
            cantidad: 1,
            imagenPrincipal: imagen,
            stock,
          };
          
          set({ items: [...items, nuevoItem] });
        }

        get().calcularTotales();
      },

      // Remover item del carrito
      removerItem: (productoId) => {
        const { items } = get();
        
        set({
          items: items.filter((item) => item.productoId !== productoId),
        });

        get().calcularTotales();
      },

      // Actualizar cantidad de un item
      actualizarCantidad: (productoId, cantidad) => {
        const { items } = get();
        
        if (cantidad <= 0) {
          get().removerItem(productoId);
          return;
        }

        set({
          items: items.map((item) =>
            item.productoId === productoId
              ? { ...item, cantidad: Math.min(cantidad, item.stock) }
              : item
          ),
        });

        get().calcularTotales();
      },

      // Limpiar carrito
      limpiarCarrito: () => {
        set({
          items: [],
          subtotal: 0,
          impuestos: 0,
          envio: 0,
          total: 0,
          cantidadTotal: 0,
        });
      },

      // Calcular totales
      calcularTotales: () => {
        const { items } = get();

        // Calcular subtotal
        const subtotal = items.reduce(
          (acc, item) => acc + item.precio * item.cantidad,
          0
        );

        // Calcular impuestos (IVA 12%)
        const impuestos = subtotal * TASA_IVA;

        // Calcular envío (gratis si supera el mínimo)
        const envio = subtotal >= ENVIO_GRATIS_MINIMO ? 0 : COSTO_ENVIO_BASE;

        // Calcular total
        const total = subtotal + impuestos + envio;

        // Calcular cantidad total de items
        const cantidadTotal = items.reduce((acc, item) => acc + item.cantidad, 0);

        set({
          subtotal,
          impuestos,
          envio,
          total,
          cantidadTotal,
        });
      },
    }),
    {
      name: 'carrito-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);
