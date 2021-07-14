module.exports = {
  css: {
    requireModuleExtension: false
  },
  pages: {
    index: {
      entry: 'src/ui/main.js',
      template: 'public/index.html',
      filename: process.env.NODE_ENV === 'production' ? 'build/path/index.html' : 'index.html', 
      chunks: ['chunk-vendors', 'chunk-common', 'index']
    },
  }
}