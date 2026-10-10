import React from 'react';
import Files from './Files';
import Notepad from './Notepad';
import Terminal from './Terminal';
import Photos from './Photos';
import Canvas from './Canvas';
import Calculator from './Calculator';
import Settings from './Settings';
import Chat from './Chat';

const MAP = {
  files: Files,
  notepad: Notepad,
  terminal: Terminal,
  photos: Photos,
  canvas: Canvas,
  calculator: Calculator,
  settings: Settings,
  chat: Chat,
};

export default function AppView({ win }) {
  const App = MAP[win.appId];
  if (!App) {
    return <div className="flex h-full items-center justify-center text-sm opacity-60">App not installed.</div>;
  }
  return <App payload={win.payload} windowId={win.id} maximized={win.maximized} />;
}