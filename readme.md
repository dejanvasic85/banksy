# Banksy

[![CircleCI](https://circleci.com/gh/dejanvasic85/banksy.svg?style=svg)](https://circleci.com/gh/dejanvasic85/banksy)

CLI application capable of pulling (mostly web scraping) bank transactions from various Australian banks. It is triggered with a schedule and runs per user configuration which contains the details including: 

- Bank Accounts
- Publisher configuration (where to publish the transaction)

## Architecture

In the architecture diagram below this application is on the left hand side purely responsible for fetching and publishing new bank transactions.

![](https://drive.google.com/open?id=1orR5fQEn99HU-6cKs8hh9JQznay0Qzy_)

## Running the CLI

At the moment, the application needs to be cloned and run as a regular application in a windows / linux machine that can run native [Selenium drivers](https://www.npmjs.com/package/selenium-webdriver). 

Ideally, this will be moved to be a serverless application that can be just deployed to any account. This is definitely the ideal scenario.


## Mongo Database cache

In order to ensure the transactions are unique, a mongo database is used to store the previous transactions to compare against. 

## Subscribing to Transactions

Each user configuration should have a publisher associated with a type and address. At the moment Amazon SNS is only supported but can easily be extended.