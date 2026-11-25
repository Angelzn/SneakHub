import { useCallback, useEffect, useRef, useState } from "react";

import {
    ActivityIndicator,
    Alert,
    FlatList,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import NetInfo from "@react-native-community/netinfo";
import { Link, router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import TarjetaTenis, { Tenis } from "../components/TarjetaTenis";

import { ProductoCatalogo, useCatalogo } from "../context/CatalogoContext";

type Categoria = "todos" | "mens-shoes" | "womens-shoes";

type RespuestaAPI = {
  products: Tenis[];
};

const VERDE = "#B6FF39";

// Identificar sneakers provenientes de DummyJSON
function esSneaker(producto: Tenis): boolean {
  const nombre = producto.title.toLowerCase();

  const permitidas = [
    "sneaker",
    "trainer",
    "jordan",
    "running",
    "puma",
    "dunk",
    "new balance",
    "nike",
    "adidas",
  ];

  const excluidas = [
    "heel",
    "sandal",
    "boot",
    "slipper",
    "baseball",
    "cleat",
    "formal",
    "loafer",
  ];

  return (
    permitidas.some((p) => nombre.includes(p)) &&
    !excluidas.some((p) => nombre.includes(p))
  );
}

export default function CatalogoScreen() {
  const { productos, eliminarProducto, actualizarProductosAPI } = useCatalogo();

  const [categoria, setCategoria] = useState<Categoria>("todos");

  const [modoAdministracion, setModoAdministracion] = useState(false);

  const [cargando, setCargando] = useState(false);

  const [eliminandoId, setEliminandoId] = useState<number | null>(null);

  const [error, setError] = useState("");
  const [sinConexion, setSinConexion] = useState(false);

  const controladorRef = useRef<AbortController | null>(null);

  const solicitudRef = useRef(0);

  // =====================================
  // GET: CONSULTAR PRODUCTOS DE DUMMYJSON
  // =====================================
  const cargarProductos = useCallback(async () => {
    const solicitud = ++solicitudRef.current;

    controladorRef.current?.abort();

    const controlador = new AbortController();
    controladorRef.current = controlador;

    const temporizador = setTimeout(() => {
      controlador.abort();
    }, 10000);

    setCargando(true);
    setError("");

    try {
      const red = await NetInfo.fetch();

      if (red.isConnected === false || red.isInternetReachable === false) {
        setSinConexion(true);
        throw new Error("Sin conexión a Internet.");
      }

      const respuesta = await fetch(
        "https://dummyjson.com/products/category/mens-shoes",
        {
          signal: controlador.signal,
        },
      );

      if (!respuesta.ok) {
        throw new Error(`Error de API: ${respuesta.status}`);
      }

      const datos: RespuestaAPI = await respuesta.json();

      const adicionales: ProductoCatalogo[] = datos.products
        .filter(esSneaker)
        .map((producto) => ({
          ...producto,
          id: producto.id + 10000,
          apiId: producto.id,
          category: "mens-shoes",
        }));

      if (!controlador.signal.aborted && solicitud === solicitudRef.current) {
        actualizarProductosAPI(adicionales);
        setSinConexion(false);
      }
    } catch (e) {
      if (solicitud !== solicitudRef.current) {
        return;
      }

      const mensaje =
        e instanceof Error && e.name === "AbortError"
          ? "La consulta tardó demasiado."
          : e instanceof Error
            ? e.message
            : "No se pudo consultar la API.";

      setError(mensaje);
    } finally {
      clearTimeout(temporizador);

      if (solicitud === solicitudRef.current) {
        setCargando(false);
      }
    }
  }, [actualizarProductosAPI]);

  // =====================================
  // NETINFO: ESTADO DE INTERNET
  // =====================================
  useEffect(() => {
    const suscripcion = NetInfo.addEventListener((estado) => {
      setSinConexion(
        estado.isConnected === false || estado.isInternetReachable === false,
      );
    });

    cargarProductos();

    return () => {
      solicitudRef.current += 1;
      controladorRef.current?.abort();
      suscripcion();
    };
  }, [cargarProductos]);

  // =====================================
  // DELETE: ELIMINAR PRODUCTO
  // =====================================
  const ejecutarEliminacion = async (producto: ProductoCatalogo) => {
    if (eliminandoId !== null) return;

    setEliminandoId(producto.id);

    try {
      if (producto.apiId !== undefined) {
        const controlador = new AbortController();

        const temporizador = setTimeout(() => controlador.abort(), 10000);

        let respuesta: Response;

        try {
          respuesta = await fetch(
            `https://dummyjson.com/products/${producto.apiId}`,
            {
              method: "DELETE",
              signal: controlador.signal,
            },
          );
        } finally {
          clearTimeout(temporizador);
        }

        if (!respuesta.ok) {
          throw new Error(`Error DELETE: ${respuesta.status}`);
        }

        const resultado = await respuesta.json();

        if (resultado.isDeleted !== true) {
          throw new Error("La API no confirmó la eliminación.");
        }
      }

      eliminarProducto(producto.id);

      Alert.alert(
        "Sneaker eliminado",
        producto.apiId !== undefined
          ? "DELETE exitoso. Producto eliminado del catálogo de esta sesión."
          : "Producto eliminado de la colección local.",
      );
    } catch (e) {
      Alert.alert(
        "Error al eliminar",
        e instanceof Error ? e.message : "No fue posible eliminar el producto.",
      );
    } finally {
      setEliminandoId(null);
    }
  };

  const confirmarEliminacion = (producto: ProductoCatalogo) => {
    Alert.alert("Eliminar sneaker", `¿Deseas eliminar "${producto.title}"?`, [
      {
        text: "CANCELAR",
        style: "cancel",
      },
      {
        text: "ELIMINAR",
        style: "destructive",
        onPress: () => ejecutarEliminacion(producto),
      },
    ]);
  };

  // =====================================
  // FILTROS
  // =====================================
  const filtrados = productos.filter(
    (producto) => categoria === "todos" || producto.category === categoria,
  );

  const opciones: {
    id: Categoria;
    texto: string;
  }[] = [
    { id: "todos", texto: "Todos" },
    { id: "mens-shoes", texto: "Hombre" },
    { id: "womens-shoes", texto: "Mujer" },
  ];

  return (
    <SafeAreaView style={styles.contenedor}>
      {/* ENCABEZADO */}
      <View style={styles.encabezado}>
        <TouchableOpacity onPress={() => router.back()}>
          <Text style={styles.volver}>‹ VOLVER</Text>
        </TouchableOpacity>

        <Text style={styles.logo}>
          SNEAK
          <Text style={styles.verde}>HUB</Text>
        </Text>

        <Text style={styles.subtitulo}>EXPLORE THE COLLECTION</Text>
      </View>

      {/* ESTADO DE CONEXIÓN */}
      {sinConexion && (
        <View style={styles.aviso}>
          <Text style={styles.avisoTexto}>Sin conexión a Internet</Text>
        </View>
      )}

      {/* TÍTULO */}
      <View style={styles.titulos}>
        <Text style={styles.titulo}>Nuestros sneakers</Text>

        <Text style={styles.descripcion}>
          Descubre nuevos modelos y estilos.
        </Text>

        {/* =====================================
            LINK DE EXPO ROUTER
            NAVEGAR AL FORMULARIO AGREGAR
           ===================================== */}
        <Link href="/agregar" asChild>
          <TouchableOpacity style={styles.botonLink} activeOpacity={0.8}>
            <Text style={styles.botonLinkTexto}>+ AGREGAR SNEAKER</Text>
            <Text style={styles.botonLinkFlecha}>›</Text>
          </TouchableOpacity>
        </Link>
      </View>

      {/* FILTROS */}
      <View style={styles.filtros}>
        {opciones.map((opcion) => (
          <TouchableOpacity
            key={opcion.id}
            onPress={() => setCategoria(opcion.id)}
            style={[
              styles.filtro,
              categoria === opcion.id && styles.filtroActivo,
            ]}
          >
            <Text
              style={[
                styles.filtroTexto,
                categoria === opcion.id && styles.filtroTextoActivo,
              ]}
            >
              {opcion.texto}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* CONTADOR Y MODO ADMINISTRACIÓN */}
      <View style={styles.barraGestion}>
        <Text style={styles.contador}>{filtrados.length} MODELOS</Text>

        <TouchableOpacity
          onPress={() => setModoAdministracion((anterior) => !anterior)}
          style={[
            styles.botonAdministrar,
            modoAdministracion && styles.botonAdministrarActivo,
          ]}
        >
          <Text
            style={[
              styles.textoAdministrar,
              modoAdministracion && styles.textoAdministrarActivo,
            ]}
          >
            {modoAdministracion ? "✓ FINALIZAR" : "⚙ ADMINISTRAR"}
          </Text>
        </TouchableOpacity>
      </View>

      {/* PANEL DE ADMINISTRACIÓN */}
      {modoAdministracion && (
        <View style={styles.avisoAdministracion}>
          <Text style={styles.avisoAdminTitulo}>MODO ADMINISTRACIÓN</Text>

          <Text style={styles.avisoAdminTexto}>
            Selecciona ELIMINAR para retirar un sneaker. Puedes cancelar antes
            de confirmar.
          </Text>
        </View>
      )}

      {/* INDICADOR DE CARGA */}
      {cargando && (
        <View style={styles.cargando}>
          <ActivityIndicator color={VERDE} size="small" />

          <Text style={styles.cargandoTexto}>Actualizando catálogo...</Text>
        </View>
      )}

      {/* ERROR Y BOTÓN REINTENTAR */}
      {error !== "" && !cargando && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorTexto}>{error}</Text>

          <Text style={styles.errorAyuda}>
            Puedes continuar usando los sneakers locales.
          </Text>

          <TouchableOpacity onPress={cargarProductos} style={styles.reintentar}>
            <Text style={styles.reintentarTexto}>REINTENTAR API</Text>
          </TouchableOpacity>
        </View>
      )}

      {/* FLATLIST */}
      <FlatList
        data={filtrados}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        extraData={modoAdministracion}
        columnWrapperStyle={styles.fila}
        contentContainerStyle={styles.lista}
        refreshing={cargando}
        onRefresh={cargarProductos}
        renderItem={({ item }) => (
          <View style={styles.producto}>
            <TarjetaTenis producto={item} />

            {/* INDICADOR DE NUEVO PRODUCTO */}
            {item.agregado && <Text style={styles.nuevo}>NUEVO SNEAKER</Text>}

            {/* BOTÓN ELIMINAR SOLO EN ADMINISTRACIÓN */}
            {modoAdministracion && (
              <TouchableOpacity
                disabled={eliminandoId !== null}
                onPress={() => confirmarEliminacion(item)}
                style={styles.botonEliminar}
              >
                <Text style={styles.eliminarTexto}>
                  {eliminandoId === item.id ? "ELIMINANDO..." : "ELIMINAR"}
                </Text>
              </TouchableOpacity>
            )}
          </View>
        )}
        ListEmptyComponent={
          <Text style={styles.vacio}>No hay sneakers disponibles.</Text>
        }
      />

      {/* PIE DE PÁGINA */}
      <Text style={styles.pie}>SNEAKHUB DEMO · COLECCIÓN + DUMMYJSON</Text>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#0C0C0C",
  },

  encabezado: {
    paddingHorizontal: 20,
    paddingTop: 15,
  },

  volver: {
    color: VERDE,
    fontSize: 13,
    fontWeight: "800",
    marginBottom: 22,
  },

  logo: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
  },

  verde: {
    color: VERDE,
  },

  subtitulo: {
    color: "#888888",
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 5,
  },

  titulos: {
    paddingHorizontal: 20,
    marginTop: 28,
  },

  titulo: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
  },

  descripcion: {
    color: "#999999",
    marginTop: 7,
  },

  // NUEVO BOTÓN DE NAVEGACIÓN LINK
  botonLink: {
    backgroundColor: "#1C2811",
    borderColor: VERDE,
    borderWidth: 1,
    borderRadius: 13,
    paddingHorizontal: 17,
    paddingVertical: 15,
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  botonLinkTexto: {
    color: VERDE,
    fontWeight: "900",
    fontSize: 13,
    letterSpacing: 1,
  },

  botonLinkFlecha: {
    color: VERDE,
    fontSize: 25,
    fontWeight: "bold",
  },

  filtros: {
    flexDirection: "row",
    gap: 9,
    paddingHorizontal: 20,
    marginVertical: 22,
  },

  filtro: {
    paddingHorizontal: 18,
    paddingVertical: 11,
    backgroundColor: "#242424",
    borderRadius: 22,
  },

  filtroActivo: {
    backgroundColor: VERDE,
  },

  filtroTexto: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 12,
  },

  filtroTextoActivo: {
    color: "#111111",
  },

  barraGestion: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    marginBottom: 18,
    gap: 10,
  },

  contador: {
    color: "#888888",
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
  },

  botonAdministrar: {
    backgroundColor: "#282828",
    borderWidth: 1,
    borderColor: "#444444",
    borderRadius: 12,
    paddingVertical: 11,
    paddingHorizontal: 13,
  },

  botonAdministrarActivo: {
    backgroundColor: VERDE,
    borderColor: VERDE,
  },

  textoAdministrar: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 11,
  },

  textoAdministrarActivo: {
    color: "#111111",
  },

  avisoAdministracion: {
    backgroundColor: "#1D2814",
    borderColor: "#4F7B23",
    borderWidth: 1,
    borderRadius: 13,
    marginHorizontal: 20,
    marginBottom: 16,
    padding: 15,
  },

  avisoAdminTitulo: {
    color: VERDE,
    fontWeight: "900",
    fontSize: 12,
    letterSpacing: 1,
  },

  avisoAdminTexto: {
    color: "#CCCCCC",
    fontSize: 12,
    lineHeight: 18,
    marginTop: 5,
  },

  cargando: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 10,
    marginBottom: 12,
  },

  cargandoTexto: {
    color: "#AAAAAA",
    fontSize: 12,
  },

  producto: {
    flex: 1,
    maxWidth: "50%",
    marginBottom: 14,
  },

  lista: {
    paddingHorizontal: 10,
    paddingBottom: 30,
  },

  fila: {
    justifyContent: "space-between",
  },

  nuevo: {
    color: VERDE,
    fontSize: 10,
    fontWeight: "900",
    textAlign: "center",
    marginVertical: 5,
  },

  botonEliminar: {
    backgroundColor: "#382020",
    borderRadius: 10,
    marginHorizontal: 5,
    marginTop: 5,
    paddingVertical: 13,
    alignItems: "center",
  },

  eliminarTexto: {
    color: "#FF8888",
    fontSize: 11,
    fontWeight: "900",
  },

  aviso: {
    backgroundColor: "#4C2719",
    padding: 12,
    marginTop: 15,
  },

  avisoTexto: {
    color: "#FFFFFF",
    textAlign: "center",
  },

  errorBanner: {
    backgroundColor: "#291919",
    marginHorizontal: 18,
    marginBottom: 14,
    borderRadius: 12,
    padding: 15,
  },

  errorTexto: {
    color: "#FF8888",
    textAlign: "center",
  },

  errorAyuda: {
    color: "#AAAAAA",
    textAlign: "center",
    fontSize: 11,
    marginTop: 7,
  },

  reintentar: {
    backgroundColor: VERDE,
    paddingVertical: 12,
    paddingHorizontal: 18,
    borderRadius: 9,
    alignSelf: "center",
    marginTop: 12,
  },

  reintentarTexto: {
    color: "#111111",
    fontWeight: "900",
    fontSize: 11,
  },

  vacio: {
    color: "#AAAAAA",
    textAlign: "center",
    marginTop: 30,
  },

  pie: {
    color: "#777777",
    textAlign: "center",
    paddingVertical: 9,
    fontSize: 10,
  },
});
