# regulus
online course

# deploy test environment
bash deploy.sh test

## work with docker
go to the folder you want to work in docker container and run
```
docker run -dit -v .:/usr/src/app --name regulus sleavely/node-awscli:18.x
docker exec -it regulus bash
```
then you can use vs-code extenstion, Remote Development, to attach to the container and work in it.