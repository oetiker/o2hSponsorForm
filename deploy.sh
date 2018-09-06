#!/bin/sh
set -x
./node_modules/.bin/qx compile --target build
cp build-output/sponsor/* ~/data/privat/2stdlauf/2018/website/sponsor
cd  ~/data/privat/2stdlauf/2018/website
perl -i -p -e 's/sponsor.html.+?"/"sponsor.html?r=".rand()/e' sponsor.html
./site-sync