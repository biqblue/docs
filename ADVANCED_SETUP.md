# Advanced setup

## GCP pricing

To attain the highest feasible resemblance to your GCP billing console, it is imperative to tailor the pricing of each individual service. Elucidations concerning pricing are made available by GCP via this [link](https://cloud.google.com/skus). The default course of action entails utilization of pricing applicable to the US region and Enterprise Bigquery Editions.

Execution is straightforward: introduce the file named `config.json` into your user home directory `~/.biq/config.json`. Default file is available [here](https://github.com/biqguery/docs/blob/main/config.json).

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

#### Using environment variables

On MacOS/Linux
```
 BIQGUERY_PROJECT=my-project BIQGUERY_DATASET=my-dataset ./biqguery-app-macos-arm64
```

On Windows
```
 $env:BIQGUERY_PROJECT=my-project ; $env:BIQGUERY_DATASET=my-dataset ; .\biqguery-app-win-x64.exe
```

#### Using `config.json`

Setup `project` and `dataset` keys in the `~/.biq/config.json`. Default file is available [here](https://github.com/biqguery/docs/blob/main/config.json).
