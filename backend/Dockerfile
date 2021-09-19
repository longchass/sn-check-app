FROM node:8.16

RUN apt-get update

# for https
RUN apt-get install -yyq ca-certificates
# install libraries
RUN apt-get install -yyq libappindicator1 libasound2 libatk1.0-0 libc6 libcairo2 libcups2 libdbus-1-3 libexpat1 libfontconfig1 libgcc1 libgconf-2-4 libgdk-pixbuf2.0-0 libglib2.0-0 libgtk-3-0 libnspr4 libnss3 libpango-1.0-0 libpangocairo-1.0-0 libstdc++6 libx11-6 libx11-xcb1 libxcb1 libxcomposite1 libxcursor1 libxdamage1 libxext6 libxfixes3 libxi6 libxrandr2 libxrender1 libxss1 libxtst6
# tools
RUN apt-get install -yyq gconf-service lsb-release wget xdg-utils
# and fonts
RUN apt-get install -yyq fonts-liberation


WORKDIR /node

ENV SECRET_CISCO_USERNAME=peter.do@innetsol.com
ENV SECRET_CISCO_PASSWORD=IThb1234
ENV MONGODB=mongodb://192.168.5.6:27017/inventory

RUN export SECRET_CISCO_USERNAME=peter.do@innetsol.com
RUN export SECRET_CISCO_PASSWORD=IThb1234
RUN export MONGODB="mongodb://192.168.5.13:27017/inventory"

COPY package.json ./

RUN npm install

COPY . .

EXPOSE 3000

RUN npm install pm2 -g
ENV PM2_PUBLIC_KEY 11alp871mmtp14t
ENV PM2_SECRET_KEY by0lwx3kwqx57k9

CMD ["pm2-runtime", "./bin/www", "-i", "max"]
