<template>
  <div>
    <h2 class="text-xl font-bold mb-4">Detalle de Comunidad</h2>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Vía:</span>
        <p class="font-medium">{{ comunidad.via }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Dirección:</span>
        <p class="font-medium">{{ comunidad.direccion }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Número:</span>
        <p class="font-medium">{{ comunidad.numero }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Código Postal:</span>
        <p class="font-medium">{{ comunidad.codigoPostal }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Urbanización:</span>
        <p class="font-medium">{{ comunidad.urbanizacion }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Población:</span>
        <p class="font-medium">{{ comunidad.poblacion }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Nº Pisos:</span>
        <p class="font-medium">{{ comunidad.numPisos }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Nº Viviendas:</span>
        <p class="font-medium">{{ comunidad.numViviendas }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Nº Locales:</span>
        <p class="font-medium">{{ comunidad.numLocales }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Nº Sótanos:</span>
        <p class="font-medium">{{ comunidad.numSotanos }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Nº Parkings:</span>
        <p class="font-medium">{{ comunidad.numParkings }}</p>
      </div>
      <div class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Nº Trasteros:</span>
        <p class="font-medium">{{ comunidad.numTrasteros }}</p>
      </div>
      <div v-if="comunidad.fechaSupresion" class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Fecha Supresión:</span>
        <p class="font-medium">{{ formatDate(comunidad.fechaSupresion) }}</p>
      </div>
      <div v-if="comunidad.motivo !== undefined" class="bg-gray-50 p-3 rounded">
        <span class="text-gray-500 text-sm">Motivo:</span>
        <p class="font-medium">{{ comunidad.motivo || 'Sin indicar' }}</p>
      </div>
    </div>

    <div class="flex flex-wrap gap-3 mb-4">
      <button
        @click="$emit('viewPropietarios')"
        :disabled="!hasPropietarios"
        class="bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed"
      >
        VISUALIZAR PROPIETARIOS
      </button>
      <button @click="$emit('cancel')" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-4 rounded-lg transition">
        ATRÁS
      </button>
    </div>

    <div class="text-center py-4">
      <p v-if="!hasPropietarios" class="text-gray-500">NO EXISTEN PROPIETARIOS ASOCIADOS</p>
      <p v-else class="text-blue-600 font-semibold">{{ propietariosCount }} PROPIETARIOS ASOCIADOS</p>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue';

const props = defineProps<{
  comunidad: Record<string, any>;
}>();

defineEmits<{
  viewPropietarios: [];
  cancel: [];
}>();

const hasPropietarios = computed(() => {
  return props.comunidad.propietarios && props.comunidad.propietarios.length > 0;
});

const propietariosCount = computed(() => {
  return props.comunidad.propietarios ? props.comunidad.propietarios.length : 0;
});

const formatDate = (dateStr: string) => {
  return new Date(dateStr).toISOString().split('T')[0];
};
</script>
