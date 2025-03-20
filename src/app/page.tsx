import { promises as fs } from 'fs';
import path from 'path';
import { MarkdownViewer } from '@/components/MarkdownViewer';

export default async function Home() {
  // 读取 docs 目录
  const docsDir = path.join(process.cwd(), 'src/docs');
  const files = await fs.readdir(docsDir);
  
  // 读取所有 markdown 文件的内容
  const markdownFiles = await Promise.all(
    files
      .filter(file => file.endsWith('.md') || file.endsWith('.mdx'))
      .map(async (file) => {
        const content = await fs.readFile(path.join(docsDir, file), 'utf8');
        return {
          name: file,
          content,
        };
      })
  );

  return (
    <div className="min-h-screen p-8">
      <MarkdownViewer files={markdownFiles} />
    </div>
  );
}
