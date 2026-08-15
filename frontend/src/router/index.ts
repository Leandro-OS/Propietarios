import { createRouter, createWebHistory } from 'vue-router';
import HomePage from '../views/HomePage.vue';
import GestionComunidadesPage from '../views/GestionComunidadesPage.vue';
import VisualizacionComunidadesPage from '../views/VisualizacionComunidadesPage.vue';
import HistoricoPage from '../views/HistoricoPage.vue';
import BusquedaPage from '../views/BusquedaPage.vue';
import GestionIncidenciasPage from '../views/GestionIncidenciasPage.vue';

const routes = [
  { path: '/', component: HomePage },
  { path: '/gestion', component: GestionComunidadesPage },
  { path: '/visualizacion', component: VisualizacionComunidadesPage },
  { path: '/historico', component: HistoricoPage },
  { path: '/busqueda', component: BusquedaPage },
  { path: '/incidencias', component: GestionIncidenciasPage }
];

const router = createRouter({
  history: createWebHistory(),
  routes
});

export default router;
