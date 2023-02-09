import { defineConfig } from 'dumi';

export default defineConfig({
  title: 'retaroct',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  alias: {
    '@tarojs/taro': '@tarojs/taro-h5',
    '@tarojs/components$': '@tarojs/components/dist-h5/react',
  },
  define: {
    'process.env.TARO_ENV': 'h5',
    ENABLE_INNER_HTML: 'false',
    ENABLE_ADJACENT_HTML: 'false',
    ENABLE_SIZE_APIS: 'false',
    ENABLE_TEMPLATE_CONTENT: 'false',
    ENABLE_CLONE_NODE: 'false',
    ENABLE_CONTAINS: 'false',
    ENABLE_MUTATION_OBSERVER: 'false',
  },
  // more config: https://d.umijs.org/config
});
