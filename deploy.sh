#!/bin/bash
set -e

env=$1
project=regulus
subDomain=yoho
domain=celestialstudio.net

echo ====================================================================================
echo env: $env
echo project: $project
echo domain: $subDomain.$domain
echo ====================================================================================

# echo execute db scripts...
# cd ./db
# host=$(aws ssm get-parameter --name $env-db-host | jq .Parameter.Value | sed -e 's/^"//' -e 's/"$//')
# user=$(aws ssm get-parameter --name $env-db-user | jq .Parameter.Value | sed -e 's/^"//' -e 's/"$//')
# pwd=$(aws ssm get-parameter --name $env-db-pwd | jq .Parameter.Value | sed -e 's/^"//' -e 's/"$//')
# cluster=$(aws ssm get-parameter --name $env-db-cluster | jq .Parameter.Value | sed -e 's/^"//' -e 's/"$//')
# psql postgresql://$user:$pwd@$host:26257/$cluster.$project -f deploy.sql
# echo ====================================================================================

echo install dependencies...
docker-compose -f docker-compose.builder.yml run --rm install
docker-compose -f docker-compose.builder.yml run --rm compile
echo ====================================================================================

echo deploy backend AWS...
docker-compose -f docker-compose.builder.yml run --rm prepare-layers
aws cloudformation deploy --template-file backend/packaged.yaml --stack-name $project-$env-stack --parameter-overrides TargetEnvr=$env Project=$project SubDomain=$subDomain Domain=$domain --no-fail-on-empty-changeset --s3-bucket y-cf-midway-singapore --capabilities CAPABILITY_NAMED_IAM
echo ====================================================================================

echo deploy frontend-console to S3...
docker-compose -f docker-compose.builder.yml run --rm prepare-console
aws s3 sync ./frontend-console/dist s3://$project-$env-console --delete --cache-control no-cache
echo ====================================================================================

echo deploy frontend-landing to S3...
docker-compose -f docker-compose.builder.yml run --rm prepare-landing
aws s3 sync ./frontend-landing/out s3://$project-$env-landing --delete --cache-control no-cache
echo ====================================================================================
