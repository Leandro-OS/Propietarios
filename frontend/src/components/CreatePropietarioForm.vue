<template>
  <form @submit.prevent="handleSubmit" class="space-y-4">
    <h3 class="text-lg font-semibold mb-2">Datos del Propietario</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Nombre *</label>
        <input v-model="form.nombre" type="text" class="w-full border rounded-lg p-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Apellido 1 *</label>
        <input v-model="form.apellido1" type="text" class="w-full border rounded-lg p-2" required />
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Apellido 2 *</label>
        <input v-model="form.apellido2" type="text" class="w-full border rounded-lg p-2" required />
      </div>
    </div>

    <h3 class="text-lg font-semibold mb-2 mt-4">Datos de la Propiedad</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Tipo Propiedad *</label>
        <select v-model="form.tipoPropiedad" class="w-full border rounded-lg p-2" required>
          <option value="">Seleccionar...</option>
          <option value="Vivienda">Vivienda</option>
          <option value="Local">Local</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Número Propiedad *</label>
        <select v-model.number="form.numPropiedad" class="w-full border rounded-lg p-2" required>
          <option value="">Seleccionar...</option>
          <option v-for="n in availablePropiedades" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Piso Propiedad *</label>
        <select v-model.number="form.pisoPropiedad" class="w-full border rounded-lg p-2" required>
          <option value="">Seleccionar...</option>
          <option v-for="n in pisosDisponibles" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Tipo *</label>
        <select v-model="form.tipo" class="w-full border rounded-lg p-2" required>
          <option value="">Seleccionar...</option>
          <option value="Propietario">Propietario</option>
          <option value="Inquilino">Inquilino</option>
          <option value="Ayuntamiento">Ayuntamiento</option>
        </select>
      </div>
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Pertenece</label>
        <input
          v-model="form.pertenece"
          type="text"
          class="w-full border rounded-lg p-2"
          :readonly="form.tipo === 'Propietario'"
          :class="{ 'bg-gray-100': form.tipo === 'Propietario' }"
        />
      </div>
    </div>

    <h3 class="text-lg font-semibold mb-2 mt-4">Trastero</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">¿Tiene Trastero?</label>
        <select v-model="form.tieneTrastero" class="w-full border rounded-lg p-2" @change="onTrasteroChange">
          <option :value="false">No</option>
          <option :value="true">Sí</option>
        </select>
      </div>
      <div v-if="form.tieneTrastero">
        <label class="block text-sm font-medium text-gray-700 mb-1">Número Trastero</label>
        <select v-model.number="form.numTrastero" class="w-full border rounded-lg p-2">
          <option value="">Seleccionar...</option>
          <option v-for="n in trasterosDisponibles" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
      <div v-if="form.tieneTrastero">
        <label class="block text-sm font-medium text-gray-700 mb-1">Lugar (Sótano)</label>
        <select v-model.number="form.lugarTrastero" class="w-full border rounded-lg p-2">
          <option value="">Seleccionar...</option>
          <option v-for="n in sotanosDisponibles" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
    </div>

    <h3 class="text-lg font-semibold mb-2 mt-4">Parking</h3>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">¿Tiene Parking?</label>
        <select v-model="form.tieneParking" class="w-full border rounded-lg p-2" @change="onParkingChange">
          <option :value="false">No</option>
          <option :value="true">Sí</option>
        </select>
      </div>
      <div v-if="form.tieneParking">
        <label class="block text-sm font-medium text-gray-700 mb-1">Número Parking</label>
        <select v-model.number="form.numParking" class="w-full border rounded-lg p-2">
          <option value="">Seleccionar...</option>
          <option v-for="n in parkingsDisponibles" :key="n" :value="n">{{ n }}</option>
        </select>
      </div>
      <div v-if="form.tieneParking">
        <label class="block text-sm font-medium text-gray-700 mb-1">Lugar (Sótano)</label>
        <select v-model.number="form.lugarParking" class="w-full border rounded-lg p-2">
          <option value="">Seleccionar...</option>
          <option v-for="n in sotanosDisponibles" :key="n" :value="n">{{ n }}</option>
        </select>
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
import { reactive, computed, watch } from 'vue';
import type { Comunidad, Propietario } from '../types';

const props = defineProps<{
  comunidad: Comunidad;
}>();

const emit = defineEmits<{
  save: [data: Partial<Propietario>];
  cancel: [];
}>();

const form = reactive({
  nombre: '',
  apellido1: '',
  apellido2: '',
  tipoPropiedad: '',
  numPropiedad: undefined as number | undefined,
  pisoPropiedad: undefined as number | undefined,
  tipo: '',
  pertenece: '',
  tieneTrastero: false,
  numTrastero: undefined as number | undefined,
  lugarTrastero: undefined as number | undefined,
  tieneParking: false,
  numParking: undefined as number | undefined,
  lugarParking: undefined as number | undefined,
  comunidadId: props.comunidad.id
});

const pisosDisponibles = computed(() => {
  return Array.from({ length: props.comunidad.numPisos }, (_, i) => i + 1);
});

const sotanosDisponibles = computed(() => {
  return Array.from({ length: props.comunidad.numSotanos }, (_, i) => i + 1);
});

const availablePropiedades = computed(() => {
  if (form.tipoPropiedad === 'Vivienda') {
    return Array.from({ length: props.comunidad.numViviendas }, (_, i) => i + 1);
  }
  if (form.tipoPropiedad === 'Local') {
    return Array.from({ length: props.comunidad.numLocales }, (_, i) => i + 1);
  }
  return [];
});

const trasterosDisponibles = computed(() => {
  return Array.from({ length: props.comunidad.numTrasteros }, (_, i) => i + 1);
});

const parkingsDisponibles = computed(() => {
  return Array.from({ length: props.comunidad.numParkings }, (_, i) => i + 1);
});

watch(() => form.tipo, (newVal) => {
  if (newVal === 'Propietario') {
    form.pertenece = `${form.nombre} ${form.apellido1} ${form.apellido2}`;
  } else {
    form.pertenece = '';
  }
});

watch(() => form.nombre, () => {
  if (form.tipo === 'Propietario') {
    form.pertenece = `${form.nombre} ${form.apellido1} ${form.apellido2}`;
  }
});

watch(() => form.apellido1, () => {
  if (form.tipo === 'Propietario') {
    form.pertenece = `${form.nombre} ${form.apellido1} ${form.apellido2}`;
  }
});

watch(() => form.apellido2, () => {
  if (form.tipo === 'Propietario') {
    form.pertenece = `${form.nombre} ${form.apellido1} ${form.apellido2}`;
  }
});

const isFormValid = computed(() => {
  return form.nombre && form.apellido1 && form.apellido2 &&
    form.tipoPropiedad && form.numPropiedad && form.pisoPropiedad &&
    form.tipo && form.pertenece;
});

const onTrasteroChange = () => {
  if (!form.tieneTrastero) {
    form.numTrastero = undefined;
    form.lugarTrastero = undefined;
  }
};

const onParkingChange = () => {
  if (!form.tieneParking) {
    form.numParking = undefined;
    form.lugarParking = undefined;
  }
};

const handleSubmit = () => {
  if (isFormValid.value) {
    emit('save', { ...form });
  }
};
</script>
