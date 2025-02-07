FROM node:19.5.0-alpine


ENV TZ=America/Mexico_City

RUN apk add --no-cache tzdata

RUN cp /usr/share/zoneinfo/$TZ /etc/localtime && echo $TZ > /etc/timezone

WORKDIR /app

COPY package.json .

RUN npm install



COPY . .


CMD ["npm", "start"]

