![Biq Blue](/img/icon.png) 

# Biq Blue

I am an efficient Google BigQuery explorer dedicated to optimizing costs and performance, showing you where to start, what to change and how to do it.

🖐️ The easiest way to try is probably to use the desktop version. If you're a Bigquery developer, you've already installed gcloud or a service account.

## Quick start
- You want to install the MacOS, Windows or Linux version? Then go to the [desktop version setup](https://github.com/biqblue/docs/blob/main/DESKTOP.md)
- You want to install the Docker version? Then go to [Docker Hub](https://hub.docker.com/r/biqblue/biqblue)
- You have questions? Then go to [Q&A](https://github.com/biqblue/docs/blob/main/Q%26A.md).

## Screenshots

<img src="https://biq.blue/img/screenshots/root.webp" height="200"> <img src="https://biq.blue/img/screenshots/monthly-report.webp" height="200"> <img src="https://biq.blue/img/screenshots/savings.webp" height="200"> <img src="https://biq.blue/img/screenshots/compute-service.webp" height="200"> <img src="https://biq.blue/img/screenshots/compute-user.webp" height="200"> <img src="https://biq.blue/img/screenshots/slot-reservations.webp" height="200"> <img src="https://biq.blue/img/screenshots/queries.webp" height="200"> <img src="https://biq.blue/img/screenshots/storage-overview.webp" height="200"> <img src="https://biq.blue/img/screenshots/storage-usage.webp" height="200"> <img src="https://biq.blue/img/screenshots/storage-dataset.webp" height="200"> <img src="https://biq.blue/img/screenshots/tables.webp" height="200">

## Release note

### v0.3.29 🚨

- Add Cost Anomaly Dectection analysis
- Add search input everywhere (quick access)
- Improve Biq alerting messages
- Add direct link to Bigquery console from query page

### v0.3.25 🥒

- Start to use Biq Blue while the first initialization is running
- Improve the tables explorer
- Add anomaly detection to the web hook

### v0.3.21 🥬

- Improve setup (can configure temporary vs permanent table from setup)
- Deactivate automatic update by default
- Fix

### v0.3.17 🌽

- Add all supported Bigquery [locations](https://cloud.google.com/bigquery/docs/locations#supported_locations)

### v0.3.12 🍄

- Fix first time launch
- Setup has been improved 🤞

### v0.3.8 🥑

- Add time travel bytes to storage analysis
- Fix table explorer
- Add table reference filter
- Add `query LIKE "%...%"` filter

### v0.3.5 🥦

- Fix urls, filters, brwoser back button and deeplinks

### v0.3.4 🥕

- Customize analysis and filters using labels

### v0.3.1 🍅

- Add a webhook to receive notifications on any system (Slack, Teams, email, ...), see [documentation](https://hub.docker.com/r/biqblue/biqblue)

### v0.3.0 🥔

- Biq Guery becomes Biq Blue! (you have to update your [Docker files](https://hub.docker.com/r/biqblue/biqblue))

### v0.2.28 🍌

- Data is refreshed every hour, only between 8am to 8pm

### v0.2.25 🍋

- Add current month analysis

### v0.2.17 🍏

- Add Users analysis

### v0.2.14 🥝

- Simple and better version update for MacOS, Linux, Windows and Docker

### v0.2.11-beta 🫐

- Update data every hour, in background
- Add Slack [alerting](https://github.com/biqblue/docs/blob/main/docker.md)

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
