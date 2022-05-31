wasm-pack build --target web
cp -R pkg/ /var/www/html/pkg
cp index.html /var/www/html
cp mod.js /var/www/html/
