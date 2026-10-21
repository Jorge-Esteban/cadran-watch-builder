import { Configurator } from './components/configurator/Configurator';
import { Header } from './components/layout/Header';
import { PreviewStage } from './components/preview/PreviewStage';
import { QuoteModal, SaveModal, SavedDesignsDrawer, Toast } from './components/summary/Dialogs';
import { MobileSummaryBar, SummaryPanel } from './components/summary/Summary';
import { WatchSvgDefs } from './components/watch/WatchSvgDefs';

// Layout:
//  · ≥1024px  → dos columnas: escenario grande | barra lateral (pestañas, panel, resumen)
//  · <1024px  → escenario fijo arriba, panel desplazable debajo y barra de precio inferior
export default function App() {
  return (
    <div className="flex min-h-dvh flex-col lg:h-dvh lg:overflow-hidden">
      <WatchSvgDefs />
      <Header />
      <main className="flex flex-1 flex-col lg:grid lg:min-h-0 lg:grid-cols-[minmax(0,1fr)_440px] xl:grid-cols-[minmax(0,1fr)_480px]">
        <section className="sticky top-0 z-10 h-[44dvh] shrink-0 border-b border-line sm:h-[52dvh] lg:static lg:h-auto lg:border-b-0" aria-label="Previsualización">
          <PreviewStage />
        </section>
        <aside className="flex flex-col bg-canvas pb-28 lg:min-h-0 lg:border-l lg:border-line lg:pb-0">
          <Configurator />
          <SummaryPanel />
        </aside>
      </main>
      <MobileSummaryBar />
      <QuoteModal />
      <SaveModal />
      <SavedDesignsDrawer />
      <Toast />
    </div>
  );
}
