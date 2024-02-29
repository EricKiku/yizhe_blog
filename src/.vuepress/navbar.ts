import { navbar } from "vuepress-theme-hope";

export default navbar([
  {
    text: "主页",
    link: "/",
  },
  {
    text: "博客",
    icon: "boke",
    link: "/blog/",
    activeMatch: "^/blog",
  },
  // {
  //   text: "博文",
  //   icon: "boke",
  //   activeMatch: "^/posts",
  //   link: "/posts/",
  // },
  // {
  //   text: "V2 文档",
  //   icon: "book",
  //   link: "https://theme-hope.vuejs.press/zh/",
  // },
]);
