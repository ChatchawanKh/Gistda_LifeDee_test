# FROM node:20.17.0

# WORKDIR /app

# COPY package*.json .

# RUN npm install

# COPY . .

# EXPOSE 3000

# CMD ["npm", "run", "dev"]

### TEST ###

FROM node:20.17.0

WORKDIR /app

COPY package*.json .

RUN npm install

COPY . .

RUN npm run build

# ใช้ vite preview (หรือจะเปลี่ยนไปใช้ serve ก็ได้)
# EXPOSE 4173
EXPOSE 3000
CMD ["npm", "run", "preview"]

# EXPOSE 4173
# CMD ["npm", "run", "preview", "--", "--host", "0.0.0.0"]
