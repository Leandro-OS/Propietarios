<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Detalle del Propietario</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Nombre:</span>
        <p class="font-medium">{{ propietario.nombre }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Apellido 1:</span>
        <p class="font-medium">{{ propietario.apellido1 }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Apellido 2:</span>
        <p class="font-medium">{{ propietario.apellido2 }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Tipo Propiedad:</span>
        <p class="font-medium">{{ propietario.tipoPropiedad }}</p>
      </div>
      <div v-if="propietario.descripcionPropiedad" class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Descripción Propiedad:</span>
        <p class="font-medium">{{ propietario.descripcionPropiedad }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Número Propiedad:</span>
        <p class="font-medium">{{ propietario.numPropiedad }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Piso:</span>
        <p class="font-medium">{{ propietario.pisoPropiedad }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Tipo:</span>
        <p class="font-medium">{{ propietario.tipo }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Residente:</span>
        <p class="font-medium">{{ propietario.residente }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Trastero:</span>
        <p class="font-medium">{{ propietario.tieneTrastero ? 'Sí' : 'No' }}</p>
      </div>
      <div v-if="propietario.tieneTrastero" class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Nº Trastero:</span>
        <p class="font-medium">{{ propietario.numTrastero }}</p>
      </div>
      <div v-if="propietario.tieneTrastero" class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Lugar Trastero:</span>
        <p class="font-medium">Sótano {{ propietario.lugarTrastero }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Parking:</span>
        <p class="font-medium">{{ propietario.tieneParking ? 'Sí' : 'No' }}</p>
      </div>
      <div v-if="propietario.tieneParking" class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Nº Parking:</span>
        <p class="font-medium">{{ propietario.numParking }}</p>
      </div>
      <div v-if="propietario.tieneParking" class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Lugar Parking:</span>
        <p class="font-medium">Sótano {{ propietario.lugarParking }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Fecha de creación:</span>
        <p class="font-medium">{{ formatDate(propietario.createdAt) }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Última actualización:</span>
        <p class="font-medium">{{ formatDate(propietario.updatedAt) }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Nº Actualizaciones:</span>
        <p class="font-medium">{{ propietario.numActualizaciones }}</p>
      </div>
    </div>

    <div class="flex flex-wrap gap-3">
      <button @click="handleModify" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition">
        MODIFICAR
      </button>
      <button @click="$emit('delete')" class="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 px-4 rounded-lg transition">
        SUPRIMIR
      </button>
      <button @click="$emit('back')" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">
        ATRÁS
      </button>
    </div>

    <!-- Modal para mostrar mensaje de imposibilidad de modificar -->
    <div v-if="showModifyBlocked" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg p-6 max-w-sm w-full mx-4">
        <p class="text-red-600 font-semibold mb-4">IMPOSIBLE MODIFICAR. SOLO INQUILINOS O AYUNTAMIENTO</p>
        <button @click="showModifyBlocked = false" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg w-full">
          OK
        </button>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import type { Propietario } from '../types';

const props = defineProps<{
  propietario: Propietario;
  comunidad?: any;
}>();

const emit = defineEmits<{
  modify: [];
  delete: [];
  back: [];
}>();

const showModifyBlocked = ref(false);

const formatDate = (date: string) => {
  return new Date(date).toLocaleString('es-ES');
};

const handleModify = () => {
  if (props.propietario.tipo === 'Propietario') {
    showModifyBlocked.value = true;
  } else {
    emit('modify');
  }
};
</script>
