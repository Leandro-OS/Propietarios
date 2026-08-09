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
        <span class="text-gray-500 text-sm">Pertenece:</span>
        <p class="font-medium">{{ propietario.pertenece }}</p>
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
    </div>

    <div class="flex gap-3">
      <button @click="$emit('back')" class="bg-gray-500 hover:bg-gray-600 text-white font-semibold py-2 px-6 rounded-lg transition">
        OK
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
defineProps<{
  propietario: Record<string, any>;
}>();

defineEmits<{
  back: [];
}>();
</script>
