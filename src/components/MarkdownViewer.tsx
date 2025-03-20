"use client";

import { useState, useEffect } from 'react';
import { BytemdViewer } from './bytemd/viewer';
import matter from 'gray-matter';
import { Toast } from './Toast';
// 导入主题样式
import 'juejin-markdown-themes/dist/juejin.css';
import 'juejin-markdown-themes/dist/github.css';

const themes = [
  { label: 'GitHub', value: 'juejin-theme-github' },
  { label: '掘金', value: 'juejin-theme-default' }
] as const;

interface MarkdownViewerProps {
  files: Array<{
    name: string;
    content: string;
  }>;
}

export function MarkdownViewer({ files }: MarkdownViewerProps) {
  const [selectedFile, setSelectedFile] = useState(files[0]?.content || '');
  const [frontmatterData, setFrontmatterData] = useState<any>(null);
  const [currentTheme, setCurrentTheme] = useState<string>(themes[0].value);
  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState('');
  const [key, setKey] = useState(0); // 用于强制刷新 BytemdViewer

  const parseFrontmatter = (content: string) => {
    try {
      const { data, content: markdownContent } = matter(content);
      setSelectedFile(markdownContent);
      return data;
    } catch (error) {
      console.error('Failed to parse frontmatter:', error);
      return null;
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    const content = files.find(file => file.name === event.target.value)?.content || '';
    setFrontmatterData(parseFrontmatter(content));
  };

  // 初始化时解析第一个文件的 frontmatter
  useEffect(() => {
    if (files[0]?.content) {
      setFrontmatterData(parseFrontmatter(files[0].content));
    }
  }, [files]);

  const handleThemeChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newTheme = e.target.value;
    setCurrentTheme(newTheme);
    setShowToast(true);
    setToastMessage(`已切换到${themes.find(t => t.value === newTheme)?.label}主题`);
    setKey(prev => prev + 1); // 强制刷新 BytemdViewer
  };

  return (
    <div className="grid grid-cols-[1fr_300px] gap-4">
      <div className="flex flex-col gap-4">
        <div className="flex items-center gap-2">
          <select 
            onChange={handleFileChange}
            className="px-4 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
          >
            {files.map((file) => (
              <option key={file.name} value={file.name}>
                {file.name}
              </option>
            ))}
          </select>
          
          <select
            value={currentTheme}
            onChange={handleThemeChange}
            className="px-4 py-2 border rounded-md bg-white dark:bg-gray-800 dark:border-gray-700"
          >
            {themes.map((theme) => (
              <option key={theme.value} value={theme.value}>
                {theme.label}
              </option>
            ))}
          </select>
        </div>
        <div className={`border rounded-lg p-4 dark:border-gray-700 markdown-body ${currentTheme}`}>
          <BytemdViewer key={key} body={selectedFile} />
        </div>
      </div>
      <div className="border rounded-lg p-4 dark:border-gray-700">
        <h2 className="text-lg font-semibold mb-4">Frontmatter</h2>
        <pre className="text-sm whitespace-pre-wrap">
          {JSON.stringify(frontmatterData, null, 2)}
        </pre>
      </div>
      {showToast && (
        <Toast 
          message={toastMessage} 
          onClose={() => setShowToast(false)} 
        />
      )}
    </div>
  );
} 