FROM node:18-alpine

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .

EXPOSE 3002

# CMD ["npm", "run", "dev"]

CMD ["sh", "-c", "npm run seed:admin && npm run dev"]
