#!/bin/bash

# Script to auto building, pushing, deploying to minikube and restore value.yaml to default setting (prevent git commit)
# you just need to change the below variables and execute it. If you want to auto increase tag every time you can run below # command (recommend, since our image pullPolicy using IfNotPresent, which means if you use same tag every time, k8s always # pull the first version that cached in k8s, also increasing tag every time is more easy to debug)
# echo 1 > ci/.version

# Example:
# ci/deploy.sh [namespace] [upgrade / uninstall]
# For installation with taonet namespace: './ci/deploy.sh'
# For installation with different namespace: './ci/deploy.sh test-namespace'
# [namespace] default is namespace, you can change it. e.g. 'ci/deploy.sh test-namespace'
# [upgrade]   if you using .version file and need a upgrade without changing value.yaml / deploy.sh
#             you can input this argument. e.g. 'ci/deploy.sh taonet upgrade'
# [uninstall] uninstall the chart e.g. 'ci/deploy.sh taonet uninstall'

REGISTRY=localhost:5000
IMAGE_NAME=donation-backend
TAG=

###################################################################################################

SCRIPT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" &> /dev/null && (pwd -W 2> /dev/null || pwd))
VALUES_FILE=$SCRIPT_DIR/helm/values.yaml

if [ -n "$1" ]; then
  NAMESPACE=$1
else
  NAMESPACE="taonet"
fi

# Auto increase tag version for local development
if [ -f "$SCRIPT_DIR/.version" ]; then
  TAG=$(cat "$SCRIPT_DIR"/.version)

  if [ "$2" == "upgrade" ]; then
    TAG=$((TAG-1))
  fi
fi

if [ "$2" == "uninstall" ]; then
  helm uninstall -n "$NAMESPACE" $IMAGE_NAME
  exit 1;
fi

echo "Registry: $REGISTRY"
echo "Image Name: $IMAGE_NAME"
echo "Tag Verion: $TAG"

# the sed command format for Mac is a little differnt to Linux
if [ "$(uname)" == "Darwin" ]; then

sed -i '' -e "s/tag: \(.*\)/tag: '$TAG'/" "$VALUES_FILE" || { echo >&2 "ERROR: Cannot change values.yaml (no tag found)"; exit 1; }
sed -i '' -e "s/repository: \(.*\)/repository: $REGISTRY\/$IMAGE_NAME/" "$VALUES_FILE" || { echo >&2 "ERROR: Cannot change values.yaml (no repository found)"; exit 1; }

elif [ "$(expr substr $(uname -s) 1 5)" == "Linux" ]; then

sed -i "s/tag: \(.*\)/tag: '$TAG'/" "$VALUES_FILE" || { echo >&2 "ERROR: Cannot change values.yaml (no tag found)"; exit 1; }
sed -i "s/repository: \(.*\)/repository: $REGISTRY\/$IMAGE_NAME/" "$VALUES_FILE" || { echo >&2 "ERROR: Cannot change values.yaml (no repository found)"; exit 1; }

fi

if [ "$2" != "upgrade" ]; then
  docker build . -f "$SCRIPT_DIR/Dockerfile" -t "$IMAGE_NAME" || { echo >&2 "ERROR: Cannot build the image"; exit 1; }

  docker tag "$IMAGE_NAME" "$REGISTRY/$IMAGE_NAME:$TAG" || { echo >&2 "ERROR: Cannot tag the image"; exit 1; }

  docker push "$REGISTRY/$IMAGE_NAME:$TAG" || { echo >&2 "ERROR: Cannot push the image to registry"; exit 1; }
fi

helm upgrade --install -n "$NAMESPACE" "$IMAGE_NAME" "$SCRIPT_DIR/helm" || { echo >&2 "ERROR: Cannot reinstall charts via helm"; exit 1; }

if [ -f "$SCRIPT_DIR/.version" ]; then
  echo $((TAG+1)) > "$SCRIPT_DIR/.version"
fi
if [ "$2" != "upgrade" ]; then
  docker image rm "$REGISTRY/$IMAGE_NAME:$TAG"
fi
exit 1
