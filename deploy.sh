#!/bin/sh
set -x
npx qx compile --target build
cp build-output/sponsor/* ~/data/privat/2stdlauf/2019/website/sponsor
cd  ~/data/privat/2stdlauf/2019/website
perl -i -p -e 's/sponsor.html.+?"/"sponsor.html?r=".rand()/e' sponsor.html
./site-sync