import React from 'react';
import { Image as ImageIcon } from 'lucide-react';
import { Image } from '@/components/ui/image';
import { useOS } from '@/lib/zenith/osContext';
import { allFiles, isImageName, extOf } from '@/lib/zenith/fs';

export default function PhotoWidget() {
  const { fs, openApp } = useOS();
  const photo = allFiles(fs.nodes).find((f) => isImageName(f.name) && extOf(f.name) !== 'gif');
  const isUrl = Boolean(photo && /^https?:/.test(fs.read(photo.path)));

  return (
    <button
      type="button"
      onClick={() => photo && openApp('photos', { path: photo.path })}
      className="group block w-full text-left"
    >
      <span className="relative block h-[104px] w-full overflow-hidden rounded-xl border border-[hsl(var(--z-border))] bg-[hsl(var(--z-surface-soft))]">
        {photo && isUrl ? (
          <Image
            src={fs.read(photo.path)}
            alt={photo.name}
            fittingType="fill"
            className="h-full w-full transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <span className="flex h-full w-full items-center justify-center text-[hsl(var(--z-text-dim))]">
            <ImageIcon className="h-6 w-6" />
          </span>
        )}
      </span>
      <span className="mt-2 block truncate text-[11.5px]">{photo ? photo.name : 'No pictures yet'}</span>
    </button>
  );
}