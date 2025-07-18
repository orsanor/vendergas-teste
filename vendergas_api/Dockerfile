FROM node:20-alpine
WORKDIR /app
COPY . .
COPY package*.json ./
RUN rm -rf node_modules
ENV NODE_ENV=development
RUN npm i
EXPOSE 3000
CMD ["npm", "dev", "build", "npx prisma generate && npx prisma db push"]