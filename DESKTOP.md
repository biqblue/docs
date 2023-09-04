# Desktop configuration

### Download and install
First, download your binaries on [biqguery.com](https://biqguery.com#download).

- On MacOS, install the `.dmg` file as usual, and start it from the launchpad
- On Windows, unzip the `.exe` file and double click on it
- On Linux, unzip the file and start it from a terminal

Your web browser should open the setup page.

<img width="1207" alt="263542524-eabfe531-f723-4349-b88a-ff80895eb0c1" src="https://github.com/biqguery/docs/assets/134798784/e39074c6-eb3d-4c1c-a87a-eb8914d09d65">

### Requirements

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

When it is done, restart the app, and you should see 3 green ✔️, meaning you're good to go! 🥳



