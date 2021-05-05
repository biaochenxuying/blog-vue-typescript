// https://www.cherylgood.cn/detail/5bdaf4722382b4646c27143b.html
import highlight from 'highlight.js'
import marked from 'marked'
// const highlight = require("highlight.js");
// const marked = require("marked");
const tocObj = {
  add: function (text: any, level: any) {
    var anchor = `#toc${level}${++this.index}`;
    this.toc.push({ anchor: anchor, level: level, text: text });
    return anchor;
  },
  // 使用堆栈的方式处理嵌套的ul,li，level即ul的嵌套层次，1是最外层
  // <ul>
  //   <li></li>
  //   <ul>
  //     <li></li>
  //   </ul>
  //   <li></li>
  // </ul>
  toHTML: function () {
    let levelStack: any = [];
    let result = "";
    const addStartUL = () => {
      result += '<ul class="anchor-ul" id="anchor-fix">';
    };
    const addEndUL = () => {
      result += "</ul>\n";
    };
    const addLI = (anchor: any, text: any) => {
      result +=
        '<li><a class="toc-link" href="#' + anchor + '">' + text + "<a></li>\n";
    };

    this.toc.forEach(function (item: any) {
      let levelIndex = levelStack.indexOf(item.level);
      // 没有找到相应level的ul标签，则将li放入新增的ul中
      if (levelIndex === -1) {
        levelStack.unshift(item.level);
        addStartUL();
        addLI(item.anchor, item.text);
      } // 找到了相应level的ul标签，并且在栈顶的位置则直接将li放在此ul下
      else if (levelIndex === 0) {
        addLI(item.anchor, item.text);
      } // 找到了相应level的ul标签，但是不在栈顶位置，需要将之前的所有level出栈并且打上闭合标签，最后新增li
      else {
        while (levelIndex--) {
          levelStack.shift();
          addEndUL();
        }
        addLI(item.anchor, item.text);
      }
    });
    // 如果栈中还有level，全部出栈打上闭合标签
    while (levelStack.length) {
      levelStack.shift();
      addEndUL();
    }
    // 清理先前数据供下次使用
    this.toc = [];
    this.index = 0;
    return result;
  },
  toc: [] as any,
  index: 0
};

class MarkUtils {
  private rendererMD: any;

  constructor() {
    this.rendererMD = new marked.Renderer() as any;
    this.rendererMD.heading = function (text: any, level: any, raw: any) {
      var anchor = tocObj.add(text, level);
      return `<h${level} id=${anchor}>${text}</h${level}>\n`;
    };
    this.rendererMD.table = function (header: any, body: any) {
      return '<table class="table" border="0" cellspacing="0" cellpadding="0">' + header + body + '</table>'
    }
    highlight.configure({ useBR: true });
    marked.setOptions({
      renderer: this.rendererMD,
      headerIds: false,
      gfm: true,
      // tables: true,
      breaks: false,
      pedantic: false,
      sanitize: false,
      smartLists: true,
      smartypants: false,
      highlight: function (code: any) {
        return highlight.highlightAuto(code).value;
      }
    });
  }

  async marked(data: any) {
    if (data) {
      let content = await marked(data);
      let toc = tocObj.toHTML();
      return { content: content, toc: toc };
    } else {
      return null;
    }
  }
}

const markdown: any = new MarkUtils();

export default markdown;
