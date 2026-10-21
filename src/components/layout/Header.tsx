import { useWatchStore } from '../../store/useWatchStore';
import { useUiStore } from '../../store/useUiStore';
import { copyShareLink } from '../summary/Dialogs';
import { Icon } from '../ui/Icon';

export function Header() {
  const savedCount = useWatchStore((s) => s.savedDesigns.length);
  const reset = useWatchStore((s) => s.reset);
  const open = useUiStore((s) => s.open);
  const notify = useUiStore((s) => s.notify);

  return (
    <header className="relative z-30 flex h-14 items-center justify-between border-b border-line bg-canvas/90 px-4 backdrop-blur sm:h-16 sm:px-7">
      <a href="./" className="flex items-baseline gap-2.5" aria-label="Cadran Atelier">
        <span className="font-display text-[22px] font-semibold tracking-[0.16em] sm:text-2xl">CADRAN</span>
        <span className="hidden text-[10px] uppercase tracking-[0.32em] text-muted sm:inline">Atelier · Watch Builder</span>
      </a>
      <div className="flex items-center gap-2">
        <button
          className="icon-btn"
          onClick={() => {
            reset();
            notify('Configuración restablecida');
          }}
          aria-label="Reiniciar"
          title="Reiniciar"
        >
          <Icon name="reset" size={17} />
        </button>
        <button className="icon-btn" onClick={copyShareLink} aria-label="Compartir enlace" title="Compartir enlace">
          <Icon name="share" size={17} />
        </button>
        <button className="btn btn-ghost h-10 px-4" onClick={() => open('saved')}>
          <Icon name="bookmark" size={16} />
          <span className="hidden sm:inline">Mis diseños</span>
          {savedCount > 0 && <span className="grid min-w-5 place-items-center rounded-full bg-ink px-1.5 text-[10px] text-surface">{savedCount}</span>}
        </button>
      </div>
    </header>
  );
}
