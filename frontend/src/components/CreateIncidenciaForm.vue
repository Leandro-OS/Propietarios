<template>
  <div class="bg-white border-2 border-blue-600 rounded-lg p-6 shadow-lg">
    <h3 class="text-lg font-bold mb-4 text-blue-800">
      {{ isEvolution ? 'EVOLUCIONAR INCIDENCIA' : 'CREAR NUEVA INCIDENCIA' }}
    </h3>
    <form @submit.prevent="submitForm" class="space-y-4">
      <!-- Comunidad (solo en modo creacion) -->
      <div v-if="!isEvolution">
        <label class="block text-sm font-medium text-gray-700 mb-1">Comunidad</label>
        <select v-model="form.idCom" required class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">SELECCIONE UNA COMUNIDAD</option>
          <option v-for="com in comunidades" :key="com.id" :value="com.id">{{ com.comunidad }} - {{ com.poblacion }}</option>
        </select>
      </div>
      <!-- Tipo Incidencia (disabled en evolucion) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Tipo de Incidencia</label>
        <select v-if="!isEvolution" v-model="form.tipoIncidencia" @change="onTipoChange" required class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">SELECCIONE UN TIPO</option>
          <option v-for="tipo in TIPOS_INCIDENCIA" :key="tipo" :value="tipo">{{ tipo }}</option>
        </select>
        <div v-else class="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-600">{{ form.tipoIncidencia }}</div>
      </div>
      <!-- Subtipo Incidencia (disabled en evolucion) -->
      <div v-if="form.tipoIncidencia">
        <label class="block text-sm font-medium text-gray-700 mb-1">Subtipo</label>
        <select v-if="!isEvolution" v-model="form.subtipoIncidencia" :required="!isEvolution && form.tipoIncidencia !== 'Catastrofe'" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">SELECCIONE UN SUBTIPO</option>
          <option v-for="sub in currentSubtipos" :key="sub" :value="sub">{{ sub }}</option>
        </select>
        <div v-else class="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-600">{{ form.subtipoIncidencia || '-' }}</div>
      </div>
      <!-- Descripcion (disabled en evolucion) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Descripcion</label>
        <textarea v-if="!isEvolution" v-model="form.descripcion" required rows="3" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Describa la incidencia..."></textarea>
        <div v-else class="w-full bg-gray-100 border border-gray-300 rounded px-3 py-2 text-gray-600" style="min-height: 60px;">{{ form.descripcion }}</div>
      </div>
      <!-- Estado (siempre editable) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Estado</label>
        <select v-model="form.estado" required class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500">
          <option value="">SELECCIONE UN ESTADO</option>
          <option v-for="estado in availableStates" :key="estado" :value="estado">{{ estado }}</option>
        </select>
      </div>
      <!-- Descripcion Estado (siempre editable) -->
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Descripcion del Estado</label>
        <textarea v-model="form.descripcionEstado" required rows="2" class="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Detalle del estado actual..."></textarea>
      </div>
      <!-- Botones -->
      <div class="flex gap-3 pt-4">
        <button type="submit" class="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-lg transition flex-1">{{ isEvolution ? 'ACTUALIZAR' : 'CREAR' }}</button>
        <button type="button" @click="$emit('cancel')" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition flex-1">CANCELAR</button>
      </div>
    </form>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';
import type { ComunidadIncidenciaCount } from '../types';
import type { IncidenciaComunidadTitulo } from '../types';
import { TIPOS_INCIDENCIA, SUBTIPOS_MANTENIMIENTO, SUBTIPOS_DESPERFECTO, SUBTIPOS_CATASTROFE, ESTADOS_INCIDENCIA } from '../types';

const props = defineProps<{
  comunidades: ComunidadIncidenciaCount[];
  isEvolution?: boolean;
  initialData?: IncidenciaComunidadTitulo;
  allowedStates?: string[];
}>();

const emit = defineEmits<{
  save: [data: any];
  cancel: [];
}>();

const form = ref({
  idCom: props.isEvolution ? '' : '',
  tipoIncidencia: props.isEvolution && props.initialData ? props.initialData.tipoIncidencia : '',
  subtipoIncidencia: props.isEvolution && props.initialData ? (props.initialData.subtipoIncidencia || '') : '',
  descripcion: props.isEvolution && props.initialData ? props.initialData.descripcion : '',
  estado: props.isEvolution && props.initialData ? props.initialData.estado : '',
  descripcionEstado: props.isEvolution && props.initialData ? props.initialData.descripcionEstado : ''
});

// Estados disponibles: si es evolucion, usa allowedStates; si no, solo 'Registrada'
const availableStates = computed(() => {
  if (props.isEvolution) {
    return props.allowedStates || [];
  }
  return ['Registrada'];
});

const currentSubtipos = computed(() => {
  switch (form.value.tipoIncidencia) {
    case 'Mantenimiento': return SUBTIPOS_MANTENIMIENTO;
    case 'Desperfecto': return SUBTIPOS_DESPERFECTO;
    case 'Catastrofe': return SUBTIPOS_CATASTROFE;
    default: return [];
  }
});

const onTipoChange = () => {
  form.value.subtipoIncidencia = '';
};

const submitForm = () => {
  if (props.isEvolution) {
    // En modo evolucion, solo enviamos estado y descripcionEstado
    emit('save', {
      estado: form.value.estado,
      descripcionEstado: form.value.descripcionEstado
    });
  } else {
    // En modo creacion, enviamos todo
    emit('save', {
      idCom: Number(form.value.idCom),
      tipoIncidencia: form.value.tipoIncidencia,
      subtipoIncidencia: form.value.subtipoIncidencia || null,
      descripcion: form.value.descripcion,
      estado: form.value.estado,
      descripcionEstado: form.value.descripcionEstado
    });
  }
};
</script>
