FROM node:20-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install

# Copy the rest of the code is handled by volume in dev, but useful for build context
COPY . .

CMD ["npm", "run", "dev", "--", "--host"]
