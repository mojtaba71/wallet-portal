#!/bin/bash
IMAGETAG=$1':'$2

npm install --force
npm run build 
mv dist docker/html

cd docker
docker build --squash -t $IMAGETAG . || exit 1

docker push $IMAGETAG || exit 1
