const override = require("customize-cra").override;
const addBabelPlugins = require("customize-cra").addBabelPlugins;

module.exports = override(
  ...addBabelPlugins([
    "babel-plugin-root-import",
    {
      rootPathSuffix: "src",
      rootPathPrefix: "~"
    }
  ])
);
