FROM node:18
WORKDIR /app
COPY package.json .
COPY server.js .
COPY index.html .
RUN npm install
CMD ["node", "server.js"]
EXPOSE 3000