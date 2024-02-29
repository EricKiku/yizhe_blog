import { defineUserConfig } from "vuepress";
import theme from "./theme.js";

export default defineUserConfig({
  base: "/yizhe_blog/",

  lang: "zh-CN",
  title: "yizhe的博客",
  description: "yizhe",

  theme,

  // 和 PWA 一起启用
  // shouldPrefetch: false,
});
