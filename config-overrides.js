const override = require('customize-cra').override;
const addBabelPlugins = require('customize-cra').addBabelPlugins;

module.exports = {
  webpack: override(
    ...addBabelPlugins([
      'babel-plugin-root-import',
      {
        rootPathSuffix: 'src',
        rootPathPrefix: '~'
      }
    ])
  ),
  jest: config => {
    config.moduleNameMapper = {
      '^~/(.*)$': '<rootDir>/src/$1'
    };
    return config;
  }
};
