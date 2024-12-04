# KalFit

KalFit es una aplicación de seguimiento de alimentos y salud que permite a los usuarios registrar alimentos, ver su historial de comidas, establecer objetivos de salud, y más.

## Requisitos

- Node.js (versión 14 o superior)
- npm (versión 6 o superior) o yarn (versión 1.22 o superior)
- Expo CLI (versión 4 o superior)

## Instalación

1. Clona el repositorio:

   ```sh
   git clone 
   cd kalfit
    ```
2. Instala las dependencias:
 ```sh
   npm install
   # o
   yarn install
 ```
3. Configura Firebase:
Crea un proyecto en Firebase.
Configura la base de datos en tiempo real.
Copia la configuración de Firebase y reemplaza los valores en firebaseConfig.js:
 ```sh
import { initializeApp } from "firebase/app";
import { getDatabase } from 'firebase/database';
import { getAnalytics } from "firebase/analytics";
 ```
 4. Inicia el servidor de desarrollo:
  ```sh
   npm start
   # o
   yarn start
 ```
5. Escanea el código QR con la aplicación Expo Go en tu dispositivo móvil o selecciona una opción para ejecutar el proyecto en un emulador.

Estructura del Proyecto
.expo/: Archivos de configuración de Expo.
assets/: Recursos estáticos como imágenes y fuentes.
screens/: Pantallas de la aplicación.
EditProfileScreen.js
EducationScreen.js
FoodLogScreen.js
ForgotPasswordScreen.js
GoalsScreen.js
HistoryScreen.js
LoginScreen.js
ProfileScreen.js
RegisterScreen.js
RegisterWeightScreen.js
SettingsScreen.js
WelcomeScreen.js
App.js: Punto de entrada principal de la aplicación.
firebaseConfig.js: Configuración de Firebase.
index.js: Registro del componente raíz.
package.json: Dependencias y scripts del proyecto.
Uso
Pantalla de Bienvenida: Navega a las pantallas de inicio de sesión, registro y recuperación de contraseña.
Inicio de Sesión: Inicia sesión con tus credenciales.
Registro: Crea una nueva cuenta.
Perfil: Ve y edita tu información personal, historial de peso, notificaciones y objetivos de salud.
Registro de Alimentos: Registra los alimentos consumidos.
Historial de Comidas: Ve el historial de alimentos consumidos.
Objetivos: Establece y ve tus objetivos de salud.
Educación: Busca información nutricional sobre diferentes alimentos.
Configuración: Añade recordatorios y ve las