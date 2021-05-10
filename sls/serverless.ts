import type { AWS } from '@serverless/typescript';

import scraper from '@functions/scraper';

const serverlessConfiguration: AWS = {
  service: 'banksy-scraper',
  frameworkVersion: '2',
  custom: {
    dotenv: {
      path: '.env',
    },
    webpack: {
      webpackConfig: './webpack.config.js',
      includeModules: true,
    },
  },
  plugins: ['serverless-dotenv-plugin', 'serverless-webpack'],
  provider: {
    name: 'aws',
    region: 'ap-southeast-2',
    stage: 'dev',
    runtime: 'nodejs14.x',
    apiGateway: {
      minimumCompressionSize: 1024,
      shouldStartNameWithService: true,
    },
    environment: {
      AWS_NODEJS_CONNECTION_REUSE_ENABLED: '1',
    },
    lambdaHashingVersion: '20201221',
  },
  // import the function via paths
  functions: {
    scraper,
  },
};

module.exports = serverlessConfiguration;
