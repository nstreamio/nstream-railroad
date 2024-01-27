cd ui
npm run build
npm run bundle
mkdir -p ../src/main/resources/ui/
cp -rf dist/* ../src/main/resources/ui/
