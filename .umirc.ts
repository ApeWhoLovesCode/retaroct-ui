import { defineConfig, webpack } from 'dumi';

export default defineConfig({
  title: 'retaroct',
  favicon:
    'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  logo: 'https://user-images.githubusercontent.com/9554297/83762004-a0761b00-a6a9-11ea-83b4-9c8ff721d4b8.png',
  outputPath: 'docs-dist',
  mode: 'site',
  alias: {
    // '@tarojs/taro': '@tarojs/taro-h5',
    // '@tarojs/components$': '@tarojs/components/dist-h5/react',
  },
  chainWebpack(memo, { webpack }) {
    // memo.resolve.alias.set('@tarojs/taro', '@tarojs/taro-h5')
    // memo.resolve.alias.set('@tarojs/components$', '@tarojs/components/dist-h5/react')

    memo.merge({
      resolve: {
        alias: {
          '@tarojs/taro': '@tarojs/taro-h5',
          '@tarojs/components$': '@tarojs/components/dist-h5/react',
        },
      },
      plugins: [
        new webpack.DefinePlugin({
          'process.env.TARO_ENV': JSON.stringify('h5'),
          ENABLE_INNER_HTML: JSON.stringify(false),
          ENABLE_ADJACENT_HTML: JSON.stringify(false),
          ENABLE_SIZE_APIS: JSON.stringify(false),
          ENABLE_TEMPLATE_CONTENT: JSON.stringify(false),
          ENABLE_CLONE_NODE: JSON.stringify(false),
          ENABLE_CONTAINS: JSON.stringify(false),
          ENABLE_MUTATION_OBSERVER: JSON.stringify(false),
        }),
      ].filter(Boolean),
    });
    // memo.plugins().add(
    //   new webpack.DefinePlugin({
    //     'process.env.TARO_ENV': JSON.stringify('h5'),
    //     ENABLE_INNER_HTML: JSON.stringify(false),
    //     ENABLE_ADJACENT_HTML: JSON.stringify(false),
    //     ENABLE_SIZE_APIS: JSON.stringify(false),
    //     ENABLE_TEMPLATE_CONTENT: JSON.stringify(false),
    //     ENABLE_CLONE_NODE: JSON.stringify(false),
    //     ENABLE_CONTAINS: JSON.stringify(false),
    //     ENABLE_MUTATION_OBSERVER: JSON.stringify(false),
    //   })
    // )
  },
  // more config: https://d.umijs.org/config
});
