# Docker Quick Setup

Biq Guery is available on [Docker Hub](https://hub.docker.com/r/biqguery/biqguery).

## Prerequisites

You need a GCP service-account with the following access rights:
```
- roles/bigquery.dataViewer
- roles/bigquery.metadataViewer
- roles/bigquery.resourceViewer
- roles/bigquery.user
```

If you want to see everything, get a service-account **at organization level**.

## You are 1

You have Docker installed on your computer, here the easiest way to start. You only need to specify the path to the GCP service-account file `/path.to/credentials.json`.

```sh
docker pull biqguery/biqguery
docker run -p 3000:3000 -v /path.to/credentials.json:/app/credentials.json biqguery
```

Biq should be available at http://localhost:3000.

## You are a team

Here the best configuration for a team.

Create a `docker-compose.yml` file.

```yml
version: '3'
# Docker Compose Example for running BigQuery with several containers
# one container must be master (set env variable MASTER to true), because it runs some init commands
# others are slaves, they just run the app: you can scale them as you want
services:
  master:
    image: biqguery/biqguery:latest
    environment:
      - MASTER=true
      - OPEN_URL=false
      - BIQGUERY_PROJECT=my-project
      - BIQGUERY_DATASET=my-dataset
      - SLACK_WEBHOOK_URL=your-slack-webhook
      - CLIENT_ROOT=root-of-your-deployment
    ports:
      - "3000:3000"
    volumes:
    # you must provide your Google Cloud credentials.json file
      - /path.to/credentials.json:/app/credentials.json
      - /path.to/config.json:/app/config.json

  slave:
    image: biqguery/biqguery:latest
    environment:
      - MASTER=false
      - OPEN_URL=false
      - BIQGUERY_PROJECT=my-project
      - BIQGUERY_DATASET=my-dataset
    ports:
      - "3001:3000"
    volumes:
    # you must provide your Google Cloud credentials.json file
      - /path.to/credentials.json:/app/credentials.json
      - /path.to/config.json:/app/config.json
  
  # add a load balancer
  # ...
```

### Environment

| Environment | Value | Description  |
|---|---|---|
| MASTER | true/false | ⚠️ You can have only 1 master ⚠️ |
| BIQGUERY_PROJECT | my-project | GCP Bigquery project |
| BIQGUERY_DATASET | my-dataset | GCP Bigquery dataset where to store Biq [tables](https://github.com/biqguery/docs/blob/main/README.md#temporary-tables-vs-non-temporary-tables) |
| CLIENT_ROOT | https://my-internal-url.com | Root url of the client |
| SLACK_WEBHOOK_URL | https://hooks.slack.com/services/AAA | Slack web hook to get notifications directly in Slack |

⚠️ You **must** have only 1 `MASTER=true`, then you could have as many slave `MASTER=false` as you want. Having multiple master will result in high costs, so be careful!

### Files

| Files | Value | Description  |
|---|---|---|
| credentials.json | GCP service-account  | Access to Bigquery |
| config.json | [Pricing](https://github.com/biqguery/docs/blob/main/README.md#setup-gcp-pricing) configuration | Configure the pricing of Bigquery according to the SKU you are using |

Add these files at the root folder of the app `/app/`.

### Example: Start 1 master and 1 slave

```sh
docker-compose up --scale slave=1
```

Biq should be available at http://localhost:3000.

⚠️ Once again, slave configuration must be `MASTER=false`!

### Setup a load balancer

Do as usual, but we strongly recommend to host Biq Guery **only in your private network**. ⚠️ Do not host Biq Guery on public endpoints.

### Automatic update

Biq Guery is updated several times a week; to always benefits of the last features just setup a rolling update with your orchestrator.

Some examples:
- Kubernetes [rolling update](https://kubernetes.io/docs/tutorials/kubernetes-basics/update/update-intro/)
- Swarm [rolling update](https://docs.docker.com/engine/swarm/swarm-tutorial/rolling-update/)


