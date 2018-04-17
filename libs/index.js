/**
 * Docsify config
 */
// gitalkConfig = {
//   clientID: '8b7cffeb4ae285e0e3e4',
//   clientSecret: '58d06f5220e953d6dac7d6723daf225177cc7bb3',
//   repo: 'You-need-to-know-css',
//   owner: 'l-hammer',
//   admin: ['l-hammer'],
//   distractionFreeMode: false
// },
window.$docsify = {
  name: 'Wiki',
  repo: 'https://github.com/mjyi/wiki',
  alias: {
    '/.*/_navbar.md': '/_navbar.md',
    '/.*/_sidebar.md': '/_sidebar.md', 
  },
  auto2top: true,
  loadSidebar: true,
  subMaxLevel: 2,
  homepage: 'README.md',
  search: {
    noData: {
      '/': '找不到结果!'
    },
    paths: 'auto',
    placeholder: {
      '/': '搜索'
    }
  },
  plugins: [
    function(hook, vm) {
      hook.beforeEach(function (html) {
        var url = 'https://github.com/mjyi/wiki/blob/master/' + vm.route.file;
        var editHtml = '[📝 EDIT DOCUMENT](' + url + ')\n';
        
        return editHtml + html;
      })

      hook.doneEach(function(){
        var label, domObj, main, divEle, gitalk;
        label = vm.route.path.split('/').join('');
        domObj = Docsify.dom;
        main = domObj.getNode("#main");

        /**
         * render gittalk
         */
        // Array.apply(null,document.querySelectorAll("div.gitalk-container")).forEach(function(ele){ele.remove()});
        // divEle = domObj.create("div");
        // divEle.id = "gitalk-container-" + label;
        // divEle.className = "gitalk-container";
        // divEle.style = "width: " + main.clientWidth + "px; margin: 0 auto 20px;";
        // domObj.appendTo(domObj.find(".content"), divEle);
        // gitalk = new Gitalk(Object.assign(gitalkConfig, {id: !label ? "home" : label}))
        // gitalk.render('gitalk-container-' + label)
      })
    }
  ]
}