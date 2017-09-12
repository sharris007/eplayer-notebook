/*******************************************************************************
 * PEARSON PROPRIETARY AND CONFIDENTIAL INFORMATION SUBJECT TO NDA
 *   
 *  *  Copyright © 2017 Pearson Education, Inc.
 *  *  All Rights Reserved.
 *  * 
 *  * NOTICE:  All information contained herein is, and remains
 *  * the property of Pearson Education, Inc.  The intellectual and technical concepts contained
 *  * herein are proprietary to Pearson Education, Inc. and may be covered by U.S. and Foreign Patents,
 *  * patent applications, and are protected by trade secret or copyright law.
 *  * Dissemination of this information, reproduction of this material, and copying or distribution of this software 
 *  * is strictly forbidden unless prior written permission is obtained from Pearson Education, Inc.
 *******************************************************************************/

const fs = require('fs-extra');
const debug = require('debug')('app:bin:compile');
const webpackCompiler = require('../build/webpack-compiler');
const webpackConfig = require('../build/webpack.config');
const config = require('../config');

const paths = config.utils_paths;

const compile = () => {
  debug('Starting compiler.');
  return Promise.resolve()
    .then(() => webpackCompiler(webpackConfig))
    .then((stats) => {
      if (stats.warnings.length && config.compiler_fail_on_warning) {
        throw new Error('Config set to fail on warning, exiting with status code "1".');
      }
      debug('Copying static assets to dist folder.');
      fs.copySync(paths.client('static'), paths.dist());
    })
    .then(() => {
      debug('Compilation completed successfully.');
    })
    .catch((err) => {
      debug('Compiler encountered an error.', err);
      process.exit(1);
    });
};

compile();
