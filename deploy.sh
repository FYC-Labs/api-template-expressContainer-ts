# /bin/sh

PROJECT_ID={{project-id}}
APP_NAME=api-qa
IMAGE_NAME="$APP_NAME:latest"
CLOUD_IMAGE_NAME="us-central1-docker.pkg.dev/${PROJECT_ID}/api/$IMAGE_NAME"

docker build -f Dockerfile.prod -t $IMAGE_NAME .
docker tag $IMAGE_NAME $CLOUD_IMAGE_NAME
docker push $CLOUD_IMAGE_NAME
gcloud run deploy $APP_NAME --image=$CLOUD_IMAGE_NAME --region=us-central1 --platform=managed --allow-unauthenticated --network=default --subnet=default --vpc-egress=private-ranges-only --update-secrets=DATABASE_URL=DATABASE_URL:latest  --ingress=internal
