"use client";

import * as React from "react";

import { Viewer } from "@bytemd/react";

import { plugins, sanitize } from "./config";

interface BytemdViewerProps {
  body: string;
  // 可选的插件列表，如果不传则使用默认配置的插件
  plugins?: any[];
  // 可选的插件效果回调
  pluginViewerEffect?: (data: any) => void;
}

export const BytemdViewer = ({ 
  body, 
  plugins: customPlugins, 
  pluginViewerEffect 
}: BytemdViewerProps) => {
  console.log('BytemdViewer 组件渲染:', {
    bodyLength: body?.length,
    hasCustomPlugins: !!customPlugins,
    hasPluginEffect: !!pluginViewerEffect
  });

  // 使用 React.useMemo 优化插件处理
  const finalPlugins = React.useMemo(() => {
    console.log('处理插件配置:', {
      defaultPluginsCount: plugins.length,
      customPluginsCount: customPlugins?.length
    });
    return customPlugins || plugins;
  }, [customPlugins]);

  // 监听内容变化
  React.useEffect(() => {
    console.log('内容发生变化:', {
      newContentLength: body?.length,
      hasContent: !!body
    });

    if (pluginViewerEffect) {
      console.log('触发插件效果回调');
      pluginViewerEffect({ content: body });
    }
  }, [body, pluginViewerEffect]);
  
  return (
    <Viewer 
      value={body} 
      plugins={finalPlugins} 
      sanitize={sanitize}
      onChange={(v) => {
        console.log('Viewer 内容变化:', {
          newValueLength: v?.length,
          timestamp: new Date().toISOString()
        });
      }} 
    />
  );
};
