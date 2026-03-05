
export const mockData = {
  users: [
  { userId: "1", username: "demo", password: "demo123", avatar: "" },
  { userId: "2", username: "admin", password: "admin123", avatar: "" },
],
  types: [
    { typeId: "t1", typeName: "React" },
    { typeId: "t2", typeName: "JavaScript" },
    { typeId: "t3", typeName: "UI/UX" },
  ],

  issues: [
    {
      issueId: "i1",
      issueTitle: "如果遇到组件通信怎么做？",
      issueContent: "我在 React 里遇到父子/兄弟组件通信的问题……",
      scanNumber: 17,
      commentNumber: 4,
      issueStatus: true,
      issueDate: (Date.now() - 100000).toString(),
      userId: "1",
      typeId: "t1",
    },
    {
      issueId: "i2",
      issueTitle: "useEffect 为什么会执行两次？",
      issueContent: "我在开发环境发现 useEffect 会执行两次，这是 bug 吗？",
      scanNumber: 52,
      commentNumber: 10,
      issueStatus: true,
      issueDate: (Date.now() - 200000).toString(),
      userId: "1",
      typeId: "t1",
    },
    {
      issueId: "i3",
      issueTitle: "React 和 Vue 的核心区别是什么？",
      issueContent: "面试时被问到两者核心思想的区别，有什么标准回答？",
      scanNumber: 88,
      commentNumber: 23,
      issueStatus: true,
      issueDate: (Date.now() - 300000).toString(),
      userId: "1",
      typeId: "t1",
    },
    {
      issueId: "i4",
      issueTitle: "JavaScript 闭包到底是什么？",
      issueContent: "总是理解不透闭包的真正意义，可以举例说明吗？",
      scanNumber: 130,
      commentNumber: 40,
      issueStatus: true,
      issueDate: (Date.now() - 400000).toString(),
      userId: "1",
      typeId: "t2",
    },
    {
      issueId: "i5",
      issueTitle: "var、let、const 的区别？",
      issueContent: "它们的作用域和提升规则具体是怎样的？",
      scanNumber: 67,
      commentNumber: 12,
      issueStatus: true,
      issueDate: (Date.now() - 500000).toString(),
      userId: "1",
      typeId: "t2",
    },
    {
      issueId: "i6",
      issueTitle: "如何优化 React 性能？",
      issueContent: "大型列表渲染卡顿，有哪些优化方案？",
      scanNumber: 210,
      commentNumber: 35,
      issueStatus: true,
      issueDate: (Date.now() - 600000).toString(),
      userId: "1",
      typeId: "t1",
    },
    {
      issueId: "i7",
      issueTitle: "什么是 JavaScript 原型链？",
      issueContent: "面试官问到原型链，我应该如何解释？",
      scanNumber: 145,
      commentNumber: 18,
      issueStatus: true,
      issueDate: (Date.now() - 700000).toString(),
      userId: "1",
      typeId: "t2",
    },
    {
      issueId: "i8",
      issueTitle: "UI 设计中的留白有什么作用？",
      issueContent: "为什么很多设计都强调留白？",
      scanNumber: 39,
      commentNumber: 6,
      issueStatus: true,
      issueDate: (Date.now() - 800000).toString(),
      userId: "1",
      typeId: "t3",
    },
    {
      issueId: "i9",
      issueTitle: "如何设计一个响应式布局？",
      issueContent: "Flex 和 Grid 各自适合什么场景？",
      scanNumber: 120,
      commentNumber: 22,
      issueStatus: true,
      issueDate: (Date.now() - 900000).toString(),
      userId: "1",
      typeId: "t3",
    },
    {
      issueId: "i10",
      issueTitle: "Redux Toolkit 有什么优势？",
      issueContent: "为什么大家都推荐用 Redux Toolkit？",
      scanNumber: 95,
      commentNumber: 19,
      issueStatus: true,
      issueDate: (Date.now() - 1000000).toString(),
      userId: "1",
      typeId: "t1",
    },
    {
      issueId: "i11",
      issueTitle: "什么是事件循环？",
      issueContent: "宏任务和微任务到底如何执行？",
      scanNumber: 300,
      commentNumber: 55,
      issueStatus: true,
      issueDate: (Date.now() - 1100000).toString(),
      userId: "1",
      typeId: "t2",
    },
    {
      issueId: "i12",
      issueTitle: "如何写一个优雅的登录页面？",
      issueContent: "UI/UX 方面有哪些注意事项？",
      scanNumber: 76,
      commentNumber: 14,
      issueStatus: true,
      issueDate: (Date.now() - 1200000).toString(),
      userId: "1",
      typeId: "t3",
    },
    {
      issueId: "i13",
      issueTitle: "React Router 的原理是什么？",
      issueContent: "它是如何实现单页应用跳转的？",
      scanNumber: 110,
      commentNumber: 20,
      issueStatus: true,
      issueDate: (Date.now() - 1300000).toString(),
      userId: "1",
      typeId: "t1",
    },
    {
      issueId: "i14",
      issueTitle: "Promise 和 async/await 区别？",
      issueContent: "async/await 只是语法糖吗？",
      scanNumber: 160,
      commentNumber: 30,
      issueStatus: true,
      issueDate: (Date.now() - 1400000).toString(),
      userId: "1",
      typeId: "t2",
    },
    {
      issueId: "i15",
      issueTitle: "如何设计一个好看的 Dashboard？",
      issueContent: "数据可视化有哪些设计原则？",
      scanNumber: 84,
      commentNumber: 11,
      issueStatus: true,
      issueDate: (Date.now() - 1500000).toString(),
      userId: "1",
      typeId: "t3",
    },
    {
      issueId: "i16",
      issueTitle: "React 中 key 的作用是什么？",
      issueContent: "为什么列表渲染必须加 key？",
      scanNumber: 140,
      commentNumber: 27,
      issueStatus: true,
      issueDate: (Date.now() - 1600000).toString(),
      userId: "1",
      typeId: "t1",
    },
  ],
  comments: [
    // i1
    { commentId: "c1", issueId: "i1", userId: "2", content: "父子通信：props；兄弟通信：提升 state 或 context。", date: (Date.now() - 90000).toString() },
    { commentId: "c2", issueId: "i1", userId: "1", content: "补充：复杂场景可以用 Redux / Zustand。", date: (Date.now() - 80000).toString() },

    // i6
    { commentId: "c3", issueId: "i6", userId: "2", content: "列表卡顿先看：key、虚拟列表、memo、useMemo。", date: (Date.now() - 50000).toString() },
    { commentId: "c4", issueId: "i6", userId: "1", content: "React Profiler + why-did-you-render 也很好用。", date: (Date.now() - 40000).toString() },

    // i7
    { commentId: "c5", issueId: "i7", userId: "2", content: "原型链：对象查找属性会沿着 [[Prototype]] 往上找。", date: (Date.now() - 30000).toString() },

    // i11
    { commentId: "c6", issueId: "i11", userId: "2", content: "事件循环重点：微任务优先于下一轮宏任务。", date: (Date.now() - 20000).toString() },
  ],

  interviewCategories: [
    {
      id: "c_html",
      title: "HTML",
      children: [
        { id: "c_html_basic", title: "基础", children: [] },
        { id: "c_html_semantic", title: "语义化", children: [] },
        { id: "c_html_seo", title: "SEO", children: [] },
      ],
    },
    {
      id: "c_css",
      title: "CSS",
      children: [
        { id: "c_css_layout", title: "布局", children: [] },
        { id: "c_css_bfc", title: "BFC/层叠", children: [] },
      ],
    },
    {
      id: "c_js",
      title: "JavaScript",
      children: [
        { id: "c_js_scope", title: "作用域/闭包", children: [] },
        { id: "c_js_async", title: "异步/事件循环", children: [] },
      ],
    },
  ],

  interviewQuestions: [
    {
      id: "q1",
      title: "HTML 中的文档声明是什么？有什么作用？",
      categoryId: "c_html_basic",
      content: `DOCTYPE（文档类型声明）用于告诉浏览器当前文档采用的 HTML 标准。
在 HTML5 中写法为：<!DOCTYPE html>

作用：
- 触发标准模式
- 避免浏览器进入怪异模式（Quirks Mode）
- 提高不同浏览器之间的渲染一致性`,
    },
    {
      id: "q2",
      title: "什么是严格模式与混杂模式？",
      categoryId: "c_html_basic",
      content: `浏览器渲染有两种模式：
1. 标准模式（Standards Mode）
2. 怪异模式（Quirks Mode）

DOCTYPE 是否正确决定是否进入标准模式。`,
    },
    {
      id: "q3",
      title: "请谈一谈 HTML 的语义化",
      categoryId: "c_html_semantic",
      content: `语义化是指使用更有意义的标签表达结构，例如：
<header> <nav> <main> <article> <section> <footer>

好处：
- 提高可读性
- 有利于 SEO
- 提高无障碍体验`,
    },
    {
      id: "q4",
      title: "请描述 SEO 中的 TDK？",
      categoryId: "c_html_seo",
      content: `TDK 通常指：
T - Title
D - Description
K - Keywords

其中 Title 和 Description 更重要。`,
    },
    {
      id: "q5",
      title: "什么是 BFC？",
      categoryId: "c_css_bfc",
      content: `BFC（Block Formatting Context）是块级格式化上下文。

触发条件：
- overflow 不为 visible
- position 为 absolute / fixed
- display 为 inline-block 等

作用：
- 防止 margin 重叠
- 清除浮动`,
    },
    {
      id: "q6",
      title: "什么是闭包？",
      categoryId: "c_js_scope",
      content: `闭包是函数能够访问其词法作用域中的变量，即使函数在作用域外执行。

常见应用：
- 私有变量
- 函数工厂
- 防抖节流`,
    },
    {
      id: "q7",
      title: "什么是事件循环？",
      categoryId: "c_js_async",
      content: `事件循环（Event Loop）是 JavaScript 处理异步任务的机制。

执行顺序：
1. 同步任务
2. 微任务（Promise）
3. 宏任务（setTimeout 等）`,
    },
  ],
  books: [
{
  bookId: "b1",
  bookTitle: "React Explained",
  typeId: "t1",
  description: "一本系统讲解 React 原理和实践的书，适合初学者到进阶开发者。",
  scanNumber: 120,
  commentNumber: 8,
  bookDate: "2021-05-10",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9781492051466-L.jpg"
},
{
  bookId: "b2",
  bookTitle: "Learning React",
  typeId: "t1",
  description: "通过实际案例学习 React 组件、Hooks 和状态管理。",
  scanNumber: 180,
  commentNumber: 12,
  bookDate: "2020-09-12",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9781492051725-L.jpg"
},
{
  bookId: "b3",
  bookTitle: "JavaScript: The Good Parts",
  typeId: "t2",
  description: "Douglas Crockford 经典著作，讲解 JavaScript 精华部分。",
  scanNumber: 350,
  commentNumber: 25,
  bookDate: "2008-05-15",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9780596517748-L.jpg"
},
{
  bookId: "b4",
  bookTitle: "The Pragmatic Programmer (20th Anniversary Edition)",
  typeId: "t2",
  description: "经典软件工程书，讲如何写出可维护、可演进的代码与职业习惯。",
  scanNumber: 290,
  commentNumber: 19,
  bookDate: "2019-09-13",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9780135957059-L.jpg"
},
{
  bookId: "b5",
  bookTitle: "Eloquent JavaScript",
  typeId: "t2",
  description: "一本非常适合入门的 JavaScript 书籍。",
  scanNumber: 410,
  commentNumber: 33,
  bookDate: "2018-12-04",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9781593279509-L.jpg"
},
{
  bookId: "b6",
  bookTitle: "CSS Secrets",
  typeId: "t3",
  description: "CSS 技巧大全，帮助你写出更优雅的样式。",
  scanNumber: 260,
  commentNumber: 15,
  bookDate: "2015-06-15",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9781449372637-L.jpg"
},
{
  bookId: "b7",
  bookTitle: "Designing Interfaces",
  typeId: "t3",
  description: "UI/UX 设计经典书籍。",
  scanNumber: 210,
  commentNumber: 11,
  bookDate: "2010-03-20",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9780596008031-L.jpg"
},
{
  bookId: "b8",
  bookTitle: "Clean Code",
  typeId: "t2",
  description: "从命名、函数、结构到测试，系统讲解如何写出“干净”的代码。",
  scanNumber: 330,
  commentNumber: 22,
  bookDate: "2008-08-01",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9780132350884-L.jpg"
},
{
  bookId: "b9",
  bookTitle: "Refactoring (2nd Edition)",
  typeId: "t3",
  description: "重构方法与案例合集，讲如何在不改变外部行为的情况下改进代码设计。",
  scanNumber: 170,
  commentNumber: 10,
  bookDate: "2018-11-30",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9780134757599-L.jpg"
},
{
  bookId: "b10",
  bookTitle: "JavaScript Patterns",
  typeId: "t2",
  description: "JavaScript 编程模式指南。",
  scanNumber: 190,
  commentNumber: 13,
  bookDate: "2010-09-09",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9780596806750-L.jpg"
},
{
  bookId: "b11",
  bookTitle: "HTML and CSS Design and Build Websites",
  typeId: "t3",
  description: "经典前端入门书籍。",
  scanNumber: 420,
  commentNumber: 29,
  bookDate: "2011-11-08",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9781118008188-L.jpg"
},
{
  bookId: "b12",
  bookTitle: "React in Action",
  typeId: "t1",
  description: "深入 React 组件、状态和性能优化。",
  scanNumber: 200,
  commentNumber: 14,
  bookDate: "2018-03-30",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9781617293856-L.jpg"
},
{
  bookId: "b13",
  bookTitle: "Secrets of the JavaScript Ninja",
  typeId: "t2",
  description: "高级 JavaScript 技术和实践。",
  scanNumber: 280,
  commentNumber: 20,
  bookDate: "2016-12-15",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9781617292859-L.jpg"
},
{
  bookId: "b14",
  bookTitle: "The Road to React",
  typeId: "t1",
  description: "React 入门到进阶教程。",
  scanNumber: 230,
  commentNumber: 16,
  bookDate: "2020-04-10",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9781720043997-L.jpg"
},
{
  bookId: "b15",
  bookTitle: "CSS in Depth",
  typeId: "t3",
  description: "深入理解 CSS 工作机制。",
  scanNumber: 160,
  commentNumber: 9,
  bookDate: "2019-01-10",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9781617293450-L.jpg"
},
{
  bookId: "b16",
  bookTitle: "Modern JavaScript for the Impatient",
  typeId: "t2",
  description: "快速掌握现代 JavaScript 特性。",
  scanNumber: 210,
  commentNumber: 13,
  bookDate: "2022-02-05",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9780136502142-L.jpg"
},
{
  bookId: "b17",
  bookTitle: "JavaScript & JQuery: Interactive Front-End Web Development",
  typeId: "t2",
  description: "经典前端入门书，通过大量实例讲解 JavaScript 与网页交互开发。",
  scanNumber: 140,
  commentNumber: 7,
  bookDate: "2014-06-30",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9781118871652-L.jpg"
},
{
  bookId: "b18",
  bookTitle: "Designing Data-Intensive Applications",
  typeId: "t3",
  description: "系统设计经典：可靠性、可扩展性、可维护性与数据系统取舍。",
  scanNumber: 170,
  commentNumber: 12,
  bookDate: "2017-03-16",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9781449373320-L.jpg"
},
{
  bookId: "b19",
  bookTitle: "Professional JavaScript for Web Developers",
  typeId: "t2",
  description: "JavaScript 权威指南之一。",
  scanNumber: 370,
  commentNumber: 31,
  bookDate: "2020-01-20",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9781119366447-L.jpg"
},
{
  bookId: "b20",
  bookTitle: "React Quickly",
  typeId: "t1",
  description: "快速掌握 React 开发。",
  scanNumber: 155,
  commentNumber: 10,
  bookDate: "2018-07-15",
  coverUrl: "https://covers.openlibrary.org/b/isbn/9781617293344-L.jpg"
}
],
bookComments: [
  { commentId: "bc1", bookId: "b1", userId: "2", content: "React 初学者很适合这本书。", date: (Date.now()-90000).toString() },
  { commentId: "bc2", bookId: "b1", userId: "1", content: "Hooks 讲解非常清楚。", date: (Date.now()-80000).toString() },

  { commentId: "bc3", bookId: "b2", userId: "2", content: "useEffect 的部分解释很好。", date: (Date.now()-70000).toString() },
  { commentId: "bc4", bookId: "b2", userId: "1", content: "React 进阶推荐阅读。", date: (Date.now()-60000).toString() },

  { commentId: "bc5", bookId: "b3", userId: "2", content: "性能优化案例不错。", date: (Date.now()-50000).toString() },

  { commentId: "bc6", bookId: "b4", userId: "1", content: "Router 讲得很系统。", date: (Date.now()-40000).toString() },

  { commentId: "bc7", bookId: "b5", userId: "2", content: "Redux Toolkit 很实用。", date: (Date.now()-30000).toString() },

  { commentId: "bc8", bookId: "b6", userId: "1", content: "JS 入门推荐。", date: (Date.now()-20000).toString() },
  { commentId: "bc9", bookId: "b6", userId: "2", content: "基础讲得非常详细。", date: (Date.now()-15000).toString() },

  { commentId: "bc10", bookId: "b7", userId: "1", content: "闭包讲得很清楚。", date: (Date.now()-12000).toString() },

  { commentId: "bc11", bookId: "b8", userId: "2", content: "异步部分非常好。", date: (Date.now()-11000).toString() },
  { commentId: "bc12", bookId: "b8", userId: "1", content: "事件循环讲得很透。", date: (Date.now()-10000).toString() },

  { commentId: "bc13", bookId: "b9", userId: "2", content: "原型链解释很清晰。", date: (Date.now()-9000).toString() },

  { commentId: "bc14", bookId: "b10", userId: "1", content: "ES6 内容很实用。", date: (Date.now()-8000).toString() },

  { commentId: "bc15", bookId: "b11", userId: "2", content: "UI 设计入门很好。", date: (Date.now()-7000).toString() },

  { commentId: "bc16", bookId: "b12", userId: "1", content: "UX 设计思路不错。", date: (Date.now()-6000).toString() },

  { commentId: "bc17", bookId: "b13", userId: "2", content: "响应式设计讲得很实用。", date: (Date.now()-5000).toString() },

  { commentId: "bc18", bookId: "b14", userId: "1", content: "图表设计部分不错。", date: (Date.now()-4000).toString() },

  { commentId: "bc19", bookId: "b15", userId: "2", content: "交互设计案例很好。", date: (Date.now()-3000).toString() },

  { commentId: "bc20", bookId: "b16", userId: "1", content: "前端工程化值得学习。", date: (Date.now()-2000).toString() },

  { commentId: "bc21", bookId: "b17", userId: "2", content: "架构思路很好。", date: (Date.now()-1800).toString() },

  { commentId: "bc22", bookId: "b18", userId: "1", content: "React 项目案例不错。", date: (Date.now()-1600).toString() },

  { commentId: "bc23", bookId: "b19", userId: "2", content: "面试复习很好用。", date: (Date.now()-1400).toString() },

  { commentId: "bc24", bookId: "b20", userId: "1", content: "设计系统讲解不错。", date: (Date.now()-1200).toString() },

  { commentId: "bc25", bookId: "b3", userId: "2", content: "优化策略很多。", date: (Date.now()-1000).toString() },
  { commentId: "bc26", bookId: "b7", userId: "1", content: "作用域解释很好。", date: (Date.now()-900).toString() },
  { commentId: "bc27", bookId: "b14", userId: "2", content: "可视化设计案例不错。", date: (Date.now()-800).toString() },
  { commentId: "bc28", bookId: "b18", userId: "1", content: "React 项目很完整。", date: (Date.now()-700).toString() },
  { commentId: "bc29", bookId: "b19", userId: "2", content: "JS 面试题很全。", date: (Date.now()-600).toString() },
  { commentId: "bc30", bookId: "b20", userId: "1", content: "组件库设计思路很好。", date: (Date.now()-500).toString() },
],
};
