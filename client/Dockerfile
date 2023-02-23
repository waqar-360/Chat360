FROM node:lts-alpine

WORKDIR /app
COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 4200

# Serve the app
CMD ["npm", "run", "start"]