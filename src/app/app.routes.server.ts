import { RenderMode, ServerRoute } from '@angular/ssr';

export const serverRoutes: ServerRoute[] = [
  {
    path: 'patients/:id/edit',
    renderMode: RenderMode.Server
  },
  {
    path: 'professionals/:id/edit',
    renderMode: RenderMode.Server
  },
  {
    path: 'professionals/:id/availability',
    renderMode: RenderMode.Server
  },
  {
    path: '**',
    renderMode: RenderMode.Prerender
  }
];