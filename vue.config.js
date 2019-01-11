module.exports = {
  pluginOptions: {
    electronBuilder: {
      builderOptions: {
        productName: 'WS Ardu',
        appId: 'robota.impakto.ws-ardu',
        mac: {
          category: 'Utilities'
        },
        win: {
          target: 'portable'
        }
      }
    }
  },

  configureWebpack: {
    module: {
      rules: [
        {
          test: /\.worker\.js$/,
          use: { loader: 'worker-loader' }
        }
      ]
    }
  },

  baseUrl: undefined,
  outputDir: 'public',
  assetsDir: 'assets',
  runtimeCompiler: undefined,
  productionSourceMap: undefined,
  parallel: undefined,
  css: undefined
}
