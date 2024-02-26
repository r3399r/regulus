# regulus
online course

# install dependencies
docker-compose -f docker-compose.builder.yml run --rm install

# dev mode
docker-compse up

# deploy test environment
bash deploy.sh test