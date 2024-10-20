# Utiliza una imagen base de Node.js 18
FROM node:18.16

# Establece el directorio de trabajo en la imagen
WORKDIR /app

# Copia el archivo package.json y package-lock.json a la imagen
COPY package*.json ./

# Instala las dependencias del proyecto
RUN npm install

# Copia el resto de los archivos del proyecto a la imagen
COPY . .

# Compila TypeScript (asumiendo que tienes un script de compilación en tu package.json)
RUN npm run build

# Expone el puerto en el que el servidor backend estará escuchando
EXPOSE 8001

# Comando para iniciar el servidor backend
CMD ["npm", "start"]
