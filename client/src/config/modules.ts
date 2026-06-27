import type { LucideIcon } from 'lucide-react';
import {
  AlignLeft,
  MousePointerClick,
  ChevronDownSquare,
  CheckSquare,
  CircleDot,
  SlidersHorizontal,
  Move,
  MousePointer2,
  Keyboard,
  CalendarDays,
  SquareStack,
  Table2,
  Upload,
  ShieldCheck,
  Webhook,
  Radio,
  ArrowDownWideNarrow,
  Boxes,
  Frame,
  Hash,
  Timer,
  Shuffle,
  RefreshCw,
  BellRing,
  Ghost,
  LoaderCircle,
  MessageSquareWarning,
  Info,
  Layers,
  ListOrdered,
  Search,
  ShoppingCart,
  Landmark,
  Users,
  Briefcase,
  ClipboardCheck,
  ToggleRight,
  ClipboardCopy,
  ListCollapse,
  AppWindow,
  GalleryHorizontalEnd,
  ListFilter,
  PenTool,
} from 'lucide-react';

export type ModuleCategory =
  | 'Form Controls'
  | 'Interactions'
  | 'Components'
  | 'Data & Network'
  | 'Advanced DOM'
  | 'Async Challenges'
  | 'Business Workflows';

export type Difficulty = 'beginner' | 'intermediate' | 'advanced';

export interface ModuleMeta {
  id: string;
  title: string;
  description: string;
  path: string;
  category: ModuleCategory;
  icon: LucideIcon;
  tags: string[];
  difficulty: Difficulty;
}

/**
 * Single source of truth for every practice module. Drives the sidebar,
 * the dashboard cards, the command palette, and route generation.
 */
