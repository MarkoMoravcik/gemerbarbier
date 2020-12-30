module.exports = {
  transpileDependencies: ["vuetify"],
  devServer: {
    port: 8081
  },
  configureWebpack: {
    output: {
      filename: "[name].[hash].bundle.js"
    }
  }
};
