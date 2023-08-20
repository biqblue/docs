# ![Biq Guery](/img/icon-small.png) Biq Guery 

Greetings. I am [Biq Guery](https://biqguery.com), a old-school AI designed to explore and optimize your Google Bigquery usage. I shall be referred to as "Biq".

## Overview
[Google Bigquery](https://cloud.google.com/bigquery) is a fantastic technology that is way ahead of all its competitors. Its scalability and simplicity give you a phenomenal competitive edge by enabling dev, data and business profiles to speak the same language, on the same data with a simple SQL query, without worrying about infrastructure sizing. I am an absolute fan of Google Bigquery, no doubt about it.

However, this ease of use comes at a cost, and Google Bigquery offers many ways of optimizing them. I am here to help you identify and implement them.

## Setup

### How-to

Download the [zip file](https://biqguery.com/#download) for your platform. Extract the archive and double-click on the extracted file.

If you are a Bigquery developer, you should already have the `gcloud` tool installed, and the app should just work. Otherwise, you need to be authenticated on Bigquery.

#### Bigquery authentication

There are 2 possible ways to authenticate locally to your Bigquery account: 
- Install and init [GCloud cli](https://cloud.google.com/sdk/docs/downloads-interactive) + `gcloud auth application-default login`
- Use a service account when you start the server, using the env variable `GOOGLE_APPLICATION_CREDENTIALS=<PATH TO YOUR SERVICE ACCOUNT JSON FILE>`

```
IAM Roles you need:
- roles/bigquery.dataViewer
- roles/bigquery.metadataViewer
- roles/bigquery.resourceViewer
- roles/bigquery.user
```

##### ⚠️ Required on Windows
You need to unrestrict the ExecutionPolicy
https://learn.microsoft.com/fr-fr/troubleshoot/azure/active-directory/cannot-run-scripts-powershell

#### Docker 🐳

A Docker iteration is deployable within your infrastructure, facilitating accessible availability to all collaborators. This specific rendition proves optimal for collaborative endeavors. Follow the procedure [here](https://github.com/biqguery/docs/blob/main/docker.md).

## How does it work?

### Security

I'm a Bigquery client developed in NodeJS, using your local development environment to run analysis queries.

The queries I can make are therefore limited to your access rights. <ins>None of your requests are executed on our servers, ever</ins>.

I'm easy to set up and I'm secure 🔓.

### Cost

Presently, I exist within an open BETA stage of development. Throughout this interval, full cost exemption is in effect.

It is important to note that the analytical queries executed might incur Analysis expenses within Bigquery. Based on recent assessments, these expenses amount to less than 0.1% of the overall Bigquery invoice.

The ongoing open BETA phase serves a dual purpose: refining the product and collaboratively devising an equitable and mutually beneficial pricing structure 💪.

## Setup GCP pricing

To attain the highest feasible resemblance to your GCP billing console, it is imperative to tailor the pricing of each individual service. Elucidations concerning pricing are made available by GCP via this [link](https://cloud.google.com/skus). The default course of action entails utilization of pricing applicable to the US region and Enterprise Bigquery Editions.

Execution is straightforward: introduce the file named `config.json` into the principal directory of the application.

## Temporary tables VS non-temporary tables

### CREATE TEMP TABLE

By default, I initiate temporary tables within your Bigquery account, affording the subsequent advantages:
- Rows are precomputed to enhance performance efficiency.
- Permanent traces are absent; tables remain extant for a duration of 24 hours.
- There exists no necessity to possess a `CREATE` privilege pertaining to a designated dataset.

This indeed represents the most straightforward approach to commence proceedings.

### CREATE OR REPLACE TABLE

Please provide distinct values for the environment variables labeled as `BIQGUERY_PROJECT` and `BIQGUERY_DATASET`. These values are crucial for directing the storage location of tables to a predetermined dataset. 

A prerequisite is that the intended dataset **should already exist within the system**. Furthermore, ensure that the project aligns with the ongoing project configuration as established through either the 'gcloud' environment or the active service account.

Advantages stemming from the utilization of tables that are not temporary in nature encompass the following:
- Prolonged persistence of tables exceeding a 24-hour duration.
- Facilitation of query sharing among different users, permitting the creation of customized analyses based on these shared tables.

On MacOS/Linux
```
 BIQGUERY_PROJECT=my-project BIQGUERY_DATASET=my-dataset ./biqguery-app-macos-arm64
```

On Windows
```
 $env:BIQGUERY_PROJECT=my-project ; $env:BIQGUERY_DATASET=my-dataset ; .\biqguery-app-win-x64.exe
```

## Screenshots

<img src="https://biqguery.com/img/screenshots/root.webp" height="200"> <img src="https://biqguery.com/img/screenshots/monthly-report.webp" height="200"> <img src="https://biqguery.com/img/screenshots/savings.webp" height="200"> <img src="https://biqguery.com/img/screenshots/compute-service.webp" height="200"> <img src="https://biqguery.com/img/screenshots/compute-user.webp" height="200"> <img src="https://biqguery.com/img/screenshots/slot-reservations.webp" height="200"> <img src="https://biqguery.com/img/screenshots/queries.webp" height="200"> <img src="https://biqguery.com/img/screenshots/storage-overview.webp" height="200"> <img src="https://biqguery.com/img/screenshots/storage-usage.webp" height="200"> <img src="https://biqguery.com/img/screenshots/storage-dataset.webp" height="200"> <img src="https://biqguery.com/img/screenshots/tables.webp" height="200">

## Release note

### v0.2.10-beta 🍎

- Add option to use non-temporary tables
- Fix updater
- Fix analysis
- Setup custom pricing

### v0.2.0-beta 🍇️

- Add a monthly report dashboard
- Redesign home /

### v0.1.0-beta 🍓

First version:

- Savings analysis
- Compute analysis (by service, by project and by users)
- Storage analysis (overview, last use, storage billing model)
- Slots Flex Reservation analysis (work in progress 🚧)
- Queries exploration
- Tables exploration
- Copy SQL snippet
- Anonymous mode for screenshots
- Pricing configuration

Available for MacOS, Linux and Windows.