export const MODULES: ModuleMeta[] = [
  // ---- Form Controls ----
  {
    id: 'inputs',
    title: 'Input Fields',
    description: 'Text, email, password, number, masked and validated inputs with live state.',
    path: '/modules/inputs',
    category: 'Form Controls',
    icon: AlignLeft,
    tags: ['input', 'text', 'validation', 'form'],
    difficulty: 'beginner',
  },
  {
    id: 'buttons',
    title: 'Buttons',
    description: 'Click, double-click, right-click, disabled, loading and toggle buttons.',
    path: '/modules/buttons',
    category: 'Form Controls',
    icon: MousePointerClick,
    tags: ['button', 'click', 'submit'],
    difficulty: 'beginner',
  },
  {
    id: 'dropdowns',
    title: 'Dropdowns & Selects',
    description: 'Native selects, custom listboxes, multi-select and dependent dropdowns.',
    path: '/modules/dropdowns',
    category: 'Form Controls',
    icon: ChevronDownSquare,
    tags: ['select', 'dropdown', 'option', 'listbox'],
    difficulty: 'intermediate',
  },
  {
    id: 'checkboxes',
    title: 'Checkboxes',
    description: 'Single, grouped and indeterminate checkboxes with select-all logic.',
    path: '/modules/checkboxes',
    category: 'Form Controls',
    icon: CheckSquare,
    tags: ['checkbox', 'group', 'indeterminate'],
    difficulty: 'beginner',
  },
  {
    id: 'radios',
    title: 'Radio Buttons',
    description: 'Radio groups, controlled selection and conditional reveal.',
    path: '/modules/radios',
    category: 'Form Controls',
    icon: CircleDot,
    tags: ['radio', 'group', 'choice'],
    difficulty: 'beginner',
  },
  {
    id: 'sliders',
    title: 'Sliders & Range',
    description: 'Single and range sliders, steps and keyboard-accessible thumbs.',
    path: '/modules/sliders',
    category: 'Form Controls',
    icon: SlidersHorizontal,
    tags: ['slider', 'range', 'input'],
    difficulty: 'intermediate',
  },
  {
    id: 'date-picker',
    title: 'Date & Time Picker',
    description: 'Calendar selection, ranges, native date inputs and constraints.',
    path: '/modules/date-picker',
    category: 'Form Controls',
    icon: CalendarDays,
    tags: ['date', 'calendar', 'time'],
    difficulty: 'intermediate',
  },
  {
    id: 'forms',
    title: 'Form & Validation',
    description: 'A registration form with live field validation, password rules and a gated submit.',
    path: '/modules/forms',
    category: 'Form Controls',
    icon: ClipboardCheck,
    tags: ['form', 'validation', 'required', 'submit'],
    difficulty: 'intermediate',
  },
  {
    id: 'switches',
    title: 'Toggle Switches',
    description: 'Independent and dependent switches, a master toggle and a disabled control.',
    path: '/modules/switches',
    category: 'Form Controls',
    icon: ToggleRight,
    tags: ['switch', 'toggle', 'state'],
    difficulty: 'beginner',
  },

  // ---- Interactions ----
  {
    id: 'drag-drop',
    title: 'Drag & Drop',
    description: 'Sortable lists, kanban columns and drop zones powered by dnd-kit.',
    path: '/modules/drag-drop',
    category: 'Interactions',
    icon: Move,
    tags: ['drag', 'drop', 'sortable', 'kanban'],
    difficulty: 'advanced',
  },
  {
    id: 'mouse-actions',
    title: 'Mouse Actions',
    description: 'Hover, double-click, right-click menus, and click-and-hold tracking.',
    path: '/modules/mouse-actions',
    category: 'Interactions',
    icon: MousePointer2,
    tags: ['mouse', 'hover', 'context menu'],
    difficulty: 'intermediate',
  },
  {
    id: 'keyboard',
    title: 'Keyboard Actions',
    description: 'Key capture, shortcuts, and key-combination detection.',
    path: '/modules/keyboard',
    category: 'Interactions',
    icon: Keyboard,
    tags: ['keyboard', 'shortcut', 'keypress'],
    difficulty: 'intermediate',
  },
  {
    id: 'clipboard',
    title: 'Clipboard',
    description: 'Copy text and tokens to the clipboard and capture pasted content.',
    path: '/modules/clipboard',
    category: 'Interactions',
    icon: ClipboardCopy,
    tags: ['clipboard', 'copy', 'paste'],
    difficulty: 'intermediate',
  },

  // ---- Components ----
  {
    id: 'modals',
    title: 'Modals & Dialogs',
    description: 'Confirm dialogs, nested modals, drawers and focus trapping.',
    path: '/modules/modals',
    category: 'Components',
    icon: SquareStack,
    tags: ['modal', 'dialog', 'drawer'],
    difficulty: 'intermediate',
  },
  {
    id: 'accordion',
    title: 'Accordion',
    description: 'Single-open FAQ and multi-open panels to expand, collapse and assert.',
    path: '/modules/accordion',
    category: 'Components',
    icon: ListCollapse,
    tags: ['accordion', 'collapse', 'expand', 'faq'],
    difficulty: 'beginner',
  },
  {
    id: 'tabs',
    title: 'Tabs',
    description: 'A tabbed panel where only the active tab’s content is visible.',
    path: '/modules/tabs',
    category: 'Components',
    icon: AppWindow,
    tags: ['tabs', 'tabpanel', 'switch'],
    difficulty: 'beginner',
  },
  {
    id: 'pagination',
    title: 'Pagination',
    description: 'Paged list with prev/next, numbered pages and a page-size selector.',
    path: '/modules/pagination',
    category: 'Components',
    icon: GalleryHorizontalEnd,
    tags: ['pagination', 'pager', 'pages'],
    difficulty: 'intermediate',
  },
  {
    id: 'tables',
    title: 'Data Tables',
    description: 'Sorting, pagination, filtering, row selection and inline edit.',
    path: '/modules/tables',
    category: 'Data & Network',
    icon: Table2,
    tags: ['table', 'grid', 'pagination', 'sort'],
    difficulty: 'advanced',
  },
  {
    id: 'file-upload',
    title: 'File Upload',
    description: 'Drag-to-upload, progress, validation and server persistence.',
    path: '/modules/file-upload',
    category: 'Data & Network',
    icon: Upload,
    tags: ['upload', 'file', 'dropzone'],
    difficulty: 'intermediate',
  },
  {
    id: 'auth-demo',
    title: 'Authentication',
    description: 'Login, register and protected content backed by real JWT auth.',
    path: '/modules/auth-demo',
    category: 'Data & Network',
    icon: ShieldCheck,
    tags: ['auth', 'login', 'jwt', 'session'],
    difficulty: 'intermediate',
  },
  {
    id: 'api-testing',
    title: 'API Console',
    description: 'Send live requests to the playground API and inspect responses.',
    path: '/modules/api-testing',
    category: 'Data & Network',
    icon: Webhook,
    tags: ['api', 'rest', 'http', 'request'],
    difficulty: 'advanced',
  },
  {
    id: 'websocket',
    title: 'WebSocket Live',
    description: 'Real-time chat, counters and presence over Socket.IO.',
    path: '/modules/websocket',
    category: 'Data & Network',
    icon: Radio,
    tags: ['websocket', 'realtime', 'socket'],
    difficulty: 'advanced',
  },
  {
    id: 'infinite-scroll',
    title: 'Infinite Scroll',
    description: 'Intersection-observer driven lazy loading and virtualization.',
    path: '/modules/infinite-scroll',
    category: 'Data & Network',
    icon: ArrowDownWideNarrow,
    tags: ['scroll', 'lazy', 'pagination'],
    difficulty: 'advanced',
  },
  {
    id: 'search-filter',
    title: 'Search & Filter',
    description: 'Debounced search, category filter, sorting and a live result count.',
    path: '/modules/search-filter',
    category: 'Data & Network',
    icon: ListFilter,
    tags: ['search', 'filter', 'sort', 'list'],
    difficulty: 'intermediate',
  },

  // ---- Advanced DOM ----
  {
    id: 'shadow-dom',
    title: 'Shadow DOM',
    description: 'Encapsulated web components that require shadow-root piercing.',
    path: '/modules/shadow-dom',
    category: 'Advanced DOM',
    icon: Boxes,
    tags: ['shadow dom', 'web component', 'encapsulation'],
    difficulty: 'advanced',
  },
  {
    id: 'iframes',
    title: 'iFrames',
    description: 'Same-origin frame switching, nested frames and cross-frame forms.',
    path: '/modules/iframes',
    category: 'Advanced DOM',
    icon: Frame,
    tags: ['iframe', 'frame', 'embedded'],
    difficulty: 'advanced',
  },
  {
    id: 'canvas',
    title: 'Canvas',
    description: 'An HTML canvas with no inner DOM — click to plot points and assert on coordinates.',
    path: '/modules/canvas',
    category: 'Advanced DOM',
    icon: PenTool,
    tags: ['canvas', 'coordinates', 'draw'],
    difficulty: 'advanced',
  },

  // ---- Async Challenges ----
  {
    id: 'dynamic-ids',
    title: 'Dynamic IDs',
    description: 'Elements whose IDs regenerate on every render to defeat brittle locators.',
    path: '/challenges/dynamic-ids',
    category: 'Async Challenges',
    icon: Hash,
    tags: ['dynamic', 'locator', 'id'],
    difficulty: 'advanced',
  },
  {
    id: 'delayed-loading',
    title: 'Delayed Loading',
    description: 'Content that appears after randomized delays to practice waits.',
    path: '/challenges/delayed-loading',
    category: 'Async Challenges',
    icon: Timer,
    tags: ['wait', 'delay', 'async'],
    difficulty: 'intermediate',
  },
  {
    id: 'random-elements',
    title: 'Random Elements',
    description: 'Randomly positioned and ordered elements that change each load.',
    path: '/challenges/random-elements',
    category: 'Async Challenges',
    icon: Shuffle,
    tags: ['random', 'flaky', 'order'],
    difficulty: 'advanced',
  },
  {
    id: 'ajax',
    title: 'AJAX Data',
    description: 'Deferred fetches that update the DOM after the request resolves.',
    path: '/challenges/ajax',
    category: 'Async Challenges',
    icon: RefreshCw,
    tags: ['ajax', 'fetch', 'async'],
    difficulty: 'intermediate',
  },
  {
    id: 'toasts',
    title: 'Toast Notifications',
    description: 'Transient toasts that auto-dismiss to test ephemeral assertions.',
    path: '/challenges/toasts',
    category: 'Async Challenges',
    icon: BellRing,
    tags: ['toast', 'notification', 'transient'],
    difficulty: 'beginner',
  },
  {
    id: 'stale-elements',
    title: 'Stale Elements',
    description: 'Nodes that detach and re-render to reproduce stale-reference errors.',
    path: '/challenges/stale-elements',
    category: 'Async Challenges',
    icon: Ghost,
    tags: ['stale', 'rerender', 'detached'],
    difficulty: 'advanced',
  },
  {
    id: 'spinners',
    title: 'Loading Spinners',
    description: 'Blocking and inline spinners that gate content visibility.',
    path: '/challenges/spinners',
    category: 'Async Challenges',
    icon: LoaderCircle,
    tags: ['spinner', 'loading', 'wait'],
    difficulty: 'beginner',
  },
  {
    id: 'alerts',
    title: 'Alerts & Popups',
    description: 'Native alert, confirm and prompt dialogs plus custom popups.',
    path: '/challenges/alerts',
    category: 'Async Challenges',
    icon: MessageSquareWarning,
    tags: ['alert', 'confirm', 'prompt'],
    difficulty: 'beginner',
  },
  {
    id: 'tooltips',
    title: 'Tooltips & Hovers',
    description: 'Hover-triggered tooltips and reveal-on-hover content.',
    path: '/challenges/tooltips',
    category: 'Async Challenges',
    icon: Info,
    tags: ['tooltip', 'hover', 'reveal'],
    difficulty: 'intermediate',
  },
  {
    id: 'wizard',
    title: 'Multi-step Wizard',
    description: 'A guarded multi-step form with validation between steps.',
    path: '/challenges/wizard',
    category: 'Async Challenges',
    icon: ListOrdered,
    tags: ['wizard', 'stepper', 'form'],
    difficulty: 'intermediate',
  },
  {
    id: 'autocomplete',
    title: 'Autocomplete',
    description: 'Debounced async suggestions and keyboard navigation.',
    path: '/challenges/autocomplete',
    category: 'Async Challenges',
    icon: Search,
    tags: ['autocomplete', 'typeahead', 'suggest'],
    difficulty: 'advanced',
  },
  {
    id: 'nested-frames',
    title: 'Nested Frames',
    description: 'Frames within frames for deep frame-switching practice.',
    path: '/challenges/nested-frames',
    category: 'Advanced DOM',
    icon: Layers,
    tags: ['iframe', 'nested', 'frame'],
    difficulty: 'advanced',
  },

  // ---- Business Workflows ----
  {
    id: 'ecommerce',
    title: 'E-commerce Flow',
    description: 'Browse products, manage a cart and complete a mock checkout.',
    path: '/workflows/ecommerce',
    category: 'Business Workflows',
    icon: ShoppingCart,
    tags: ['ecommerce', 'cart', 'checkout', 'workflow'],
    difficulty: 'advanced',
  },
  {
    id: 'banking',
    title: 'Banking Portal',
    description: 'Accounts, transfers and transaction history with validation.',
    path: '/workflows/banking',
    category: 'Business Workflows',
    icon: Landmark,
    tags: ['banking', 'transfer', 'workflow'],
    difficulty: 'advanced',
  },
  {
    id: 'crm',
    title: 'CRM Customers',
    description: 'Search, create, edit and delete customers against the live API.',
    path: '/workflows/crm',
    category: 'Business Workflows',
    icon: Users,
    tags: ['crm', 'customers', 'crud', 'workflow'],
    difficulty: 'advanced',
  },
  {
    id: 'employees',
    title: 'Employee Management',
    description: 'Directory, filters and CRUD over the employee API.',
    path: '/workflows/employees',
    category: 'Business Workflows',
    icon: Briefcase,
    tags: ['hr', 'employees', 'crud', 'workflow'],
    difficulty: 'advanced',
  },
];

