<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-4 mb-4">
        <h1 class="text-2xl font-bold text-gray-800">Histórico de Comunidades de Propietarios</h1>
      </div>

      <!-- Lista de Comunidades -->
      <div v-if="viewState === 'list'" class="bg-white rounded-lg shadow-md p-6">
        <div v-if="comunidades.length === 0" class="text-center py-8">
          <p class="text-gray-500 text-lg">NO EXISTEN COMUNIDADES EN EL HISTÓRICO</p>
        </div>
        <div v-else>
          <table class="w-full border-collapse">
            <thead>
              <tr class="bg-gray-200">
                <th class="border p-3 text-left font-bold text-gray-700">ID</th>
                <th class="border p-3 text-left font-bold text-gray-700">COMUNIDAD PROPIETARIOS</th>
                <th class="border p-3 text-left font-bold text-gray-700">POBLACIÓN</th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="comunidad in comunidades"
                :key="comunidad.id"
                @click="selectComunidad(comunidad.id)"
                class="hover:bg-blue-50 cursor-pointer transition"
              >
                <td class="border p-3">{{ comunidad.id }}</td>
                <td class="border p-3">{{ comunidad.via }} {{ comunidad.direccion }} {{ comunidad.numero }}</td>
                <td class="border p-3">{{ comunidad.poblacion }}</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>

      <!-- Detalle de Comunidad -->
      <div v-if="viewState === 'detail' && selectedComunidad" class="bg-white rounded-lg shadow-md p-6">
        <VisualComunidadDetail
          :comunidad="selectedComunidad"
          @viewPropietarios="viewState = 'propietariosList'"
          @cancel="viewState = 'list'"
        />
      </div>

      <!-- Lista de Propietarios -->
      <div v-if="viewState === 'propietariosList' && selectedComunidad" class="bg-white rounded-lg shadow-md p-6">
        <HistoricoPropietariosList
          :comunidad-id="selectedComunidad.id"
          @select="selectPropietario"
          @back="viewState = 'detail'"
        />
      </div>

      <!-- Detalle de Propietario -->
      <div v-if="viewState === 'propietarioDetail' && selectedPropietario" class="bg-white rounded-lg shadow-md p-6">
        <VisualPropietarioDetail
          :propietario="selectedPropietario"
          @back="viewState = 'propietariosList'"
        />
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { ComunidadHistorico, PropietarioHistorico } from '../types';
import { getComunidadesHistoricas } from '../services/api';
import VisualComunidadDetail from '../components/VisualComunidadDetail.vue';
import HistoricoPropietariosList from '../components/HistoricoPropietariosList.vue';
import VisualPropietarioDetail from '../components/VisualPropietarioDetail.vue';

type ViewState = 'list' | 'detail' | 'propietariosList' | 'propietarioDetail';

const viewState = ref<ViewState>('list');
const comunidades = ref<ComunidadHistorico[]>([]);
const selectedComunidad = ref<ComunidadHistorico | null>(null);
const selectedPropietario = ref<PropietarioHistorico | null>(null);

onMounted(async () => {
  comunidades.value = await getComunidadesHistoricas();
});

const selectComunidad = async (id: number) => {
  selectedComunidad.value = comunidades.value.find(c => c.id === id) || null;
  viewState.value = 'detail';
};

const selectPropietario = (prop: PropietarioHistorico) => {
  selectedPropietario.value = prop;
  viewState.value = 'propietarioDetail';
};
</script>
