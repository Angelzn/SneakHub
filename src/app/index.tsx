import { router } from "expo-router";
import { useState } from "react";
import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import {
  ActivityIndicator,
  Button,
  HelperText,
  Switch,
  TextInput,
} from "react-native-paper";
import { SafeAreaView } from "react-native-safe-area-context";

export default function RegistroScreen() {
  const [nombre, setNombre] = useState("");
  const [correo, setCorreo] = useState("");
  const [password, setPassword] = useState("");
  const [mostrarPassword, setMostrarPassword] = useState(false);
  const [aceptaTerminos, setAceptaTerminos] = useState(false);
  const [cargando, setCargando] = useState(false);
  const [enviado, setEnviado] = useState(false);

  // Validaciones del formulario
  const nombreValido = nombre.trim().length >= 3;

  const correoValido = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(correo.trim());

  const passwordValido = password.length >= 6;

  // Función para registrar al usuario
  const registrar = async () => {
    if (cargando) return;

    setEnviado(true);

    if (!nombreValido || !correoValido || !passwordValido || !aceptaTerminos) {
      return;
    }

    setCargando(true);

    try {
      // Simulación de registro
      await new Promise<void>((resolve) => setTimeout(resolve, 1200));

      // Navegación hacia Inicio
      router.replace({
        pathname: "/inicio",
        params: {
          nombre: nombre.trim(),
        },
      });
    } finally {
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
          {/* LOGOTIPO */}
          <View style={styles.logo}>
            <Text style={styles.logoTexto}>S</Text>
          </View>

          <Text style={styles.marca}>
            SNEAK<Text style={styles.verde}>HUB</Text>
          </Text>

          <Text style={styles.subtitulo}>THE SNEAKER CULTURE</Text>

          {/* TÍTULO */}
          <Text style={styles.titulo}>Crea tu cuenta</Text>

          <Text style={styles.descripcion}>
            Únete a nuestra comunidad y descubre los sneakers que definen tu
            estilo.
          </Text>

          {/* CAMPO NOMBRE */}
          <TextInput
            label="Nombre completo"
            value={nombre}
            onChangeText={setNombre}
            mode="outlined"
            autoCapitalize="words"
            disabled={cargando}
            style={styles.campo}
            outlineColor="#383838"
            activeOutlineColor="#B6FF39"
            textColor="#FFFFFF"
            theme={{
              colors: {
                onSurfaceVariant: "#AAAAAA",
              },
            }}
          />

          {enviado && !nombreValido && (
            <HelperText type="error" visible>
              Ingresa un nombre de al menos 3 caracteres.
            </HelperText>
          )}

          {/* CAMPO CORREO */}
          <TextInput
            label="Correo electrónico"
            value={correo}
            onChangeText={setCorreo}
            mode="outlined"
            keyboardType="email-address"
            autoCapitalize="none"
            autoCorrect={false}
            disabled={cargando}
            style={styles.campo}
            outlineColor="#383838"
            activeOutlineColor="#B6FF39"
            textColor="#FFFFFF"
            theme={{
              colors: {
                onSurfaceVariant: "#AAAAAA",
              },
            }}
          />

          {enviado && !correoValido && (
            <HelperText type="error" visible>
              Ingresa un correo electrónico válido.
            </HelperText>
          )}

          {/* CONTRASEÑA */}
          <View style={styles.passwordContenedor}>
            <TextInput
              label="Contraseña"
              value={password}
              onChangeText={setPassword}
              mode="outlined"
              secureTextEntry={!mostrarPassword}
              autoCapitalize="none"
              autoCorrect={false}
              disabled={cargando}
              style={styles.campoPassword}
              outlineColor="#383838"
              activeOutlineColor="#B6FF39"
              textColor="#FFFFFF"
              theme={{
                colors: {
                  onSurfaceVariant: "#AAAAAA",
                },
              }}
            />

            <Button
              mode="text"
              compact
              disabled={cargando}
              onPress={() => setMostrarPassword(!mostrarPassword)}
              textColor="#B6FF39"
              style={styles.botonMostrar}
            >
              {mostrarPassword ? "Ocultar" : "Mostrar"}
            </Button>
          </View>

          {enviado && !passwordValido && (
            <HelperText type="error" visible>
              La contraseña debe tener al menos 6 caracteres.
            </HelperText>
          )}

          {/* SWITCH */}
          <View style={styles.terminos}>
            <Switch
              value={aceptaTerminos}
              onValueChange={setAceptaTerminos}
              color="#B6FF39"
              disabled={cargando}
            />

            <Text style={styles.textoTerminos}>
              Acepto los términos y condiciones de SneakHub.
            </Text>
          </View>

          {enviado && !aceptaTerminos && (
            <HelperText type="error" visible>
              Debes aceptar los términos y condiciones.
            </HelperText>
          )}

          {/* BOTÓN REGISTRO */}
          <Button
            mode="contained"
            onPress={registrar}
            disabled={cargando}
            buttonColor="#B6FF39"
            textColor="#111111"
            style={styles.boton}
            contentStyle={styles.botonContenido}
          >
            {cargando ? (
              <ActivityIndicator color="#111111" size="small" />
            ) : (
              "CREAR CUENTA"
            )}
          </Button>

          <Text style={styles.pie}>STREETWEAR • SNEAKERS • CULTURE</Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  contenedor: {
    flex: 1,
    backgroundColor: "#0C0C0C",
  },

  contenido: {
    flexGrow: 1,
    paddingHorizontal: 25,
    paddingTop: 35,
    paddingBottom: 35,
  },

  logo: {
    width: 64,
    height: 64,
    borderRadius: 18,
    backgroundColor: "#B6FF39",
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 17,
  },

  logoTexto: {
    color: "#111111",
    fontSize: 39,
    fontWeight: "900",
    fontStyle: "italic",
  },

  marca: {
    fontSize: 32,
    fontWeight: "900",
    color: "#FFFFFF",
    letterSpacing: 1,
  },

  verde: {
    color: "#B6FF39",
  },

  subtitulo: {
    color: "#888888",
    fontSize: 11,
    letterSpacing: 3,
    marginTop: 5,
    marginBottom: 42,
  },

  titulo: {
    fontSize: 30,
    fontWeight: "800",
    color: "#FFFFFF",
    marginBottom: 10,
  },

  descripcion: {
    fontSize: 14,
    color: "#A0A0A0",
    lineHeight: 23,
    marginBottom: 25,
  },

  campo: {
    backgroundColor: "#191919",
    marginBottom: 11,
  },

  passwordContenedor: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 11,
    gap: 8,
  },

  campoPassword: {
    flex: 1,
    backgroundColor: "#191919",
  },

  botonMostrar: {
    justifyContent: "center",
  },

  terminos: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 14,
    marginBottom: 15,
    gap: 12,
  },

  textoTerminos: {
    color: "#CCCCCC",
    fontSize: 12,
    flex: 1,
    lineHeight: 19,
  },

  boton: {
    marginTop: 22,
    borderRadius: 12,
  },

  botonContenido: {
    height: 54,
  },

  pie: {
    color: "#555555",
    textAlign: "center",
    fontSize: 10,
    letterSpacing: 2,
    marginTop: 38,
  },
});