export const MODULE_CATEGORIES: ModuleCategory[] = [
  'Form Controls',
  'Interactions',
  'Components',
  'Data & Network',
  'Advanced DOM',
  'Async Challenges',
  'Business Workflows',
];

export function getModulesByCategory(category: ModuleCategory): ModuleMeta[] {
  return MODULES.filter((m) => m.category === category);
}

export function searchModules(query: string): ModuleMeta[] {
  const q = query.trim().toLowerCase();
  if (!q) return MODULES;
  return MODULES.filter(
    (m) =>
      m.title.toLowerCase().includes(q) ||
      m.description.toLowerCase().includes(q) ||
      m.tags.some((t) => t.includes(q)),
  );
}

/** One-line summary shown on each category landing page. */
export const CATEGORY_DESCRIPTIONS: Record<ModuleCategory, string> = {
  'Form Controls': 'Inputs, buttons, selects, checkboxes and the core building blocks of every form.',
  Interactions: 'Mouse, keyboard, drag-and-drop and pointer-driven behaviours.',
  Components: 'Composite widgets like modals, tables, sliders and date pickers.',
  'Data & Network': 'API calls, file uploads, websockets and live streaming data.',
  'Advanced DOM': 'Shadow DOM, iframes, nested frames and other tricky structures.',
  'Async Challenges': 'Timing, dynamic ids, stale elements and deliberately flaky scenarios.',
  'Business Workflows': 'End-to-end, multi-step journeys across realistic applications.',
};

