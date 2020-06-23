/* eslint-disable @typescript-eslint/explicit-function-return-type, func-names */
module.exports = function (api) {
  // This caches the Babel config by environment.
  api.cache.using(() => process.env.NODE_ENV);

  return {
    presets: ['babel-preset-expo'],
    plugins: ['inline-dotenv'],
  };
};
