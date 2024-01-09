module.exports = {
  stories: ['../src/**/*.stories.mdx', '../src/**/*.stories.@(js|jsx|ts|tsx)'],
  addons: ['@storybook/addon-links', '@storybook/addon-essentials', '@storybook/addon-interactions'],

  framework: {
    name: '@storybook/nextjs',
    options: {}
  },

  webpackFinal: async (config, { configType }) => {
    config.resolve = {
      ...config.resolve,
      fallback: {
        ...(config.resolve || {}).fallback,
        fs: false,
      },
    };

    // Return the altered config
    return config;
  },

  features: {
    emotionAlias: false,
  },

  staticDirs: ['../public'],

  docs: {
    autodocs: true
  }
};