export type ModuleSection = 'modules' | 'challenges' | 'workflows';

/** Stable URL slug for a category (e.g. "Data & Network" -> "data-and-network"). */
export function categorySlug(category: ModuleCategory): string {
  return category
    .toLowerCase()
    .replace(/&/g, 'and')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

const SLUG_TO_CATEGORY = new Map(
  MODULE_CATEGORIES.map((category) => [categorySlug(category), category] as const),
);

export function getCategoryBySlug(slug: string): ModuleCategory | undefined {
  return SLUG_TO_CATEGORY.get(slug);
}

/** Which top-level section a category lives under, based on its module paths. */
export function categorySection(category: ModuleCategory): ModuleSection {
  const prefix = getModulesByCategory(category)[0]?.path.split('/')[1];
  if (prefix === 'challenges') return 'challenges';
  if (prefix === 'workflows') return 'workflows';
  return 'modules';
}

export function getCategoriesBySection(section: ModuleSection): ModuleCategory[] {
  return MODULE_CATEGORIES.filter((category) => categorySection(category) === section);
}

/** Find a module by its route path (e.g. "/modules/buttons"). */
export function getModuleByPath(path: string): ModuleMeta | undefined {
  return MODULES.find((m) => m.path === path);
}

/**
 * Previous/next module relative to the given route path, following the order
 * modules are declared in {@link MODULES}. Returns `undefined` for either side
 * when the current module is at the start/end of the list.
 */
export function getAdjacentModules(path: string): {
  prev?: ModuleMeta;
  next?: ModuleMeta;
} {
  const index = MODULES.findIndex((m) => m.path === path);
  if (index === -1) return {};
  return {
    prev: index > 0 ? MODULES[index - 1] : undefined,
    next: index < MODULES.length - 1 ? MODULES[index + 1] : undefined,
  };
}
