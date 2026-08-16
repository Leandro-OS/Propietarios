<template>
  <div class="min-h-screen bg-gray-100 p-4">
    <div class="max-w-6xl mx-auto">
      <!-- Header -->
      <div class="bg-white rounded-lg shadow-md p-4 mb-4">
        <h1 class="text-2xl font-bold text-gray-800">Gestión de Incidencias</h1>
      </div>

      <!-- Tabs -->
      <div class="bg-white rounded-lg shadow-md p-6">
        <div class="flex gap-2 mb-6 border-b">
          <button
            @click="activeTab = 'dashboard'"
            :class="activeTab === 'dashboard' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            class="font-semibold py-2 px-6 rounded-t-lg transition"
          >
            DASHBOARD
          </button>
          <button
            @click="activeTab = 'comunidades'"
            :class="activeTab === 'comunidades' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            class="font-semibold py-2 px-6 rounded-t-lg transition"
          >
            COMUNIDADES
          </button>
          <button
            @click="activeTab = 'propietarios'"
            :class="activeTab === 'propietarios' ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'"
            class="font-semibold py-2 px-6 rounded-t-lg transition"
          >
            PROPIETARIOS
          </button>
        </div>

        <!-- Tab Content: Dashboard -->
        <div v-if="activeTab === 'dashboard'" class="py-4">
          <div class="text-center py-8 text-gray-500">
            <p class="text-lg">Panel principal de incidencias</p>
          </div>
        </div>

        <!-- Tab Content: Comunidades -->
        <div v-if="activeTab === 'comunidades'" class="py-4">
          <IncidenciasComunidadesList
            v-if="selectedComunidad === null"
            @view="onViewComunidad"
            @back="selectedComunidad = null"
          />
          <IncidenciasDetalleComunidad
            v-else
            :comunidad-id="selectedComunidad.id"
            :comunidad="selectedComunidad"
            @back="selectedComunidad = null"
          />
        </div>

        <!-- Tab Content: Propietarios -->
        <div v-if="activeTab === 'propietarios'" class="py-4">
          <IncidenciasPropietariosList
            v-if="selectedPropietario === null"
            @view="onViewPropietario"
            @back="selectedPropietario = null"
          />
          <IncidenciasDetallePropietario
            v-else
            :propietario-id="selectedPropietario.id"
            :propietario="selectedPropietario"
            @back="selectedPropietario = null"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { ComunidadIncidenciaCount, PropietarioIncidenciaCount } from '../types';
import IncidenciasComunidadesList from '../components/IncidenciasComunidadesList.vue';
import IncidenciasDetalleComunidad from '../components/IncidenciasDetalleComunidad.vue';
import IncidenciasPropietariosList from '../components/IncidenciasPropietariosList.vue';
import IncidenciasDetallePropietario from '../components/IncidenciasDetallePropietario.vue';

const activeTab = ref<'dashboard' | 'comunidades' | 'propietarios'>('dashboard');
const selectedComunidad = ref<ComunidadIncidenciaCount | null>(null);
const selectedPropietario = ref<PropietarioIncidenciaCount | null>(null);

const onViewComunidad = (comunidad: ComunidadIncidenciaCount) => {
  selectedComunidad.value = comunidad;
};

const onViewPropietario = (propietario: PropietarioIncidenciaCount) => {
  selectedPropietario.value = propietario;
};
</script>
