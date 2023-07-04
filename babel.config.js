module.exports = function(api) {
  api.cache(true);
  return {
    presets: ['babel-preset-expo'],
    plugins: [
      ["module:react-native-dotenv", {
        "envName": "USER_POOL_ENV",
        "moduleName": "@user-pool-env",
        "path": ".env",
        "safe": false,
        "allowUndefined": true,
        "verbose": false
      }]
    ]
  };
};
