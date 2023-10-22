#!/bin/sh

DATE=`date +%Y.%m.%d.%H.%M`
CONTAINER_NAME=vietnam-ultimate-be-container
IMAGE_NAME=vietnam-ultimate-be

git pull origin main

docker build -t $IMAGE_NAME:$DATE .

result=$(docker ps -q -f name=$CONTAINER_NAME)

if [[ $? -eq 0 ]]; then
    echo "Delete old container"
    docker container rm -f $CONTAINER_NAME
fi

docker run -itd -p 3000:3000 --name $CONTAINER_NAME --network nvnhan-network --network-alias vietnam-ultimate-be-net $IMAGE_NAME:$DATE

docker system prune -a -f 
