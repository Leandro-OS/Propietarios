-- CreateTable
CREATE TABLE "Comunidad" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "via" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "codigoPostal" TEXT NOT NULL,
    "urbanizacion" TEXT NOT NULL,
    "poblacion" TEXT NOT NULL,
    "numPisos" INTEGER NOT NULL,
    "numViviendas" INTEGER NOT NULL,
    "numLocales" INTEGER NOT NULL,
    "numSotanos" INTEGER NOT NULL,
    "numParkings" INTEGER NOT NULL,
    "numTrasteros" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "numActualizaciones" INTEGER NOT NULL DEFAULT 1
);

-- CreateTable
CREATE TABLE "Propietario" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido1" TEXT NOT NULL,
    "apellido2" TEXT NOT NULL,
    "tipoPropiedad" TEXT NOT NULL,
    "numPropiedad" INTEGER NOT NULL,
    "pisoPropiedad" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "pertenece" TEXT NOT NULL,
    "tieneTrastero" BOOLEAN NOT NULL DEFAULT false,
    "numTrastero" INTEGER,
    "lugarTrastero" INTEGER,
    "tieneParking" BOOLEAN NOT NULL DEFAULT false,
    "numParking" INTEGER,
    "lugarParking" INTEGER,
    "comunidadId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "numActualizaciones" INTEGER NOT NULL DEFAULT 1,
    CONSTRAINT "Propietario_comunidadId_fkey" FOREIGN KEY ("comunidadId") REFERENCES "Comunidad" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "ComunidadHistorico" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "via" TEXT NOT NULL,
    "direccion" TEXT NOT NULL,
    "numero" TEXT NOT NULL,
    "codigoPostal" TEXT NOT NULL,
    "urbanizacion" TEXT NOT NULL,
    "poblacion" TEXT NOT NULL,
    "numPisos" INTEGER NOT NULL,
    "numViviendas" INTEGER NOT NULL,
    "numLocales" INTEGER NOT NULL,
    "numSotanos" INTEGER NOT NULL,
    "numParkings" INTEGER NOT NULL,
    "numTrasteros" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "numActualizaciones" INTEGER NOT NULL,
    "fechaSupresion" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "PropietarioHistorico" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "nombre" TEXT NOT NULL,
    "apellido1" TEXT NOT NULL,
    "apellido2" TEXT NOT NULL,
    "tipoPropiedad" TEXT NOT NULL,
    "numPropiedad" INTEGER NOT NULL,
    "pisoPropiedad" INTEGER NOT NULL,
    "tipo" TEXT NOT NULL,
    "pertenece" TEXT NOT NULL,
    "tieneTrastero" BOOLEAN NOT NULL,
    "numTrastero" INTEGER,
    "lugarTrastero" INTEGER,
    "tieneParking" BOOLEAN NOT NULL,
    "numParking" INTEGER,
    "lugarParking" INTEGER,
    "comunidadId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    "numActualizaciones" INTEGER NOT NULL,
    "fechaSupresion" DATETIME NOT NULL,
    "motivoBaja" TEXT
);
