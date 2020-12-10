module.exports = {
  title: 'Rivarrl\'s Blog',
  serviceWorker: true,
  head: [
    ['link', { rel: 'icon', href: '/img/logo.jpeg' }]
  ],
  markdown: {
    // 显示代码行号
    lineNumbers: true
  },
  themeConfig: {
    logo:"/img/logo.jpeg",
    nav: [
      { text: '首页', link: '/home' },
      { text: '技术', link:'/tech'},
      { text: '随笔',link: '/article'},
      { text: '生活',link: '/life' },
      { text: 'RSS', link:'/rss'},
      { text: '标签', link: '/tags' },
      { text: '留言板', link:'/massage'},
      { text: '关于', link:'/about'},
      { text: '友情链接', link:'/links'},
      { text: '链接',
        items: [
          {text:'GitHub',link: 'https://github.com/Rivarrl' },
          {text:'Gitee',link: 'https://gitee.com/Rivarrl' },
        ]
      }
    ],
    lastUpdated: 'Last Updated', 
  },
  plugins: [
    [
      'vuepress-plugin-comment',
      {
        choosen: 'valine',
        options: {
          el: '#valine-vuepress-comment',
          appId: process.env.VUE_APP_VALINE_APPID,
          appKey: process.env.VUE_APP_VALINE_APPKEY
        }
      }
    ]
  ]
}