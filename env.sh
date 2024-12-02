#!/bin/sh

# Recreate config file
NGINX_ROOT="/usr/share/nginx/html"
ENV_CONFIG_FILE="$NGINX_ROOT/config.js"

# Add runtime environment variables
echo "window.ENV = {" > $ENV_CONFIG_FILE
echo "  VITE_TMDB_API_KEY: '$VITE_TMDB_API_KEY'," >> $ENV_CONFIG_FILE
echo "  VITE_TMDB_ACCESS_TOKEN: '$VITE_TMDB_ACCESS_TOKEN'," >> $ENV_CONFIG_FILE
echo "  VITE_BRANDFETCH_API_KEY: '$VITE_BRANDFETCH_API_KEY'" >> $ENV_CONFIG_FILE
echo "};" >> $ENV_CONFIG_FILE

# Make config.js readable
chmod 644 $ENV_CONFIG_FILE