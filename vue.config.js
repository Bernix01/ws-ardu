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
  }
}
