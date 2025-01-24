FROM nginx

# Copiar el archivo de configuración de Nginx
COPY default.conf /etc/nginx/conf.d/default.conf

# Copiar los archivos del frontend al directorio de Nginx
COPY ./frontend/html /usr/share/nginx/html
COPY ./frontend/css /usr/share/nginx/css
COPY ./frontend/js /usr/share/nginx/js
COPY ./frontend/images /usr/share/nginx/images

