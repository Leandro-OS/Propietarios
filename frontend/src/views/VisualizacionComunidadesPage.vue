<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-6xl mx-auto">
      <div class="bg-white rounded-lg shadow-md p-4 mb-4">
        <h1 class="text-2xl font-bold text-gray-800">Visualización de Comunidades de Propietarios</h1>
      </div>

      <!-- Lista de Comunidades -->
      <div v-if="viewState === 'list'" class="bg-white rounded-lg shadow-md p-6">
        <div v-if="comunidades.length === 0" class="text-center py-8">
          <p class="text-gray-500 text-lg">NO EXISTEN COMUNIDADES DE PROPIETARIOS</p>
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
        <VisualPropietariosList
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
import type { Comunidad, Propietario } from '../types';
import { getComunidades, getComunidadWithPropietarios } from '../services/api';
import VisualComunidadDetail from '../components/VisualComunidadDetail.vue';
import VisualPropietariosList from '../components/VisualPropietariosList.vue';
import VisualPropietarioDetail from '../components/VisualPropietarioDetail.vue';

type ViewState = 'list' | 'detail' | 'propietariosList' | 'propietarioDetail';

const viewState = ref<ViewState>('list');
const comunidades = ref<Comunidad[]>([]);
const selectedComunidad = ref<Comunidad | null>(null);
const selectedPropietario = ref<Propietario | null>(null);

onMounted(async () => {
  const data = await getComunidades(1, 1000);
  comunidades.value = data.comunidades;
});

const selectComunidad = async (id: number) => {
  selectedComunidad.value = await getComunidadWithPropietarios(id);
  viewState.value = 'detail';
};

const selectPropietario = (prop: Propietario) => {
  selectedPropietario.value = prop;
  viewState.value = 'propietarioDetail';
};
</script>
