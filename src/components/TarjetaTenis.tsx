import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

export type Tenis = {
  id: number;
  title: string;
  brand?: string;
  price: number;
  thumbnail: string;
  description: string;
  stock: number;
  category: string;
};

type Props = {
  producto: Tenis;
};

export default function TarjetaTenis({ producto }: Props) {
  const [imagenError, setImagenError] = useState(false);

  return (
    <View style={styles.tarjeta}>
      <View style={styles.contenedorImagen}>
        {producto.thumbnail && !imagenError ? (
          <Image
            source={{ uri: producto.thumbnail }}
            style={styles.imagen}
            resizeMode="contain"
            onError={() => setImagenError(true)}
          />
        ) : (
          <View style={styles.sinImagenContenedor}>
            <Text style={styles.sinImagen}>IMAGEN NO DISPONIBLE</Text>
          </View>
        )}

        <View style={styles.etiqueta}>
          <Text style={styles.etiquetaTexto}>SNEAKHUB</Text>
        </View>
      </View>

      <View style={styles.informacion}>
        <Text style={styles.marca} numberOfLines={1}>
          {producto.brand || "SNEAKERS"}
        </Text>

        <Text style={styles.nombre} numberOfLines={3}>
          {producto.title}
        </Text>

        <Text style={styles.precio}>${producto.price.toFixed(2)} USD</Text>

        <Text style={styles.referencia}>Precio de demostración</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  tarjeta: {
    flex: 1,
    margin: 5,
    backgroundColor: "#1C1C1C",
    borderRadius: 18,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#303030",
  },

  contenedorImagen: {
    height: 160,
    backgroundColor: "#F4F4F4",
    alignItems: "center",
    justifyContent: "center",
  },

  imagen: {
    width: "96%",
    height: "96%",
  },

  sinImagenContenedor: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  sinImagen: {
    color: "#777777",
    fontSize: 11,
    textAlign: "center",
    padding: 12,
  },

  etiqueta: {
    position: "absolute",
    top: 10,
    left: 10,
    paddingHorizontal: 9,
    paddingVertical: 5,
    backgroundColor: "#B6FF39",
    borderRadius: 6,
  },

  etiquetaTexto: {
    color: "#111111",
    fontSize: 8,
    fontWeight: "900",
  },

  informacion: {
    padding: 13,
    minHeight: 160,
  },

  marca: {
    color: "#B6FF39",
    fontSize: 10,
    fontWeight: "900",
    textTransform: "uppercase",
    marginBottom: 8,
  },

  nombre: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "800",
    minHeight: 54,
  },

  precio: {
    color: "#FFFFFF",
    fontSize: 17,
    fontWeight: "900",
    marginTop: 10,
  },

  referencia: {
    color: "#888888",
    fontSize: 10,
    marginTop: 6,
  },
});
