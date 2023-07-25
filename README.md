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

#### Docker

> 💡 Soon Docker version will be deployable on your infrastructure, so you can make it easily accessible to all your collaborators. This version is perfect for teamwork.

## How does it work?

### Security

I'm a Bigquery client developed in NodeJS, using your local development environment to run analysis queries.

The queries I can make are therefore limited to your access rights. <ins>None of your requests are executed on our servers, ever</ins>.

I'm easy to set up and I'm secure 🔓.

### Cost

I'm in an open BETA development phase, 100% free during this period.

However, the analysis requests made may generate Analysis costs in Bigquery (the latest measurements show a cost of less than 0.1% of the total Bigquery bill).

The open BETA phase will enable us to improve the product and determine together a fair and win-win pricing model 💪.

## Release note

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