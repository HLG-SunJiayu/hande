#!/bin/bash
set -e

find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_BASE_PATH $BUILD_BASE_PATH g"
find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_API_HOST $BUILD_API_HOST g"
find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_CLIENT_ID $BUILD_CLIENT_ID g"
find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_WEBSOCKET_HOST $BUILD_WEBSOCKET_HOST g"
find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_SRC_WEBSOCKET_HOST $BUILD_SRC_WEBSOCKET_HOST g"
find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_PLATFORM_VERSION $BUILD_PLATFORM_VERSION g"
find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_SRM_MALL_HOST $BUILD_SRM_MALL_HOST g"
find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_WFP_EDITOR $BUILD_WFP_EDITOR g"
find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_LOGIN_URL $BUILD_LOGIN_URL g"
find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_LOGOUT_URL $BUILD_LOGOUT_URL g"
find /usr/share/nginx/html -name '*.js' | xargs sed -i "s BUILD_PUBLIC_URL $BUILD_PUBLIC_URL g"
find /usr/share/nginx/html -name '*.json' | xargs sed -i "s BUILD_PUBLIC_URL $BUILD_PUBLIC_URL g"
find /usr/share/nginx/html -name '*.css' | xargs sed -i "s BUILD_PUBLIC_URL $BUILD_PUBLIC_URL g"
find /usr/share/nginx/html -name '*.html' | xargs sed -i "s BUILD_PUBLIC_URL $BUILD_PUBLIC_URL g"

exec "$@"
