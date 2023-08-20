# Docker Quick Setup

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
docker pull biqguery
docker run -p 3000:3000 -v /path.to/credentials.json:/app/credentials.json biqguery
```

Biq should be available at http://localhost:3000.

## You are a team

Here the best configuration for a team.

```sh
docker pull biqguery
```

Create `docker-compose.yml` file.

```yml
version: '3'
# Docker Compose Example for running BigQuery with several containers
# one container must be master (set env variable MASTER to true), because it runs some init commands
# others are slaves, they just run the app: you can scale them as you want
services:
  master:
    image: biqguery
    environment:
      - MASTER=true
      - BIQGUERY_PROJECT=my-project
      - BIQGUERY_DATASET=my-dataset
    ports:
      - "3000:3000"
    volumes:
    # you must provide your Google Cloud credentials.json file
      - /path.to/credentials.json:/app/credentials.json
      - /path.to/config.json:/app/config.json

  slave:
    image: biqguery
    environment:
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

- Create 1 master, in charge of updating data (MASTER=true)
- Create as many slave as you need
- Specify the GCP service-account credentials file
- Specify the [pricing](https://github.com/biqguery/docs/blob/main/README.md#setup-gcp-pricing) `config.json` to use
- Specify the Bigquery project `my-project` and the dataset `my-dataset` to store Biq Guery [tables](https://github.com/biqguery/docs/blob/main/README.md#temporary-tables-vs-non-temporary-tables)
- Add a load balancer to dispatch routes on both services

Start 1 master and 1 slave

```sh
docker-compose up --scale slave=1
```

Biq should be available at http://localhost:3000.
