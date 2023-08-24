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

```sh
docker pull biqguery/biqguery
```

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

**Configure the `docker-compose.yml` file**

- Create 1 master, in charge of updating data with `MASTER=true`
- Create as many slave as you need (⚠️ You **must** set `MASTER=false`, Otherwise, each slave will analyze the JOBS tables, resulting in high costs)
- Specify the GCP service-account credentials file
- Specify the [pricing](https://github.com/biqguery/docs/blob/main/README.md#setup-gcp-pricing) `config.json` to use
- Specify the Bigquery project `my-project` and the dataset `my-dataset` to store Biq Guery [tables](https://github.com/biqguery/docs/blob/main/README.md#temporary-tables-vs-non-temporary-tables)
- Add a load balancer to dispatch routes on both services
- Set the Slack webhook url in `SLACK_WEBHOOK_URL` and set `CLIENT_ROOT` with your internal root url (default is `http://localhost:3000`)

Start 1 master and 1 slave

```sh
docker-compose up --scale slave=1
```

Biq should be available at http://localhost:3000.

⚠️ Once again, slave configuration must be `MASTER=false`! 
