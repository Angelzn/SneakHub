import React, {
    createContext,
    useCallback,
    useContext,
    useMemo,
    useRef,
    useState,
} from "react";

import type { Tenis } from "../components/TarjetaTenis";
import { sneakersLocales } from "../data/sneakers";

export type ProductoCatalogo = Tenis & {
  apiId?: number;
  agregado?: boolean;
};

type NuevoProducto = Omit<Tenis, "id">;

type CatalogoContextType = {
  productos: ProductoCatalogo[];
  agregarProducto: (producto: NuevoProducto) => void;
  eliminarProducto: (id: number) => void;
  actualizarProductosAPI: (productos: ProductoCatalogo[]) => void;
};

const CatalogoContext = createContext<CatalogoContextType | undefined>(
  undefined,
);

export function CatalogoProvider({ children }: { children: React.ReactNode }) {
  const [agregados, setAgregados] = useState<ProductoCatalogo[]>([]);

  const [productosAPI, setProductosAPI] = useState<ProductoCatalogo[]>([]);

  const [eliminados, setEliminados] = useState<number[]>([]);

  const siguienteId = useRef(300000);

  // AGREGAR PRODUCTO
  const agregarProducto = useCallback((producto: NuevoProducto) => {
    siguienteId.current += 1;

    const nuevo: ProductoCatalogo = {
      ...producto,
      id: siguienteId.current,
      agregado: true,
    };

    setAgregados((anteriores) => [nuevo, ...anteriores]);
  }, []);

  // ELIMINAR PRODUCTO
  const eliminarProducto = useCallback((id: number) => {
    setEliminados((anteriores) => {
      if (anteriores.includes(id)) {
        return anteriores;
      }

      return [...anteriores, id];
    });
  }, []);

  // GUARDAR PRODUCTOS OBTENIDOS DE LA API
  const actualizarProductosAPI = useCallback(
    (nuevosProductos: ProductoCatalogo[]) => {
      setProductosAPI(nuevosProductos);
    },
    [],
  );

  // COMBINAR PRODUCTOS Y EVITAR LOS ELIMINADOS
  const productos = useMemo(() => {
    const todos: ProductoCatalogo[] = [
      ...agregados,
      ...sneakersLocales,
      ...productosAPI,
    ];

    const idsEliminados = new Set(eliminados);

    const idsVistos = new Set<number>();

    return todos.filter((producto) => {
      if (idsEliminados.has(producto.id) || idsVistos.has(producto.id)) {
        return false;
      }

      idsVistos.add(producto.id);
      return true;
    });
  }, [agregados, productosAPI, eliminados]);

  const valor = useMemo(
    () => ({
      productos,
      agregarProducto,
      eliminarProducto,
      actualizarProductosAPI,
    }),
    [productos, agregarProducto, eliminarProducto, actualizarProductosAPI],
  );

  return (
    <CatalogoContext.Provider value={valor}>
      {children}
    </CatalogoContext.Provider>
  );
}

export function useCatalogo() {
  const contexto = useContext(CatalogoContext);

  if (!contexto) {
    throw new Error("CatalogoProvider no está configurado.");
  }

  return contexto;
}
