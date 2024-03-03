import { navbar } from "vuepress-theme-hope";

export default navbar([
  {
    text: "博客",
    icon: "boke",
    link: "/",
    activeMatch: "^/",
  },
  {
    text: "工具",
    link: "/tools/",
    activeMatch: "^/tools/",
  },
]);
