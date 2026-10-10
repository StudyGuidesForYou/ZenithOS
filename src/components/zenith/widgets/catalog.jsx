import ClockWidget from './ClockWidget';
import CalendarWidget from './CalendarWidget';
import SystemWidget from './SystemWidget';
import QuickNoteWidget from './QuickNoteWidget';
import FilesWidget from './FilesWidget';
import PhotoWidget from './PhotoWidget';
import WeatherWidget from './WeatherWidget';
import MusicWidget from './MusicWidget';
import CPUWidget from './CPUWidget';
import WorldClockWidget from './WorldClockWidget';
import StopwatchWidget from './StopwatchWidget';
import QuoteWidget from './QuoteWidget';
import StickyWidget from './StickyWidget';

export const WIDGETS = [
  { id: 'clock', name: 'Clock', hint: 'Date and time', Component: ClockWidget },
  { id: 'system', name: 'System', hint: 'Storage, battery, uptime', Component: SystemWidget },
  { id: 'calendar', name: 'Calendar', hint: 'Current month', Component: CalendarWidget },
  { id: 'quicknote', name: 'Quick Note', hint: 'Saves into Documents', Component: QuickNoteWidget },
  { id: 'files', name: 'Recent Files', hint: 'Your latest documents', Component: FilesWidget },
  { id: 'photo', name: 'Photos', hint: 'Latest picture', Component: PhotoWidget },
  { id: 'weather', name: 'Weather', hint: 'Live local forecast', Component: WeatherWidget },
  { id: 'music', name: 'Now Playing', hint: 'Animated visualizer', Component: MusicWidget },
  { id: 'cpu', name: 'System Monitor', hint: 'CPU & memory graph', Component: CPUWidget },
  { id: 'worldclock', name: 'World Clock', hint: 'Four time zones', Component: WorldClockWidget },
  { id: 'stopwatch', name: 'Stopwatch', hint: 'Count up timer', Component: StopwatchWidget },
  { id: 'quote', name: 'Quote', hint: 'A daily spark', Component: QuoteWidget },
  { id: 'sticky', name: 'Sticky Note', hint: 'Coloured reminder', Component: StickyWidget },
];

export const widgetById = (id) => WIDGETS.find((w) => w.id === id);