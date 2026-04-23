FROM postgres:15-alpine

ENV POSTGRES_DB=harbor_ops
ENV POSTGRES_USER=harbor_user
ENV POSTGRES_PASSWORD=harbor_pass

COPY init.sql /docker-entrypoint-initdb.d/

EXPOSE 5432
