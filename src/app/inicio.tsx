
import {
    ScrollView,
    StyleSheet,
    Text,
    TouchableOpacity,
    View,
} from "react-native";

import { router, useLocalSearchParams } from "expo-router";

import { SafeAreaView } from "react-native-safe-area-context";

export default function InicioScreen() {
  const { nombre } = useLocalSearchParams<{
    nombre?: string;
  }>();

  // Obtener el primer nombre del usuario
  const primerNombre =
    typeof nombre === "string" && nombre.trim()
      ? nombre.trim().split(" ")[0]
      : "Sneakerhead";

  return (
    <SafeAreaView style={styles.contenedor}>
      <ScrollView contentContainerStyle={styles.contenido}>
        {/* ENCABEZADO */}
        <View style={styles.encabezado}>
          <Text style={styles.marca}>
            SNEAK<Text style={styles.verde}>HUB</Text>
          </Text>

          <Text style={styles.etiqueta}>EST. 2026</Text>
        </View>

        {/* BIENVENIDA */}
        <Text style={styles.saludo}>¡Qué onda, {primerNombre}! 👟</Text>

        <Text style={styles.subtitulo}>Bienvenido a tu espacio sneaker.</Text>

        {/* BANNER PRINCIPAL */}
        <View style={styles.banner}>
          <Text style={styles.bannerEtiqueta}>NEW GENERATION OF SNEAKERS</Text>

          <Text style={styles.bannerTitulo}>
            TU ESTILO.{"\n"}
            TUS REGLAS.
          </Text>

          <Text style={styles.bannerDescripcion}>
            Explora nuestra colección y descubre tu próximo par favorito.
          </Text>

          <TouchableOpacity
            style={styles.botonExplorar}
            onPress={() => router.push("/catalogo")}
          >
            <Text style={styles.botonExplorarTexto}>EXPLORAR SNEAKERS →</Text>
          </TouchableOpacity>

          <Text style={styles.bannerPie}>SNEAKHUB / STREET CULTURE</Text>
        </View>

        {/* CATEGORÍAS */}
        <Text style={styles.seccion}>EXPLORA TU ESTILO</Text>

        <View style={styles.categorias}>
          <TouchableOpacity
            style={styles.categoria}
            onPress={() => router.push("/catalogo")}
          >
            <Text style={styles.categoriaIcono}>👟</Text>

            <Text style={styles.categoriaTexto}>SNEAKERS</Text>

            <Text style={styles.categoriaSub}>Ver colección</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.categoria}
            onPress={() => router.push("/catalogo")}
          >
            <Text style={styles.categoriaIcono}>🔥</Text>

            <Text style={styles.categoriaTexto}>TENDENCIAS</Text>

            <Text style={styles.categoriaSub}>Descubre más</Text>
          </TouchableOpacity>
        </View>

        {/* NUEVA SECCIÓN: ADMINISTRACIÓN */}
        <Text style={styles.seccionAdministracion}>GESTIONA TU COLECCIÓN</Text>

        <Text style={styles.descripcionAdministracion}>
          Registra nuevos modelos de sneakers para ampliar nuestro catálogo.
        </Text>

        <TouchableOpacity
          style={styles.botonAgregar}
          onPress={() => router.push("/agregar")}
        >
          <Text style={styles.botonAgregarTexto}>+ AGREGAR NUEVO SNEAKER</Text>
        </TouchableOpacity>

        {/* REGRESAR AL REGISTRO */}
        <TouchableOpacity
          onPress={() => router.replace("/")}
          style={styles.salir}
        >
          <Text style={styles.salirTexto}>Volver al registro</Text>
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#0C0C0C",
  },

  contenido: {
    padding: 23,
    paddingBottom: 45,
  },

  encabezado: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 12,
    marginBottom: 42,
  },

  marca: {
    color: "#FFFFFF",
    fontSize: 26,
    fontWeight: "900",
  },

  verde: {
    color: "#B6FF39",
  },

  etiqueta: {
    color: "#777777",
    fontSize: 11,
    letterSpacing: 2,
  },

  saludo: {
    color: "#FFFFFF",
    fontSize: 28,
    fontWeight: "900",
  },

  subtitulo: {
    color: "#AAAAAA",
    marginTop: 8,
    marginBottom: 30,
    fontSize: 15,
  },

  banner: {
    backgroundColor: "#B6FF39",
    borderRadius: 24,
    padding: 24,
    minHeight: 330,
    justifyContent: "space-between",
  },

  bannerEtiqueta: {
    fontSize: 10,
    color: "#111111",
    fontWeight: "800",
    letterSpacing: 1.5,
  },

  bannerTitulo: {
    color: "#111111",
    fontSize: 40,
    fontWeight: "900",
    lineHeight: 45,
    marginTop: 20,
  },

  bannerDescripcion: {
    color: "#333333",
    fontSize: 14,
    lineHeight: 22,
    marginTop: 15,
  },

  botonExplorar: {
    backgroundColor: "#101010",
    paddingVertical: 17,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 25,
  },

  botonExplorarTexto: {
    color: "#FFFFFF",
    fontWeight: "900",
    fontSize: 13,
  },

  bannerPie: {
    color: "#444444",
    fontSize: 9,
    textAlign: "center",
    letterSpacing: 2,
    marginTop: 19,
  },

  seccion: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 38,
    marginBottom: 18,
  },

  categorias: {
    flexDirection: "row",
    gap: 12,
  },

  categoria: {
    flex: 1,
    backgroundColor: "#1B1B1B",
    padding: 18,
    borderRadius: 17,
    borderWidth: 1,
    borderColor: "#333333",
  },

  categoriaIcono: {
    fontSize: 29,
    marginBottom: 20,
  },

  categoriaTexto: {
    color: "#FFFFFF",
    fontSize: 13,
    fontWeight: "900",
  },

  categoriaSub: {
    color: "#888888",
    fontSize: 11,
    marginTop: 7,
  },

  seccionAdministracion: {
    color: "#FFFFFF",
    fontSize: 18,
    fontWeight: "900",
    marginTop: 38,
    marginBottom: 10,
  },

  descripcionAdministracion: {
    color: "#AAAAAA",
    fontSize: 13,
    lineHeight: 21,
    marginBottom: 18,
  },

  botonAgregar: {
    backgroundColor: "#B6FF39",
    paddingVertical: 18,
    borderRadius: 14,
    alignItems: "center",
  },

  botonAgregarTexto: {
    color: "#111111",
    fontSize: 14,
    fontWeight: "900",
  },

  salir: {
    alignItems: "center",
    marginTop: 40,
  },

  salirTexto: {
    color: "#AAAAAA",
    fontSize: 13,
  },
});
