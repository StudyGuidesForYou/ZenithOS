import { APPS } from './apps';
import { isImageName, extOf } from './fs';

export const APP_LIST = Object.values(APPS);

export const matchApps = (query) => {
  const q = (query || '').trim().toLowerCase();
  if (!q) return APP_LIST;
  return APP_LIST.filter((a) => a.name.toLowerCase().includes(q) || a.id.includes(q));
};

export const matchFiles = (files, query, limit = 6) => {
  const q = (query || '').trim().toLowerCase();
  const list = q
    ? files.filter((f) => f.name.toLowerCase().includes(q) || f.path.toLowerCase().includes(q))
    : files.slice(0, 4);
  return list.slice(0, limit);
};

export const targetForFile = (file) =>
  isImageName(file.name)
    ? { appId: 'photos', payload: { path: file.path } }
    : { appId: 'notepad', payload: { path: file.path } };

export const fileKind = (name) => extOf(name).toUpperCase() || 'FILE';