FROM node:20-alpine AS frontend-build
WORKDIR /app
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci --no-audit --no-fund
COPY frontend/ ./
RUN npm run build

FROM golang:1.22-alpine AS backend-build
WORKDIR /app
COPY backend/ ./
RUN CGO_ENABLED=0 go build -o /server ./cmd/server

FROM scratch
COPY --from=backend-build /server /server
COPY --from=frontend-build /app/dist /public
ENV STATIC_DIR=/public
EXPOSE 8080
USER 65532:65532
ENTRYPOINT ["/server"]
