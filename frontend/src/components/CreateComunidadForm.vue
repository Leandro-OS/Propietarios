<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Vía *</label>
        <input v-model="form.via" type="text" class="w-full border rounded-lg p-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Dirección *</label>
        <input v-model="form.direccion" type="text" class="w-full border rounded-lg p-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Número *</label>
        <input v-model="form.numero" type="text" class="w-full border rounded-lg p-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Código Postal *</label>
        <input v-model="form.codigoPostal" type="text" class="w-full border rounded-lg p-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Urbanización</label>
        <input v-model="form.urbanizacion" type="text" class="w-full border rounded-lg p-2" />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Población *</label>
        <input v-model="form.poblacion" type="text" class="w-full border rounded-lg p-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nº Pisos *</label>
        <input v-model.number="form.numPisos" type="number" min="0" class="w-full border rounded-lg p-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nº Viviendas *</label>
        <input v-model.number="form.numViviendas" type="number" min="0" class="w-full border rounded-lg p-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nº Locales *</label>
        <input v-model.number="form.numLocales" type="number" min="0" class="w-full border rounded-lg p-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nº Sótanos *</label>
        <input v-model.number="form.numSotanos" type="number" min="0" class="w-full border rounded-lg p-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nº Parkings *</label>
        <input v-model.number="form.numParkings" type="number" min="0" class="w-full border rounded-lg p-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nº Trasteros *</label>
        <input v-model.number="form.numTrasteros" type="number" min="0" class="w-full border rounded-lg p-2" required />
      </div>
    </div>
    <div class="flex gap-4 mt-6">
      <button type="submit" :disabled="!isFormValid" class="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 px-6 rounded-lg transition disabled:opacity-50 disabled:cursor-not-allowed">
        ACEPTAR
      </button>
      <button type="button" @click="$emit('cancel')" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition">
        CANCELAR
      </button>
    </div>
  </form>
</template>

<script setup lang="ts">
import { reactive, computed } from 'vue';

const emit = defineEmits<{
  save: [data: Record<string, any>];
  cancel: [];
}>();

const form = reactive({
  via: '',
  direccion: '',
  numero: '',
  codigoPostal: '',
  urbanizacion: '',
  poblacion: '',
  numPisos: 0,
  numViviendas: 0,
  numLocales: 0,
  numSotanos: 0,
  numParkings: 0,
  numTrasteros: 0
});

const isFormValid = computed(() => {
  return form.via && form.direccion && form.numero && form.codigoPostal &&
    form.poblacion &&
    form.numPisos !== undefined && form.numViviendas !== undefined &&
    form.numLocales !== undefined && form.numSotanos !== undefined &&
    form.numParkings !== undefined && form.numTrasteros !== undefined;
});

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('save', { ...form });
  }
};
</script>
