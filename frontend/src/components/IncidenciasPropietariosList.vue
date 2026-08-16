<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Listado de Propietarios</h2>
    <div v-if="propietarios.length === 0 && !loading" class="text-center py-8">
      <p class="text-gray-500 text-lg">NO EXISTEN PROPIETARIOS</p>
    </div>
    <div v-if="loading" class="text-center py-8">
      <p class="text-blue-600 font-semibold">CARGANDO...</p>
    </div>
    <div v-if="!loading" class="overflow-x-auto">
      <table class="w-full border-collapse">
        <thead>
          <tr class="bg-gray-200">
            <th class="border p-3 text-left font-bold text-gray-700">PROPIETARIO</th>
            <th class="border p-3 text-left font-bold text-gray-700">COMUNIDAD</th>
            <th class="border p-3 text-center font-bold text-gray-700">ACTIVAS</th>
            <th class="border p-3 text-center font-bold text-gray-700">BLOQUEADAS</th>
            <th class="border p-3 text-center font-bold text-gray-700">CERRADAS</th>
            <th class="border p-3 text-center font-bold text-gray-700">ACCIONES</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="p in propietarios" :key="p.id" @click="viewIncidencias(p)" class="hover:bg-blue-50 cursor-pointer transition">
            <td class="border p-3">{{ p.nombre }}</td>
            <td class="border p-3">{{ p.comunidad }}</td>
            <td class="border p-3 text-center"><span :class="getBadgeClass(p.activas, 'activa')">{{ p.activas }}</span></td>
            <td class="border p-3 text-center"><span :class="getBadgeClass(p.bloqueadas, 'bloqueada')">{{ p.bloqueadas }}</span></td>
            <td class="border p-3 text-center"><span :class="getBadgeClass(p.cerradas, 'cerrada')">{{ p.cerradas }}</span></td>
            <td class="border p-3 text-center">
              <button @click.stop="openCreateForm(p)" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-1 px-3 rounded text-sm transition" title="Crear incidencia">＋</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="flex justify-between items-center mt-4">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">← ANTERIOR</button>
        <span class="text-gray-700 font-medium">Página {{ currentPage }} de {{ totalPages }}</span>
        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">SIGUIENTE →</button>
      </div>
      <div class="flex justify-center mt-6">
        <button @click="goBack" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition">ATRÁS</button>
      </div>
    </div>
    <div v-if="showCreateModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-lg w-full mx-4 shadow-xl max-h-screen overflow-y-auto">
        <h3 class="text-lg font-bold mb-4 text-blue-800">Creación Incidencia Propietario</h3>
        <p class="text-sm text-gray-600 mb-4">Propietario: {{ selectedPropietario?.nombre }}</p>
        <form @submit.prevent="handleCreateIncidencia" class="space-y-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Tipo Incidencia</label>
            <select v-model="form.tipoIncidencia" @change="onTipoChange" required class="w-full border border-gray-300 rounded px-3 py-2">
              <option value="">SELECCIONE UN TIPO</option>
              <option v-for="tipo in TIPOS_INCIDENCIA" :key="tipo" :value="tipo">{{ tipo }}</option>
            </select>
          </div>
          <div v-if="form.tipoIncidencia">
            <label class="block text-sm font-medium text-gray-700 mb-1">Subtipo Incidencia</label>
            <select v-model="form.subtipoIncidencia" :required="form.tipoIncidencia !== 'Catastrofe'" class="w-full border border-gray-300 rounded px-3 py-2">
              <option value="">SELECCIONE UN SUBTIPO</option>
              <option v-for="sub in currentSubtipos" :key="sub" :value="sub">{{ sub }}</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
            <textarea v-model="form.descripcion" required maxlength="200" rows="3" class="w-full border border-gray-300 rounded px-3 py-2"></textarea>
            <span class="text-xs text-gray-500">{{ form.descripcion.length }}/200</span>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
            <select v-model="form.estado" required class="w-full border border-gray-300 rounded px-3 py-2">
              <option value="Registrada">Registrada</option>
            </select>
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Descripcion Estado</label>
            <textarea v-model="form.descripcionEstado" required maxlength="200" rows="2" class="w-full border border-gray-300 rounded px-3 py-2"></textarea>
            <span class="text-xs text-gray-500">{{ form.descripcionEstado.length }}/200</span>
          </div>
          <div class="flex gap-3 pt-4">
            <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition flex-1">CREAR</button>
            <button type="button" @click="showCreateModal = false" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition flex-1">CANCELAR</button>
          </div>
        </form>
      </div>
    </div>
    <div v-if="showModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
        <p class="text-red-600 font-semibold mb-4">{{ modalMessage }}</p>
        <button @click="showModal = false" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg w-full">OK</button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import type { PropietarioIncidenciaCount } from '../types';
