import { useState } from "react";

import {
    Alert,
    Image,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { router } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";

import { ActivityIndicator, Button, TextInput } from "react-native-paper";

import { useCatalogo } from "../context/CatalogoContext";

// Tipos de categoría
type Categoria = "mens-shoes" | "womens-shoes";

// Colores principales
const VERDE = "#B6FF39";
const FONDO = "#0C0C0C";

export default function AgregarScreen() {
  // Conexión con el catálogo compartido
  const { agregarProducto } = useCatalogo();

  // Estados del formulario
  const [modelo, setModelo] = useState("");
  const [marca, setMarca] = useState("");
  const [precio, setPrecio] = useState("");
  const [descripcion, setDescripcion] = useState("");
  const [imagen, setImagen] = useState("");

  const [categoria, setCategoria] = useState<Categoria>("mens-shoes");

  const [cargando, setCargando] = useState(false);
  const [imagenError, setImagenError] = useState(false);
  const [error, setError] = useState("");

  // Validación de imagen
  const imagenValida = /^https:\/\/\S+\.\S+/i.test(imagen.trim());

  // Función principal para agregar un sneaker
  const registrarSneaker = async () => {
    if (cargando) return;

    setError("");

    // Validar modelo
    if (modelo.trim().length < 3) {
      Alert.alert(
        "Modelo inválido",
        "Escribe un modelo de al menos 3 caracteres.",
      );
      return;
    }

    // Validar marca
    if (marca.trim().length < 2) {
      Alert.alert("Marca inválida", "Ingresa una marca válida.");
      return;
    }

    // Convertir precio a número
    const precioNumero = Number(precio.trim().replace(",", "."));

    // Validar precio
    if (!Number.isFinite(precioNumero) || precioNumero <= 0) {
      Alert.alert("Precio inválido", "Ingresa un precio mayor que cero.");
      return;
    }

    // Validar URL
    if (!imagenValida) {
      Alert.alert(
        "Imagen inválida",
        "Ingresa una URL válida que comience con https://",
      );
      return;
    }

    setCargando(true);

    // Datos que enviaremos a la API
    const nuevoProducto = {
      title: modelo.trim(),
      brand: marca.trim(),
      price: precioNumero,
      description: descripcion.trim() || "Sneaker agregado desde SneakHub.",
      thumbnail: imagen.trim(),
      category: categoria,
      stock: 1,
    };

    const controlador = new AbortController();

    // Límite de 12 segundos
    const temporizador = setTimeout(() => {
      controlador.abort();
    }, 12000);

    try {
      // ==================================
      // 1. ENVIAR POST A DUMMYJSON
      // ==================================

      const respuesta = await fetch("https://dummyjson.com/products/add", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(nuevoProducto),
        signal: controlador.signal,
      });

      if (!respuesta.ok) {
        throw new Error(`Error del servidor: ${respuesta.status}`);
      }

      // Obtener la respuesta de la API
      const resultado = await respuesta.json();

      // Comprobar que DummyJSON respondió
      // con un identificador de producto
      if (typeof resultado.id !== "number" || resultado.id <= 0) {
        throw new Error("La API no confirmó el registro.");
      }

      // ==================================
      // 2. ACTUALIZAR EL ESTADO COMPARTIDO
      // ==================================

      agregarProducto(nuevoProducto);

      // ==================================
      // 3. ABRIR AUTOMÁTICAMENTE CATÁLOGO
      // ==================================

      router.replace("/catalogo");
    } catch (e) {
      const mensaje =
        e instanceof Error && e.name === "AbortError"
          ? "La solicitud tardó demasiado. Inténtalo de nuevo."
          : e instanceof Error
            ? e.message
            : "Ocurrió un error desconocido.";

      setError(mensaje);

      Alert.alert("No se pudo agregar el sneaker", mensaje);
    } finally {
      clearTimeout(temporizador);
      setCargando(false);
    }
  };

  return (
    <SafeAreaView style={styles.contenedor}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : undefined}
      >
        <ScrollView
          contentContainerStyle={styles.contenido}
          keyboardShouldPersistTaps="handled"
        >
          {/* BOTÓN VOLVER */}
          <TouchableOpacity onPress={() => router.back()}>
            <Text style={styles.volver}>‹ VOLVER</Text>
          </TouchableOpacity>

          {/* LOGOTIPO */}
          <Text style={styles.marcaPrincipal}>
            SNEAK
            <Text style={styles.verde}>HUB</Text>
          </Text>

          <Text style={styles.subtitulo}>MANAGE YOUR COLLECTION</Text>

          {/* TÍTULO */}
          <Text style={styles.titulo}>Agregar sneaker</Text>

          <Text style={styles.descripcion}>
            Registra un nuevo modelo para nuestra colección.
          </Text>

          {/* MODELO */}
          <Text style={styles.etiqueta}>MODELO</Text>

          <TextInput
            mode="outlined"
            label="Ej. Nike Dunk Low Panda"
            value={modelo}
            onChangeText={setModelo}
            disabled={cargando}
            style={styles.campo}
            outlineColor="#383838"
            activeOutlineColor={VERDE}
            textColor="#FFFFFF"
            theme={{
              colors: {
                onSurfaceVariant: "#AAAAAA",
              },
            }}
          />

          {/* MARCA */}
          <Text style={styles.etiqueta}>MARCA</Text>

          <TextInput
            mode="outlined"
            label="Ej. Nike, Adidas, Jordan"
            value={marca}
            onChangeText={setMarca}
            disabled={cargando}
            style={styles.campo}
            outlineColor="#383838"
            activeOutlineColor={VERDE}
            textColor="#FFFFFF"
            theme={{
              colors: {
                onSurfaceVariant: "#AAAAAA",
              },
            }}
          />

          {/* PRECIO */}
          <Text style={styles.etiqueta}>PRECIO EN USD</Text>

          <TextInput
            mode="outlined"
            label="Ej. 150.00"
            value={precio}
            onChangeText={setPrecio}
            keyboardType="decimal-pad"
            disabled={cargando}
            style={styles.campo}
            outlineColor="#383838"
            activeOutlineColor={VERDE}
            textColor="#FFFFFF"
            theme={{
              colors: {
                onSurfaceVariant: "#AAAAAA",
              },
            }}
          />

          {/* CATEGORÍA */}
          <Text style={styles.etiqueta}>CATEGORÍA</Text>

          <View style={styles.categorias}>
            <TouchableOpacity
              disabled={cargando}
              onPress={() => setCategoria("mens-shoes")}
              style={[
                styles.categoria,
                categoria === "mens-shoes" && styles.categoriaActiva,
              ]}
            >
              <Text
                style={[
                  styles.categoriaTexto,
                  categoria === "mens-shoes" && styles.categoriaTextoActivo,
                ]}
              >
                HOMBRE
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              disabled={cargando}
              onPress={() => setCategoria("womens-shoes")}
              style={[
                styles.categoria,
                categoria === "womens-shoes" && styles.categoriaActiva,
              ]}
            >
              <Text
                style={[
                  styles.categoriaTexto,
                  categoria === "womens-shoes" && styles.categoriaTextoActivo,
                ]}
              >
                MUJER / UNISEX
              </Text>
            </TouchableOpacity>
          </View>

          {/* DESCRIPCIÓN */}
          <Text style={styles.etiqueta}>DESCRIPCIÓN</Text>

          <TextInput
            mode="outlined"
            label="Descripción del sneaker"
            value={descripcion}
            onChangeText={setDescripcion}
            multiline
            numberOfLines={3}
            disabled={cargando}
            style={styles.campo}
            outlineColor="#383838"
            activeOutlineColor={VERDE}
            textColor="#FFFFFF"
            theme={{
              colors: {
                onSurfaceVariant: "#AAAAAA",
              },
            }}
          />

          {/* URL DE IMAGEN */}
          <Text style={styles.etiqueta}>IMAGEN DEL SNEAKER</Text>

          <TextInput
            mode="outlined"
            label="https://ejemplo.com/imagen.png"
            value={imagen}
            onChangeText={(valor) => {
              setImagen(valor);
              setImagenError(false);
            }}
            autoCapitalize="none"
            autoCorrect={false}
            keyboardType="url"
            disabled={cargando}
            style={styles.campo}
            outlineColor="#383838"
            activeOutlineColor={VERDE}
            textColor="#FFFFFF"
            theme={{
              colors: {
                onSurfaceVariant: "#AAAAAA",
              },
            }}
          />

          {/* VISTA PREVIA */}
          {imagenValida && (
            <View style={styles.preview}>
              {imagenError ? (
                <Text style={styles.previewError}>
                  No se pudo cargar la fotografía.
                </Text>
              ) : (
                <Image
                  source={{
                    uri: imagen.trim(),
                  }}
                  style={styles.imagenPreview}
                  resizeMode="contain"
                  onError={() => setImagenError(true)}
                />
              )}
            </View>
          )}

          {/* MENSAJE DE ERROR */}
          {error !== "" && <Text style={styles.errorTexto}>{error}</Text>}

          {/* BOTÓN AGREGAR */}
          <Button
            mode="contained"
            buttonColor={VERDE}
            textColor="#111111"
            disabled={cargando}
            onPress={registrarSneaker}
            style={styles.boton}
            contentStyle={{
              height: 55,
            }}
          >
            {cargando ? (
              <ActivityIndicator size="small" color="#111111" />
            ) : (
              "AGREGAR SNEAKER"
            )}
          </Button>

          {/* NOTA */}
          <Text style={styles.nota}>
            El producto se envía a DummyJSON y se agrega al catálogo local
            durante esta sesión.
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: FONDO,
  },

  contenido: {
    paddingHorizontal: 23,
    paddingTop: 16,
    paddingBottom: 45,
  },

  volver: {
    color: VERDE,
    fontWeight: "800",
    marginBottom: 25,
  },

  marcaPrincipal: {
    fontSize: 27,
    fontWeight: "900",
    color: "#FFFFFF",
  },

  verde: {
    color: VERDE,
  },

  subtitulo: {
    color: "#888888",
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 5,
    marginBottom: 35,
  },

  titulo: {
    color: "#FFFFFF",
    fontSize: 29,
    fontWeight: "900",
  },

  descripcion: {
    color: "#AAAAAA",
    fontSize: 14,
    marginTop: 10,
    marginBottom: 30,
  },

  etiqueta: {
    color: VERDE,
    fontSize: 11,
    fontWeight: "800",
    letterSpacing: 1,
    marginTop: 12,
    marginBottom: 8,
  },

  campo: {
    backgroundColor: "#191919",
    marginBottom: 9,
  },

  categorias: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },

  categoria: {
    flex: 1,
    backgroundColor: "#242424",
    borderRadius: 12,
    paddingVertical: 15,
    alignItems: "center",
  },

  categoriaActiva: {
    backgroundColor: VERDE,
  },

  categoriaTexto: {
    color: "#FFFFFF",
    fontWeight: "800",
    fontSize: 11,
  },

  categoriaTextoActivo: {
    color: "#111111",
  },

  preview: {
    height: 175,
    backgroundColor: "#F4F4F4",
    borderRadius: 16,
    marginTop: 14,
    alignItems: "center",
    justifyContent: "center",
  },

  imagenPreview: {
    width: "95%",
    height: "95%",
  },

  previewError: {
    color: "#555555",
    textAlign: "center",
  },

  errorTexto: {
    color: "#FF8888",
    textAlign: "center",
    marginTop: 18,
  },

  boton: {
    marginTop: 30,
    borderRadius: 12,
  },

  nota: {
    color: "#777777",
    fontSize: 11,
    textAlign: "center",
    marginTop: 25,
    lineHeight: 18,
  },
});
