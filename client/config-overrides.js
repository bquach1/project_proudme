const webpack = require('webpack');

module.exports = function override(config, env) {
  // Ensure config is a valid Webpack object
  config.resolve.fallback = {
    ...config.resolve.fallback,
    crypto: require.resolve('crypto-browserify'),
  };

  return config;  // Ensure that the config object is returned
};
