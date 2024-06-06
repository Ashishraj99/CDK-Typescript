FROM nginx:latest

COPY nginx.conf /etc/nginx/nginx.conf

# Copy static website files
COPY html /usr/share/nginx/html

# Expose port 80 to the outside world
EXPOSE 80

# Command to run when the container starts
CMD ["nginx", "-g", "daemon off;"]