import { getPropietariosConIncidencias, createIncidenciaPropietario } from '../services/api';
import { TIPOS_INCIDENCIA, SUBTIPOS_MANTENIMIENTO, SUBTIPOS_DESPERFECTO, SUBTIPOS_CATASTROFE, SUBTIPOS_CONVIVENCIA } from '../types';

const emit = defineEmits<{
  view: [propietario: PropietarioIncidenciaCount];
  back: [];
}>();

const router = useRouter();
const propietarios = ref<PropietarioIncidenciaCount[]>([]);
const currentPage = ref(1);
const totalPages = ref(1);
const loading = ref(false);
const showCreateModal = ref(false);
const showModal = ref(false);
const modalMessage = ref('');
const selectedPropietario = ref<PropietarioIncidenciaCount | null>(null);

const form = ref({
  tipoIncidencia: '',
  subtipoIncidencia: '',
  descripcion: '',
  estado: 'Registrada',
  descripcionEstado: ''
});

const currentSubtipos = ref<string[]>([]);

const onTipoChange = () => {
  form.value.subtipoIncidencia = '';
  switch (form.value.tipoIncidencia) {
    case 'Mantenimiento': currentSubtipos.value = SUBTIPOS_MANTENIMIENTO; break;
    case 'Desperfecto': currentSubtipos.value = SUBTIPOS_DESPERFECTO; break;
    case 'Catastrofe': currentSubtipos.value = SUBTIPOS_CATASTROFE; break;
    case 'Convivencia': currentSubtipos.value = SUBTIPOS_CONVIVENCIA; break;
    default: currentSubtipos.value = [];
  }
};

onMounted(async () => { await loadPropietarios(); });

const loadPropietarios = async () => {
  loading.value = true;
  try {
    const data = await getPropietariosConIncidencias(currentPage.value);
    propietarios.value = data.propietarios;
    totalPages.value = data.pagination.totalPages;
  } catch (error) {
    console.error('Error al cargar propietarios:', error);
    modalMessage.value = 'ERROR AL CARGAR LOS PROPIETARIOS';
    showModal.value = true;
  } finally { loading.value = false; }
};

const changePage = async (page: number) => { currentPage.value = page; await loadPropietarios(); };
const viewIncidencias = (propietario: PropietarioIncidenciaCount) => { emit('view', propietario); };

const openCreateForm = (propietario: PropietarioIncidenciaCount) => {
  selectedPropietario.value = propietario;
  showCreateModal.value = true;
  form.value = { tipoIncidencia: '', subtipoIncidencia: '', descripcion: '', estado: 'Registrada', descripcionEstado: '' };
  currentSubtipos.value = [];
};

const handleCreateIncidencia = async () => {
  if (!selectedPropietario.value) return;
  try {
    await createIncidenciaPropietario({
      idPro: selectedPropietario.value.id,
      tipoIncidencia: form.value.tipoIncidencia,
      subtipoIncidencia: form.value.subtipoIncidencia || null,
      descripcion: form.value.descripcion,
      estado: form.value.estado,
      descripcionEstado: form.value.descripcionEstado || null
    });
    showCreateModal.value = false;
    await loadPropietarios();
  } catch (error) {
    console.error('Error al crear incidencia:', error);
    modalMessage.value = 'ERROR AL CREAR LA INCIDENCIA';
    showModal.value = true;
  }
};

const getBadgeClass = (count: number, type: 'activa' | 'bloqueada' | 'cerrada' = 'activa'): string => {
  if (count === 0) return 'text-gray-400';
  if (type === 'bloqueada') return 'text-orange-600 font-bold';
  if (type === 'cerrada') return 'text-gray-500';
  if (count <= 2) return 'text-yellow-600 font-bold';
  return 'text-red-600 font-bold';
};

const goBack = () => { router.push('/'); };
</script>

<style scoped>
.border { border-color: #d1d5db; }
</style>
