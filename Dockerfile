FROM node

RUN mkdir ~/app
WORKDIR ~/app

COPY . .

EXPOSE 3000

CMD ["sh", "start.sh"]
