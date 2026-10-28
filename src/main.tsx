import '@fontsource-variable/inter';
import '@fontsource-variable/nunito';
import './_app/ui/global.css';
import './i18n';
import { initMonitoring, reloadForNewBuild } from '_shared/lib/monitoring';
import { createRoot } from 'react-dom/client';
import App from './App';

initMonitoring();

// Browser translation (Chrome "Translate this page", Google Translate) swaps
// React's text nodes for its own <font> wrappers; React then throws on the
// next re-render/navigation when it removes or inserts next to a node that's
// no longer where it left it (facebook/react#11538). Make both operations
// tolerant instead of crashing the app.
const { removeChild, insertBefore } = Node.prototype;
Node.prototype.removeChild = function <T extends Node>(
  this: Node,
  child: T
): T {
  if (child.parentNode !== this) return child;
  return removeChild.call(this, child) as T;
};
Node.prototype.insertBefore = function <T extends Node>(
  this: Node,
  node: T,
  ref: Node | null
): T {
  if (ref && ref.parentNode !== this) return this.appendChild(node);
  return insertBefore.call(this, node, ref) as T;
};

// Vite emits this when a lazily-loaded chunk's dependencies 404 (stale tab
// after a deploy).
window.addEventListener('vite:preloadError', (event) => {
  if (reloadForNewBuild()) event.preventDefault();
});

createRoot(document.getElementById('root')!).render(<App />);
