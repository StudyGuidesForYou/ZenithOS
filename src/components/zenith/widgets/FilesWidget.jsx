import React from 'react';
import { FileText, Image as ImageIcon } from 'lucide-react';
import { useOS } from '@/lib/zenith/osContext';
import { allFiles, isImageName } from '@/lib/zenith/fs';
import { targetForFile, fileKind } from '@/lib/zenith/search';

export default function FilesWidget() {
  const { fs, openApp } = useOS();
  const recent = allFiles(fs.nodes).slice(0, 4);

  return (
    <div className="space-y-1">
      {recent.map((file) => (
        <button
          key={file.path}
          type="button"
          onClick={() => {
            const target = targetForFile(file);
            openApp(target.appId, target.payload);
          }}
          className="z-hoverable flex w-full items-center gap-2.5 rounded-xl px-2 py-1.5 text-left"
        >
          {isImageName(file.name) ? (
            <ImageIcon className="h-3.5 w-3.5 shrink-0 text-fuchsia-300" />
          ) : (
            <FileText className="h-3.5 w-3.5 shrink-0 text-amber-300" />
          )}
          <span className="min-w-0 flex-1">
            <span className="block truncate text-[12px]">{file.name}</span>
            <span className="block truncate text-[10.5px] text-[hsl(var(--z-text-dim))]">
              {file.parent} · {fileKind(file.name)}
            </span>
          </span>
        </button>
      ))}
      {recent.length === 0 && (
        <p className="px-2 py-3 text-[11.5px] text-[hsl(var(--z-text-dim))]">No files yet.</p>
      )}
    </div>
  );
}