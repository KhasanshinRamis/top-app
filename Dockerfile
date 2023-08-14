# берём базовый образ контейнера
FROM node:14-alpine
# запускаем рабочую директорию
WORKDIR /opt/app
# устанавливаем зависимости
ADD package.json package.json
RUN npm install
# докидываем все оставшие файлы
ADD ..
# указываем что запуск в production
ENV NODE_ENV production
RUN npm build
# оставляем только для production зависимости
RUN npm prune --production
# запускаем наше приложение через порт 3000
CMD ["npm", "start"]
EXPOSE 3000
