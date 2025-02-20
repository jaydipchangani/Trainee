const path = require("path");

module.exports = function override(config) {
  config.resolve.alias = {
    ...config.resolve.alias,
    "@globalComponents": path.resolve(__dirname, "../Learn/Global/global-components"),
  };
  return config;
};
