FROM kubernetes.parsyar.ir/nginx:alpine
COPY html /usr/share/nginx/html
COPY nginx.conf /etc/nginx/nginx.conf
CMD ["nginx", "-g", "daemon off;"]
