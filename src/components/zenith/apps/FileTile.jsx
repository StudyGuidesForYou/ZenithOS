import React from 'react';
import { Image as ImageIcon, FileText, Folder, Music } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { isImageName, extOf } from '@/lib/zenith/fs';

const TEXT_EXT = ['txt', 'md', 'json', 'log', 'js', 'css', 'html'];

export default function FileTile({ item, selected, view = 'grid', onOpen, onSelect, onContext }) {
  const isFolder = item.type === 'folder';
  const isImage = !isFolder && isImageName(item.name) && /^(https?:|data:)/.test(item.content || '');
  const ext = extOf(item.name);
  const isText = !isFolder && TEXT_EXT.includes(ext);

  if (view === 'list') {
    return (
      <button
        data-file={item.name}
        onDoubleClick={() => onOpen(item)}
        onClick={() => onSelect(item)}
        onContextMenu={(e) => {
          e.preventDefault();
          onSelect(item);
          onContext(e, item);
        }}
        className={`flex w-full items-center gap-3 rounded-xl px-3 py-2 text-left transition-colors ${
          selected ? 'z-accent-soft' : 'hover:bg-white/[0.07]'
        }`}
      >
        <ItemGlyph isFolder={isFolder} isImage={isImage} isText={isText} item={item} small />
        <span className="min-w-0 flex-1 truncate text-[12.5px]">{item.name}</span>
        <span className="hidden text-[11px] text-white/40 sm:block">
          {isFolder ? 'Folder' : ext.toUpperCase() || 'File'}
        </span>
        <span className="hidden w-[92px] text-right text-[11px] text-white/40 sm:block">
          {new Date(item.updated || Date.now()).toLocaleDateString()}
        </span>
      </button>
    );
  }

  return (
    <button
      data-file={item.name}
      onDoubleClick={() => onOpen(item)}
      onClick={() => onSelect(item)}
      onContextMenu={(e) => {
        e.preventDefault();
        onSelect(item);
        onContext(e, item);
      }}
      className={`group flex flex-col items-center gap-2 rounded-2xl border p-2.5 transition-colors ${
        selected ? 'z-accent-soft' : 'border-transparent hover:bg-white/[0.07]'
      }`}
    >
      <ItemGlyph isFolder={isFolder} isImage={isImage} isText={isText} item={item} />
      <span className="w-full truncate px-1 text-center text-[11.5px]">{item.name}</span>
    </button>
  );
}

function ItemGlyph({ isFolder, isImage, isText, item, small }) {
  if (isImage) {
    return (
      <Image
        src={item.content}
        alt={item.name}
        className={
          small
            ? 'h-8 w-8 shrink-0 rounded-lg object-cover'
            : 'h-[76px] w-full rounded-xl object-cover transition-transform duration-300 group-hover:scale-[1.03]'
        }
      />
    );
  }
  const size = small ? 'h-8 w-8 rounded-lg' : 'h-12 w-12 rounded-xl';
  const inner = small ? 'h-4 w-4' : 'h-5 w-5';
  const tone = isFolder
    ? 'from-sky-400 via-cyan-400 to-blue-600'
    : isText
      ? 'from-amber-300 via-orange-400 to-rose-500'
      : 'from-slate-400 via-slate-600 to-slate-800';
  const Icon = isFolder ? Folder : isText ? FileText : Music;
  return (
    <span className={`z-tile inline-flex shrink-0 items-center justify-center bg-gradient-to-br ${tone} ${size}`}>
      <Icon className={`${inner} text-white`} strokeWidth={1.9} />
    </span>
  );
}