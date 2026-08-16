<template>
  <div>
    <div class="bg-gray-100 rounded-lg p-4 mb-4">
      <h2 class="text-xl font-bold text-gray-800">Listado incidencias de {{ propietario.nombre }}</h2>
      <p class="text-sm text-gray-600 mt-1">{{ propietario.comunidad }} - ID: {{ propietario.id }}</p>
    </div>
    <div class="flex gap-2 mb-4">
      <button @click="openCreateForm" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-4 rounded-lg transition">+ CREAR INCIDENCIA</button>
      <button @click="$emit('back')" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">VOLVER A LISTADO</button>
    </div>
    <div v-if="loading" class="text-center py-8"><p class="text-blue-600 font-semibold">CARGANDO INCIDENCIAS...</p></div>
    <div v-else-if="incidencias.length === 0 && !showCreateForm && !showEvolutionForm && !showEvolutionList" class="text-center py-8">
      <p class="text-gray-500 text-lg">NO EXISTEN INCIDENCIAS PARA ESTE PROPIETARIO</p>
    </div>
    <div v-else-if="!showCreateForm && !showEvolutionForm && !showEvolutionList" class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="border p-3 text-left font-bold text-gray-700">TIPO</th>
            <th class="border p-3 text-left font-bold text-gray-700">SUBTIPO</th>
            <th class="border p-3 text-left font-bold text-gray-700">DESCRIPCION</th>
            <th class="border p-3 text-left font-bold text-gray-700">ESTADO</th>
            <th class="border p-3 text-left font-bold text-gray-700">FECHA CREACION</th>
            <th class="border p-3 text-left font-bold text-gray-700">FECHA MOD.</th>
            <th class="border p-3 text-center font-bold text-gray-700">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="inc in paginatedIncidencias" :key="inc.idIncidencia" class="hover:bg-blue-50 cursor-pointer transition">
            <td class="border p-3">{{ inc.tipoIncidencia }}</td>
            <td class="border p-3">{{ inc.subtipoIncidencia || '-' }}</td>
            <td class="border p-3">{{ inc.descripcion }}</td>
            <td class="border p-3"><span :class="getEstadoClass(inc.estado)">{{ inc.estado }}</span></td>
            <td class="border p-3">{{ formatDate(inc.fechaCreacion) }}</td>
            <td class="border p-3">{{ formatDate(inc.fechaModificacion) }}</td>
            <td class="border p-3 text-center">
              <button @click="viewDetalle(inc)" class="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-1 px-3 rounded text-sm transition mr-1">DETALLE</button>
              <button @click="viewEvolucion(inc)" :disabled="inc.estado === 'Registrada'" :class="inc.estado === 'Registrada' ? 'bg-gray-300 text-gray-500 cursor-not-allowed font-semibold py-1 px-3 rounded text-sm' : 'bg-orange-500 hover:bg-orange-600 text-white font-semibold py-1 px-3 rounded text-sm transition'">EVO</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-between items-center mt-4">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">← ANTERIOR</button>
        <span class="text-gray-700 font-medium">Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">SIGUIENTE →</button>
      </div>
    </div>
    <!-- Vista Evolucion (Listado de registros) -->
    <div v-else-if="showEvolutionList" class="overflow-x-auto">
      <div class="bg-gray-100 rounded-lg p-4 mb-4">
        <h2 class="text-xl font-bold text-gray-800">Evolución de Incidencia #{{ evolutionIncidencia?.idIncidencia }}</h2>
        <p class="text-sm text-gray-600 mt-1">{{ evolutionIncidencia?.tipoIncidencia }} - {{ evolutionIncidencia?.descripcion }}</p>
      </div>
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="border p-3 text-left font-bold text-gray-700">TIPO</th>
            <th class="border p-3 text-left font-bold text-gray-700">SUBTIPO</th>
            <th class="border p-3 text-left font-bold text-gray-700">ESTADO</th>
            <th class="border p-3 text-left font-bold text-gray-700">DESCRIPCION</th>
            <th class="border p-3 text-left font-bold text-gray-700">FECHA CREACION</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="reg in evolutionRegistros" :key="reg.idIncProReg" class="hover:bg-blue-50 transition">
            <td class="border p-3">{{ reg.tipoIncidencia }}</td>
            <td class="border p-3">{{ reg.subtipoIncidencia || '-' }}</td>
            <td class="border p-3"><span :class="getEstadoClass(reg.estado)">{{ reg.estado }}</span></td>
            <td class="border p-3">{{ reg.descripcionEstado || '' }}</td>
            <td class="border p-3">{{ formatDate(reg.fechaCreacion) }}</td>
          </tr>
          <tr v-if="evolutionRegistros.length === 0">
            <td colspan="5" class="text-center py-4 text-gray-500">No hay registros de evolución para esta incidencia</td>
          </tr>
        </tbody>
      </table>
      <!-- Paginacion Evolucion -->
      <div class="flex justify-between items-center mt-4">
        <button @click="changeEvolPage(evolutionPage - 1)" :disabled="evolutionPage === 1" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">← ANTERIOR</button>
        <span class="text-gray-700 font-medium">Página {{ evolutionPage }} de {{ totalEvolPages }}</span>
        <button @click="changeEvolPage(evolutionPage + 1)" :disabled="evolutionPage === totalEvolPages" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">SIGUIENTE →</button>
      </div>
      <button @click="closeEvolution" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition mt-4">ATRÁS</button>
    </div>
    <!-- Create Form -->
    <div v-if="showCreateForm" class="mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-bold mb-4 text-blue-800">Creación Incidencia Propietario</h3>
        <form @submit.prevent="handleCreate" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo Incidencia</label>
            <select v-model="createForm.tipoIncidencia" @change="onTipoChange" required class="w-full border border-gray-300 rounded px-3 py-2">
              <option value="">SELECCIONE UN TIPO</option>
              <option v-for="tipo in TIPOS_INCIDENCIA" :key="tipo" :value="tipo">{{ tipo }}</option>
            </select>
          </div>
          <div v-if="createForm.tipoIncidencia">
            <label class="block text-sm font-medium text-gray-700 mb-1">Subtipo Incidencia</label>
            <select v-model="createForm.subtipoIncidencia" :required="createForm.tipoIncidencia !== 'Catastrofe'" class="w-full border border-gray-300 rounded px-3 py-2">
              <option value="">SELECCIONE UN SUBTIPO</option>
              <option v-for="sub in currentSubtipos" :key="sub" :value="sub">{{ sub }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
            <textarea v-model="createForm.descripcion" required maxlength="200" rows="3" class="w-full border border-gray-300 rounded px-3 py-2"></textarea>
            <span class="text-xs text-gray-500">{{ createForm.descripcion.length }}/200</span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select v-model="createForm.estado" required class="w-full border border-gray-300 rounded px-3 py-2">
              <option value="Registrada">Registrada</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripcion Estado</label>
            <textarea v-model="createForm.descripcionEstado" required maxlength="200" rows="2" class="w-full border border-gray-300 rounded px-3 py-2"></textarea>
            <span class="text-xs text-gray-500">{{ createForm.descripcionEstado.length }}/200</span>
          </div>
          <div class="flex gap-3 pt-4">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition flex-1">CREAR</button>
            <button type="button" @click="showCreateForm = false" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition flex-1">CANCELAR</button>
          </div>
        </form>
      </div>
    </div>
    <!-- Evolution Form -->
    <div v-if="showEvolutionForm" class="mb-6">
      <div class="bg-white rounded-lg shadow p-6">
        <h3 class="text-lg font-bold mb-4 text-blue-800">Evolucionar Incidencia</h3>
        <form @submit.prevent="handleEvolution" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo Incidencia</label>
            <div class="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-600">{{ evolutionForm.tipoIncidencia }}</div>
          </div>
          <div v-if="evolutionForm.tipoIncidencia">
            <label class="block text-sm font-medium text-gray-700 mb-1">Subtipo Incidencia</label>
            <div class="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-600">{{ evolutionForm.subtipoIncidencia || '-' }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
            <div class="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-600" style="min-height: 60px;">{{ evolutionForm.descripcion }}</div>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select v-model="evolutionForm.estado" required class="w-full border border-gray-300 rounded px-3 py-2">
              <option v-for="estado in allowedEvolutionStates" :key="estado" :value="estado">{{ estado }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripcion Estado</label>
            <textarea v-model="evolutionForm.descripcionEstado" required maxlength="200" rows="2" class="w-full border border-gray-300 rounded px-3 py-2"></textarea>
            <span class="text-xs text-gray-500">{{ evolutionForm.descripcionEstado.length }}/200</span>
          </div>
          <div class="flex gap-3 pt-4">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition flex-1">ACTUALIZAR</button>
            <button type="button" @click="showEvolutionForm = false" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition flex-1">CANCELAR</button>
          </div>
        </form>
      </div>
    </div>
    <!-- Detail Modal -->
    <div v-if="showDetailModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl">
        <h3 class="text-lg font-bold mb-4 text-blue-800">Detalle Incidencia #{{ selectedIncidencia?.idIncidencia }}</h3>
        <div class="space-y-2 text-sm">
          <p><strong>Tipo:</strong> {{ selectedIncidencia?.tipoIncidencia }}</p>
          <p><strong>Subtipo:</strong> {{ selectedIncidencia?.subtipoIncidencia || '-' }}</p>
          <p><strong>Descripcion:</strong> {{ selectedIncidencia?.descripcion }}</p>
          <p><strong>Estado:</strong> <span :class="getEstadoClass(selectedIncidencia?.estado || '')">{{ selectedIncidencia?.estado }}</span></p>
          <p><strong>Descripcion Estado:</strong> {{ selectedIncidencia?.descripcionEstado || '-' }}</p>
          <p><strong>Fecha Creación:</strong> {{ formatDate(selectedIncidencia?.fechaCreacion) }}</p>
          <p><strong>Fecha Modificación:</strong> {{ formatDate(selectedIncidencia?.fechaModificacion) }}</p>
          <p v-if="selectedIncidencia?.fechaCierre"><strong>Fecha Cierre:</strong> {{ formatDate(selectedIncidencia.fechaCierre) }}</p>
        </div>
        <div class="flex gap-3 mt-6">
          <button @click="evolucionarIncidencia" :disabled="selectedIncidencia?.estado === 'Cerrada'" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition flex-1 disabled:bg-gray-400 disabled:cursor-not-allowed">EVOLUCIONAR</button>
          <button @click="showDetailModal = false" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition flex-1">CERRAR</button>
        </div>
      </div>
    </div>
    <!-- Error Modal -->
    <div v-if="showErrorModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <p class="text-red-600 font-semibold mb-4">{{ errorMessage }}</p>
        <button @click="showErrorModal = false" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg w-full">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch } from 'vue';
import type { PropietarioIncidenciaCount, IncidenciaPropietarioTitulo, IncidenciaPropietarioRegistros } from '../types';
import { getIncidenciasByPropietario, createIncidenciaPropietario, updateIncidenciaPropietario, getEvolucionIncidenciaPropietario } from '../services/api';
import { TIPOS_INCIDENCIA, SUBTIPOS_MANTENIMIENTO, SUBTIPOS_DESPERFECTO, SUBTIPOS_CATASTROFE, SUBTIPOS_CONVIVENCIA } from '../types';

const props = defineProps<{
  propietarioId: number;
  propietario: PropietarioIncidenciaCount;
}>();

defineEmits<{ back: []; }>();

const incidencias = ref<IncidenciaPropietarioTitulo[]>([]);
const loading = ref(false);
const currentPage = ref(1);
const perPage = 10;
const totalPages = computed(() => Math.ceil(incidencias.value.length / perPage) || 1);
const paginatedIncidencias = computed(() => {
  const start = (currentPage.value - 1) * perPage;
  return incidencias.value.slice(start, start + perPage);
});

const showCreateForm = ref(false);
const showEvolutionForm = ref(false);
const showDetailModal = ref(false);
const showErrorModal = ref(false);
const errorMessage = ref('');
const selectedIncidencia = ref<IncidenciaPropietarioTitulo | null>(null);

// Evolution list state
const showEvolutionList = ref(false);
const evolutionIncidencia = ref<IncidenciaPropietarioTitulo | null>(null);
const evolutionRegistros = ref<IncidenciaPropietarioRegistros[]>([]);
const evolutionPage = ref(1);
const evolutionPageSize = 10;
const totalEvolPages = ref(1);

const createForm = ref({ tipoIncidencia: '', subtipoIncidencia: '', descripcion: '', estado: 'Registrada', descripcionEstado: '' });
const evolutionForm = ref({ tipoIncidencia: '', subtipoIncidencia: '', descripcion: '', estado: '', descripcionEstado: '' });
const currentSubtipos = ref<string[]>([]);
const evolutionSubtipos = ref<string[]>([]);

function onTipoChange() {
  createForm.value.subtipoIncidencia = '';
  switch (createForm.value.tipoIncidencia) {
    case 'Mantenimiento': currentSubtipos.value = SUBTIPOS_MANTENIMIENTO; break;
    case 'Desperfecto': currentSubtipos.value = SUBTIPOS_DESPERFECTO; break;
    case 'Catastrofe': currentSubtipos.value = SUBTIPOS_CATASTROFE; break;
    case 'Convivencia': currentSubtipos.value = SUBTIPOS_CONVIVENCIA; break;
    default: currentSubtipos.value = [];
  }
}

function onEvolutionTipoChange() {
  evolutionForm.value.subtipoIncidencia = '';
  switch (evolutionForm.value.tipoIncidencia) {
    case 'Mantenimiento': evolutionSubtipos.value = SUBTIPOS_MANTENIMIENTO; break;
    case 'Desperfecto': evolutionSubtipos.value = SUBTIPOS_DESPERFECTO; break;
    case 'Catastrofe': evolutionSubtipos.value = SUBTIPOS_CATASTROFE; break;
    case 'Convivencia': evolutionSubtipos.value = SUBTIPOS_CONVIVENCIA; break;
    default: evolutionSubtipos.value = [];
  }
}

const flujo: Record<string, string[]> = {
  'Registrada': ['Abierta'],
  'Abierta': ['En proceso', 'Bloqueada'],
  'En proceso': ['En ejecucion', 'Bloqueada'],
  'En ejecucion': ['Resuelta', 'Bloqueada'],
  'Bloqueada': ['En ejecucion', 'Resuelta'],
  'Resuelta': ['Cerrada'],
  'Cerrada': []
};

const allowedEvolutionStates = computed(() => {
  if (!selectedIncidencia.value) return [];
  return flujo[selectedIncidencia.value.estado] || [];
});

function formatDate(date: string | null): string {
  if (!date) return '-';
  return new Date(date).toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric', hour: '2-digit', minute: '2-digit' });
}

function getEstadoClass(estado: string): string {
  const map: Record<string, string> = {
    'Registrada': 'bg-yellow-100 text-yellow-800 px-2 py-1 rounded text-xs font-semibold',
    'Abierta': 'bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-semibold',
    'En proceso': 'bg-orange-100 text-orange-800 px-2 py-1 rounded text-xs font-semibold',
    'En ejecucion': 'bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-semibold',
    'Bloqueada': 'bg-gray-200 text-gray-800 px-2 py-1 rounded text-xs font-semibold',
    'Resuelta': 'bg-green-100 text-green-800 px-2 py-1 rounded text-xs font-semibold',
    'Cerrada': 'bg-purple-100 text-purple-800 px-2 py-1 rounded text-xs font-semibold'
  };
  return map[estado] || 'px-2 py-1 rounded text-xs';
}

function changePage(page: number) {
  if (page >= 1 && page <= totalPages.value) currentPage.value = page;
}

// Evolution list functions
function viewEvolucion(inc: IncidenciaPropietarioTitulo) {
  evolutionIncidencia.value = inc;
  evolutionPage.value = 1;
  loadEvolution(inc.idIncidencia);
}

async function loadEvolution(idIncidencia: number) {
  try {
    const data = await getEvolucionIncidenciaPropietario(idIncidencia, evolutionPage.value, evolutionPageSize);
    evolutionRegistros.value = data.registros;
    totalEvolPages.value = data.pagination.totalPages;
    showEvolutionList.value = true;
  } catch (e) {
    console.error('Error cargando evolución:', e);
  }
}

function closeEvolution() {
  showEvolutionList.value = false;
  evolutionIncidencia.value = null;
  evolutionRegistros.value = [];
  evolutionPage.value = 1;
}

function changeEvolPage(page: number) {
  if (page >= 1 && page <= totalEvolPages.value) {
    evolutionPage.value = page;
    if (evolutionIncidencia.value) {
      loadEvolution(evolutionIncidencia.value.idIncidencia);
    }
  }
}

function openCreateForm() {
  showCreateForm.value = true;
  showEvolutionForm.value = false;
  createForm.value = { tipoIncidencia: '', subtipoIncidencia: '', descripcion: '', estado: 'Registrada', descripcionEstado: '' };
  currentSubtipos.value = [];
}

function viewDetalle(inc: IncidenciaPropietarioTitulo) {
  selectedIncidencia.value = inc;
  showDetailModal.value = true;
}

function evolucionarIncidencia() {
  if (!selectedIncidencia.value) return;
  showDetailModal.value = false;
  showEvolutionForm.value = true;
  showCreateForm.value = false;
  evolutionForm.value = {
    tipoIncidencia: selectedIncidencia.value.tipoIncidencia,
    subtipoIncidencia: selectedIncidencia.value.subtipoIncidencia || '',
    descripcion: selectedIncidencia.value.descripcion,
    estado: allowedEvolutionStates.value[0] || '',
    descripcionEstado: ''
  };
}

async function handleCreate() {
  try {
    await createIncidenciaPropietario({
      idPro: props.propietarioId,
      tipoIncidencia: createForm.value.tipoIncidencia,
      subtipoIncidencia: createForm.value.subtipoIncidencia || null,
      descripcion: createForm.value.descripcion,
      estado: createForm.value.estado,
      descripcionEstado: createForm.value.descripcionEstado || null
    });
    showCreateForm.value = false;
    await loadIncidencias();
  } catch (e) {
    console.error('Error:', e);
    errorMessage.value = 'ERROR AL CREAR LA INCIDENCIA';
    showErrorModal.value = true;
  }
}

async function handleEvolution() {
  if (!selectedIncidencia.value) return;
  try {
    await updateIncidenciaPropietario(selectedIncidencia.value.idIncidencia, {
      estado: evolutionForm.value.estado,
      descripcionEstado: evolutionForm.value.descripcionEstado || null
    });
    showEvolutionForm.value = false;
    selectedIncidencia.value = null;
    await loadIncidencias();
  } catch (e: any) {
    console.error('Error:', e);
    errorMessage.value = e.error || 'ERROR AL EVOLUCIONAR LA INCIDENCIA';
    showErrorModal.value = true;
  }
}

async function loadIncidencias() {
  loading.value = true;
  try {
    const data = await getIncidenciasByPropietario(props.propietarioId);
    incidencias.value = data.incidencias;
    currentPage.value = 1;
  } catch (e) {
    console.error('Error:', e);
    errorMessage.value = 'ERROR AL CARGAR LAS INCIDENCIAS';
    showErrorModal.value = true;
  } finally {
    loading.value = false;
  }
}

watch(() => props.propietarioId, () => loadIncidencias());
loadIncidencias();
</script>

<style scoped>
.border { border-color: #d1d5db; }
</style>
