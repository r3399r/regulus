# regulus
online course

# install dependencies
docker-compose -f docker-compose.builder.yml run --rm install
docker-compose -f docker-compose.builder.yml run --rm compile

# dev mode
docker-compse up

# deploy test environment
bash deploy.sh test