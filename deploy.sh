#!/bin/sh
set -x
qx compile --target build
cp build-output/sponsor/boot.js build-output/sponsor/resources.js ~/data/privat/2stdlauf/2017/website/sponsor
cd  ~/data/privat/2stdlauf/2017/website
perl -i -p -e 's/sponsor.html.+?"/"sponsor.html?r=".rand()/e' sponsor.html
./site-sync