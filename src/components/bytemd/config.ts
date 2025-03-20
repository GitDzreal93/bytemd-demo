import breaks from "@bytemd/plugin-breaks";
import frontmatter from "@bytemd/plugin-frontmatter";
import gfm from "@bytemd/plugin-gfm";
import gfm_zhHans from "@bytemd/plugin-gfm/lib/locales/zh_Hans.json";
import highlightSSR from "@bytemd/plugin-highlight-ssr";
import mediumZoom from "@bytemd/plugin-medium-zoom";
import { type EditorProps } from "@bytemd/react";
import { merge } from "lodash-es";
import { common } from "lowlight";

// highlight需要额外扩充的高亮语言
import asciidoc from "highlight.js/lib/languages/asciidoc";
import dart from "highlight.js/lib/languages/dart";
import nginx from "highlight.js/lib/languages/nginx";

import { headingPlugin, prettyLinkPlugin } from "./plugins";

// 初始化插件并打印日志
console.log('开始初始化 ByteMD 插件配置');

// 配置所有插件
export const plugins = [
  // 处理换行符
  (() => {
    console.log('配置 breaks 插件');
    return breaks();
  })(),

  // frontmatter 解析
  (() => {
    console.log('配置 frontmatter 插件');
    return frontmatter();
  })(),

  // 图片缩放功能
  (() => {
    console.log('配置 mediumZoom 插件');
    return mediumZoom();
  })(),

  // GitHub Flavored Markdown 支持
  (() => {
    console.log('配置 GFM 插件，使用中文本地化');
    return gfm({ locale: gfm_zhHans });
  })(),

  // 代码高亮配置
  (() => {
    const languages = {
      ...common,
      dart,
      nginx,
      asciidoc,
    };
    console.log('配置代码高亮插件，已加载的语言:', Object.keys(languages));
    return highlightSSR({ languages });
  })(),

  // 自定义插件
  (() => {
    console.log('配置链接美化插件');
    return prettyLinkPlugin();
  })(),
  
  (() => {
    console.log('配置标题处理插件');
    return headingPlugin();
  })(),
];

console.log('插件配置完成，总计加载插件数:', plugins.length);

// 配置安全选项
export const sanitize: EditorProps["sanitize"] = (schema) => {
  console.log('配置 ByteMD 安全选项');
  
  const customerSchema = merge(schema, {
    tagNames: ["iframe"],
    attributes: {
      iframe: [
        "src",
        "style",
        "title",
        "all",
        "sandbox",
        "scrolling",
        "border",
        "frameborder",
        "framespacing",
        "allowfullscreen",
      ],
    },
  } as typeof schema);

  console.log('安全选项配置完成，允许的 iframe 属性:', 
    customerSchema.attributes.iframe);

  return customerSchema;
};
