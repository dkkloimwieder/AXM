FROM node:alpine
LABEL description="Graphile - Automagic Postgres GraphQL"
RUN npm install -g postgraphile
RUN npm install -g  @graphile-contrib/pg-simplify-inflector postgraphile-plugin-connection-filter graphile-upsert-plugin
EXPOSE 5000
ENTRYPOINT ["postgraphile", "-n", "0.0.0.0"]
