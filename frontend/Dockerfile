FROM node:22.13-alpine AS builder
WORKDIR /app
COPY . .
RUN yarn install
RUN yarn build

# Production stage
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY ./nginx/default.conf /etc/nginx/conf.d/default.conf
COPY ./nginx/ssl /etc/nginx/ssl