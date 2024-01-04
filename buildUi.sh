cd ui
npm run build
npm run bundle
mkdir -p ../server/src/main/resources/ui/
cp -rf dist/* ../server/src/main/resources/ui/