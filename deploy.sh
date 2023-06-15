#!/bin/bash

# Check if commit message was supplied
if [ "$#" -eq 1 ]; then
    echo "Pushing to Git"
    COMMIT_MESSAGE=$1
    echo "Commit message: ${COMMIT_MESSAGE}"
    # Git operations
    git add --all
    git commit -m "${COMMIT_MESSAGE}"
    git push
fi

# Set Docker variables
DOCKER_USERNAME="elibildman"
# DOCKER_PASSWORD="your_dockerhub_password"
DOCKER_IMAGE_NAME="a3"
DOCKER_IMAGE_VERSION="pi"
DOCKER_REPO="${DOCKER_USERNAME}/${DOCKER_IMAGE_NAME}:${DOCKER_IMAGE_VERSION}"
DOCKER_CONTAINER_NAME="A3"

# Set SSH variables
REMOTE_HOST="10.0.0.200"
REMOTE_USER="elibildman"

echo "Building docker image"
# Build Docker image
docker build --platform linux/arm/v7 -t ${DOCKER_REPO} .

# Log in to DockerHub
# echo ${DOCKER_PASSWORD} | docker login --username ${DOCKER_USERNAME} --password-stdin

echo "Pushing docker image"
# Push Docker image to DockerHub
docker push ${DOCKER_REPO}

echo "Deploying to remote"
# SSH onto the remote system and run Docker commands
ssh ${REMOTE_USER}@${REMOTE_HOST} << EOF
    # Pull Docker image from DockerHub
    docker pull ${DOCKER_REPO}

    # Stop and remove any existing containers from this image
    docker stop ${DOCKER_CONTAINER_NAME}
    docker rm ${DOCKER_CONTAINER_NAME}

    # Run Docker image
    docker run -d --network=host --restart unless-stopped -v /home/elibildman/certs:/certs --name ${DOCKER_CONTAINER_NAME} ${DOCKER_REPO}
EOF
