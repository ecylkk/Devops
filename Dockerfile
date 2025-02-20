FROM node:18
WORKDIR /app
COPY server.js .
COPY index.html .
RUN npm install express
CMD ["node", "server.js"]
EXPOSE 3000