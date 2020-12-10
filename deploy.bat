npm run build
cd docs/.vuepress/dist
git init
git add -A
git commit -m 'auto deploy'

git push --force git@github.com:rivarrl/rivarrl.github.io.git master