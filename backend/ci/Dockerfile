ARG BASE_IMAGE=node:16.13-alpine3.12
ARG WORKDIR=/opt/app

# Install dependencies only when needed
FROM ${BASE_IMAGE} as dependencies
ARG WORKDIR
WORKDIR ${WORKDIR}
COPY package.json yarn.lock ./
RUN yarn install --production=true --frozen-lockfile --network-timeout 1000000
# Copy production node_modules aside (lower image size)
RUN cp -R node_modules prod_node_modules
RUN yarn install --production=false --frozen-lockfile --network-timeout 1000000

# Rebuild the source code only when needed
FROM ${BASE_IMAGE} as builder
ARG WORKDIR
WORKDIR ${WORKDIR}
COPY . .
COPY --from=dependencies ${WORKDIR}/node_modules ./node_modules
RUN yarn build

# Production image, copy all the files and run next
FROM ${BASE_IMAGE} as runner
ARG WORKDIR
WORKDIR ${WORKDIR}

COPY --from=builder ${WORKDIR}/dist ./dist
COPY --from=dependencies ${WORKDIR}/prod_node_modules ./node_modules
COPY --from=builder ${WORKDIR}/package.json ./package.json

EXPOSE 3000
CMD ["yarn", "start"]
