# Desktop configuration

### Download and install
First, download your binaries on [biqguery.com](https://biqguery.com#download).

- On MacOS, install the `.dmg` file as usual, and start it from the launchpad
- On Windows, unzip the `.exe` file and double click on it
- On Linux, unzip the file and start it from a terminal

#### ⚠️ Required on Windows
- You need to [unrestrict the ExecutionPolicy](https://learn.microsoft.com/fr-fr/troubleshoot/azure/active-directory/cannot-run-scripts-powershell)
- On Windows 11, you may need to "unblock" the app

### Setup

Your web browser should open the [setup](http://127.0.0.1:3000/setup.html) page.

<img width="1063" alt="Screenshot 2023-10-19 at 15 20 42" src="https://github.com/biqblue/docs/assets/134798784/5cbf86a9-1aca-4564-bf0a-f85ea74a29a4">

Install and setup all the requirements:
- Install gcloud cli
- Login to gcloud cli
- Have enough access rights for Google Bigquery

You need the following access rights for Bigquery (to see everything, get them at the organisation level):
```
IAM Roles you need:
- roles/bigquery.dataViewer
- roles/bigquery.metadataViewer
- roles/bigquery.resourceViewer
- roles/bigquery.user
```

### Options

Biq Blue copy `JOBS` and `TABLES` rows from `INFORMATION_SCHEMA` in all available projects.

#### Temporary tables

By default, Biq uses temporary tables. This is the simplest way to start but the downside is that tables expire after 24 hours.

#### Permanent tables

If you use Biq Blue every day you should consider the option of creating a dataset just for it: Biq will create tables in this dataset with 3 main benefits:
- tables never expired and Biq will only copy the latest rows from `INFORMATION_SCHEMA` into these tables
- tables can be shared for your own queries or dashboard if needed (API)
- you can activate the automatic hourly update to always have fresh data

<img width="1062" alt="Screenshot 2023-10-19 at 15 29 05" src="https://github.com/biqblue/docs/assets/134798784/48e9df2b-63b6-412b-b32f-93557eb352e1">

### Restart

When it is done, simply restart the app 👍.

### Advanced setup

By default, Biq create a configuration file in `~/.biq/config.json`. You can play with it, but in case of problem just delete it and restart.

#### GCP Pricing

Price are configured in `config.json`, you can customize them using this [documentation](https://cloud.google.com/skus).

