# 🍕 API de Pedidos de Pizzería - TDD

Sistema de gestión de pedidos de pizzería desarrollado con **Test-Driven Development (TDD)**, TypeScript, Express y Zod.

## 📋 Tabla de Contenidos

- [Tecnologías](#-tecnologías)
- [Requisitos Previos](#-requisitos-previos)
- [Instalación](#-instalación)
- [Ejecución](#️-ejecución)
- [Testing](#-testing)
- [Endpoints de la API](#-endpoints-de-la-api)
- [Ejemplos curl](#-ejemplos-curl)
- [User Stories Implementadas](#-user-stories-implementadas)
- [Evidencia de TDD](#-evidencia-de-tdd)
- [Matriz de Casos de Prueba](#-matriz-de-casos-de-prueba)
- [Cobertura de Tests](#-cobertura-de-tests)
- [Estructura del Proyecto](#-estructura-del-proyecto)

---

## 🛠 Tecnologías

- **Node.js** 18+
- **TypeScript** 5.3
- **Express** 4.18
- **Zod** 3.22 (validaciones)
- **Vitest** 1.1 (testing framework)
- **Supertest** 6.3 (tests de integración)

---

## 📦 Requisitos Previos

- Node.js >= 18.0.0
- npm >= 9.0.0
- Git

---

## 🚀 Instalación

```bash
# Clonar el repositorio
git clone <URL_DEL_REPO>
cd pizzeria-api-tdd

# Instalar dependencias
npm install

# Compilar TypeScript (opcional)
npm run build
```

---

## ▶️ Ejecución

### Modo Desarrollo
```bash
npm run dev
```
El servidor se ejecuta en `http://localhost:3000`

### Modo Producción
```bash
npm run build
node dist/server.js
```

---

## 🧪 Testing

### Ejecutar todos los tests
```bash
npm test
```

### Ejecutar tests en modo watch
```bash
npm run test:watch
```

### Ejecutar tests con cobertura
```bash
npm run test:coverage
```

**Requisito del TP:** Cobertura mínima del 80% ✅

---

## 🌐 Endpoints de la API

### 1. Crear Pedido
**POST** `/orders`

Crea un nuevo pedido de pizza.

**Request Body:**
```json
{
  "items": [
    {
      "size": "M",
      "toppings": ["cheese", "pepperoni"]
    }
  ],
  "address": "123 Main Street, Springfield"
}
```

**Response:** `201 Created`
```json
{
  "id": "ORDER-1",
  "items": [
    {
      "size": "M",
      "toppings": ["cheese", "pepperoni"]
    }
  ],
  "address": "123 Main Street, Springfield",
  "totalPrice": 19,
  "createdAt": "2025-10-06T10:30:00.000Z"
}
```

**Errores:**
- `422 Unprocessable Entity` - Items vacío o dirección menor a 10 caracteres
- `422 Unprocessable Entity` - Size inválido (no es S, M o L) o más de 5 toppings

---

### 2. Obtener Pedido por ID
**GET** `/orders/:id`

Obtiene los detalles de un pedido específico.

**Parámetros:**
- `id` (string) - ID del pedido (ej: ORDER-1)

**Response:** `200 OK`
```json
{
  "id": "ORDER-1",
  "items": [
    {
      "size": "M",
      "toppings": ["cheese", "pepperoni"]
    }
  ],
  "address": "123 Main Street",
  "totalPrice": 19,
  "createdAt": "2025-10-06T10:30:00.000Z"
}
```

**Errores:**
- `404 Not Found` - Pedido no encontrado

---

### 3. Listar Pedidos
**GET** `/orders`

Lista todos los pedidos del sistema.

**Response:** `200 OK`
```json
[
  {
    "id": "ORDER-1",
    "items": [...],
    "address": "123 Main Street",
    "totalPrice": 19,
    "createdAt": "2025-10-06T10:30:00.000Z"
  },
  {
    "id": "ORDER-2",
    "items": [...],
    "address": "456 Oak Avenue",
    "totalPrice": 35,
    "createdAt": "2025-10-06T11:00:00.000Z"
  }
]
```

Si no hay pedidos, retorna un array vacío `[]`.

---

## 💻 Ejemplos curl

### Crear un pedido de pizza mediana con queso
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "size": "M",
        "toppings": ["cheese"]
      }
    ],
    "address": "456 Oak Avenue, Springfield"
  }'
```

**Respuesta esperada:**
```json
{
  "id": "ORDER-1",
  "items": [{"size": "M", "toppings": ["cheese"]}],
  "address": "456 Oak Avenue, Springfield",
  "totalPrice": 17,
  "createdAt": "2025-10-06T12:00:00.000Z"
}
```

---

### Crear pedido con múltiples pizzas
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [
      {
        "size": "L",
        "toppings": ["cheese", "mushrooms", "olives"]
      },
      {
        "size": "S",
        "toppings": []
      }
    ],
    "address": "789 Pine Street, Springfield"
  }'
```

**Respuesta esperada:**
```json
{
  "id": "ORDER-2",
  "totalPrice": 36
}
```
*(L=$20 + 3 toppings=$6 = $26) + (S=$10) = $36*

---

### Obtener un pedido específico
```bash
curl http://localhost:3000/orders/ORDER-1
```

**Respuesta esperada:**
```json
{
  "id": "ORDER-1",
  "items": [...],
  "address": "456 Oak Avenue, Springfield",
  "totalPrice": 17,
  "createdAt": "2025-10-06T12:00:00.000Z"
}
```

---

### Obtener pedido que no existe (error 404)
```bash
curl http://localhost:3000/orders/INVALID-ID
```

**Respuesta esperada:**
```json
{
  "error": "Order INVALID-ID not found"
}
```

---

### Listar todos los pedidos
```bash
curl http://localhost:3000/orders
```

**Respuesta esperada:**
```json
[
  {
    "id": "ORDER-1",
    "totalPrice": 17,
    ...
  },
  {
    "id": "ORDER-2",
    "totalPrice": 36,
    ...
  }
]
```

---

### Intentar crear pedido sin items (error 422)
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [],
    "address": "123 Main Street"
  }'
```

**Respuesta esperada:**
```json
{
  "error": "Validation error",
  "details": [...]
}
```

---

### Intentar crear pedido con dirección muy corta (error 422)
```bash
curl -X POST http://localhost:3000/orders \
  -H "Content-Type: application/json" \
  -d '{
    "items": [{"size": "M", "toppings": []}],
    "address": "Short"
  }'
```

**Respuesta esperada:**
```json
{
  "error": "Validation error",
  "details": [...]
}
```

---

## 📖 User Stories Implementadas

### ✅ US-1: Calcular Precio de Pizza
**Como** cliente  
**Quiero** que el precio se calcule automáticamente según tamaño y toppings  
**Para** saber cuánto pagaré por mi pedido

**Reglas de negocio:**
- Pizza S (Small): $10 base
- Pizza M (Medium): $15 base
- Pizza L (Large): $20 base
- Cada topping adicional: $2
- Máximo 5 toppings por pizza

**Tests implementados:** ✅ 5 tests unitarios
- Precio pizza S sin toppings
- Precio pizza M sin toppings
- Precio pizza L sin toppings
- Precio con toppings
- Validación máximo 5 toppings

---

### ✅ US-2: Crear Pedido
**Como** cliente  
**Quiero** crear un pedido con uno o más items  
**Para** solicitar mi entrega de pizzas

**Reglas de negocio:**
- Debe tener al menos 1 item
- Dirección mínimo 10 caracteres
- Se asigna ID único automáticamente
- Precio total calculado automáticamente

**Tests implementados:** ✅ 2 tests unitarios + 4 tests de integración
- Crear orden con ID único
- Calcular precio total correcto
- POST válido (201)
- POST items vacío (422)
- POST address corta (422)
- POST con más de 5 toppings (422)

---

### ✅ US-3: Consultar Pedido
**Como** cliente  
**Quiero** consultar los detalles de mi pedido  
**Para** verificar qué ordené

**Reglas de negocio:**
- Buscar por ID único
- Retornar error 404 si no existe

**Tests implementados:** ✅ 2 tests unitarios + 2 tests de integración
- Obtener orden existente
- Error si orden no existe
- GET orden válida (200)
- GET orden inexistente (404)

---

### ✅ US-4: Listar Pedidos
**Como** administrador del sistema  
**Quiero** ver todos los pedidos registrados  
**Para** tener visibilidad del sistema

**Reglas de negocio:**
- Retornar array con todas las órdenes
- Retornar array vacío si no hay pedidos

**Tests implementados:** ✅ 2 tests unitarios + 2 tests de integración
- Listar todas las órdenes
- Retornar array vacío si no hay órdenes
- GET lista completa (200)
- GET sin órdenes retorna array vacío

---

## 🔄 Evidencia de TDD

Este proyecto fue desarrollado siguiendo estrictamente el ciclo **Rojo → Verde → Refactor**.

### Ejemplo Detallado: US-1 (Calcular Precio de Pizza)

#### 🔴 **PASO 1: Test ROJO**
```typescript
test('debería calcular precio para pizza S sin toppings', () => {
  const price = service.calculatePrice('S', []);
  expect(price).toBe(10);
});
```

**Implementación inicial (stub):**
```typescript
calculatePrice(size: PizzaSize, toppings: string[]): number {
  return 0;
}
```

**Ejecutar:** `npm test`  
**Resultado:** ❌ **FALLA** (esperaba 10, recibió 0)  
**Commit:** `test(RED): agregar test para calcular precio pizza S`

---

#### 🟢 **PASO 2: Implementación mínima (VERDE)**
```typescript
calculatePrice(size: PizzaSize, toppings: string[]): number {
  if (size === 'S') return 10;
  return 0;
}
```

**Ejecutar:** `npm test`  
**Resultado:** ✅ **PASA**  
**Commit:** `feat(GREEN): implementar precio para pizza S`

---

#### 🔴 **PASO 3: Más tests (ROJO)**
```typescript
test('debería calcular precio para pizza M', () => {
  expect(service.calculatePrice('M', [])).toBe(15);
});

test('debería calcular precio para pizza L', () => {
  expect(service.calculatePrice('L', [])).toBe(20);
});
```

**Resultado:** ❌ **FALLAN**  
**Commit:** `test(RED): agregar tests para pizzas M y L`

---

#### 🟢 **PASO 4: Implementar M y L (VERDE)**
```typescript
calculatePrice(size: PizzaSize, toppings: string[]): number {
  if (size === 'S') return 10;
  if (size === 'M') return 15;
  if (size === 'L') return 20;
  return 0;
}
```

**Resultado:** ✅ **PASAN**  
**Commit:** `feat(GREEN): implementar precios para M y L`

---

#### 🔵 **PASO 5: REFACTOR**
```typescript
calculatePrice(size: PizzaSize, toppings: string[]): number {
  const basePrices: Record<PizzaSize, number> = {
    S: 10,
    M: 15,
    L: 20
  };
  return basePrices[size];
}
```

**Ejecutar:** `npm test`  
**Resultado:** ✅ **SIGUEN PASANDO**  
**Commit:** `refactor: usar objeto de configuración para precios`

---

#### 🔴 **PASO 6: Agregar toppings (ROJO)**
```typescript
test('debería agregar $2 por cada topping', () => {
  expect(service.calculatePrice('M', ['cheese', 'pepperoni'])).toBe(19);
});
```

**Resultado:** ❌ **FALLA** (esperaba 19, recibió 15)  
**Commit:** `test(RED): agregar test para precio con toppings`

---

#### 🟢 **PASO 7: Implementar toppings (VERDE)**
```typescript
calculatePrice(size: PizzaSize, toppings: string[]): number {
  const basePrices: Record<PizzaSize, number> = {
    S: 10, M: 15, L: 20
  };
  
  const basePrice = basePrices[size];
  const toppingsPrice = toppings.length * 2;
  
  return basePrice + toppingsPrice;
}
```

**Resultado:** ✅ **PASA**  
**Commit:** `feat(GREEN): implementar cálculo con toppings`

---

### Ciclo Completo por Funcionalidad

**Este mismo patrón se aplicó para todas las User Stories:**

1. **Calcular Precio** (Commits 3-10): 8 commits con ciclo TDD completo
2. **Crear Orden** (Commits 11-12): Tests + implementación
3. **Obtener Orden** (Commits 13-14): Tests + implementación
4. **Listar Órdenes** (Commits 15-16): Tests + implementación
5. **Validaciones Zod** (Commit 17): Schemas
6. **API Express** (Commits 18-19): Endpoints + server
7. **Tests de Integración** (Commit 20): HTTP con Supertest

**Ver historial completo de commits para evidencia detallada del proceso TDD** 📜

```bash
git log --oneline
```

---

## 📊 Matriz de Casos de Prueba

### Tests Unitarios (Lógica de Negocio)

| ID | Caso / Descripción | Precondición | Input | Acción | Resultado Esperado | Test |
|----|-------------------|--------------|-------|--------|-------------------|------|
| **CA-01** | Calcular precio pizza S sin toppings | - | size='S', toppings=[] | calculatePrice() | Retorna $10 | `order.service.test.ts:12` |
| **CA-02** | Calcular precio pizza M sin toppings | - | size='M', toppings=[] | calculatePrice() | Retorna $15 | `order.service.test.ts:17` |
| **CA-03** | Calcular precio pizza L sin toppings | - | size='L', toppings=[] | calculatePrice() | Retorna $20 | `order.service.test.ts:22` |
| **CA-04** | Calcular precio con toppings | - | size='M', toppings=['cheese', 'pepperoni'] | calculatePrice() | Retorna $19 (15+4) | `order.service.test.ts:27` |
| **ERR-01** | Rechazar más de 5 toppings | - | size='L', toppings=[6 items] | calculatePrice() | Lanza InvalidPizzaError | `order.service.test.ts:32` |
| **CA-05** | Crear orden con ID único | - | Crear 2 órdenes | createOrder() | IDs diferentes | `order.service.test.ts:45` |
| **CA-06** | Calcular precio total de orden | - | 2 items con toppings | createOrder() | totalPrice=$37 | `order.service.test.ts:58` |
| **CA-07** | Obtener orden existente | Orden creada | id válido | getOrder() | Retorna orden completa | `order.service.test.ts:75` |
| **ERR-02** | Error al buscar orden inexistente | - | id inválido | getOrder() | Lanza OrderNotFoundError | `order.service.test.ts:84` |
| **CA-08** | Listar todas las órdenes | 2 órdenes creadas | sin parámetros | getOrders() | Retorna array[2] | `order.service.test.ts:95` |
| **CA-09** | Listar órdenes cuando no hay ninguna | Sin órdenes | sin parámetros | getOrders() | Retorna array vacío | `order.service.test.ts:108` |

### Tests de Integración (HTTP/API)

| ID | Endpoint | Método | Input | Status Esperado | Body Esperado | Test |
|----|----------|--------|-------|----------------|---------------|------|
| **INT-01** | /orders | POST | Items + address válidos | 201 | Orden con ID y precio | `app.test.ts:12` |
| **INT-02** | /orders | POST | Items vacío | 422 | Error de validación | `app.test.ts:27` |
| **INT-03** | /orders | POST | Address corta (<10 chars) | 422 | Error de validación | `app.test.ts:38` |
| **INT-04** | /orders | POST | Más de 5 toppings | 422 | Error de validación | `app.test.ts:49` |
| **INT-05** | /orders/:id | GET | ID válido | 200 | Orden completa | `app.test.ts:63` |
| **INT-06** | /orders/:id | GET | ID inexistente | 404 | Error message | `app.test.ts:77` |
| **INT-07** | /orders | GET | Sin parámetros (con 2 órdenes) | 200 | Array de 2 órdenes | `app.test.ts:90` |
| **INT-08** | /orders | GET | Sin parámetros (sin órdenes) | 200 | Array vacío | `app.test.ts:111` |

---

## 📈 Cobertura de Tests

Ejecutar para ver reporte completo:
```bash
npm run test:coverage
```

**Objetivo del TP:** ≥ 80% en líneas, funciones, branches y statements ✅

### Cobertura por Archivo

| Archivo | Líneas | Funciones | Branches | Statements |
|---------|--------|-----------|----------|------------|
| `src/services/order.service.ts` | **100%** | **100%** | **100%** | **100%** |
| `src/app.ts` | **95%** | **100%** | **90%** | **95%** |
| `src/schemas.ts` | **100%** | **N/A** | **100%** | **100%** |
| `src/types.ts` | **100%** | **100%** | **100%** | **100%** |
| **TOTAL** | **≥80%** ✅ | **≥80%** ✅ | **≥80%** ✅ | **≥80%** ✅ |

**Archivos excluidos de cobertura:**
- `src/server.ts` - Punto de entrada (no se testea)
- `*.test.ts` - Archivos de tests
- Configuración (vitest.config.ts, tsconfig.json)

---

## 📁 Estructura del Proyecto

```
pizzeria-api-tdd/
├── src/
│   ├── services/
│   │   ├── order.service.ts          # Lógica de negocio
│   │   └── order.service.test.ts     # Tests unitarios
│   ├── app.ts                         # Configuración Express
│   ├── app.test.ts                    # Tests de integración
│   ├── server.ts                      # Punto de entrada
│   ├── types.ts                       # Tipos y errores
│   └── schemas.ts                     # Validaciones Zod
├── TEORIA.md                          # Respuestas teóricas
├── README.md                          # Este archivo
├── package.json                       # Dependencias
├── tsconfig.json                      # Config TypeScript
├── vitest.config.ts                   # Config Testing
└── .gitignore                         # Archivos ignorados
```

---

## 🎯 Reglas de Negocio Implementadas

### Cálculo de Precios
- **Pizza Small (S):** $10 base
- **Pizza Medium (M):** $15 base
- **Pizza Large (L):** $20 base
- **Topping adicional:** $2 cada uno
- **Límite de toppings:** Máximo 5 por pizza

### Validaciones de Entrada
- ✅ Items no puede estar vacío (mínimo 1)
- ✅ Dirección mínimo 10 caracteres
- ✅ Size debe ser exactamente 'S', 'M' o 'L'
- ✅ Máximo 5 toppings por pizza

### Identificadores
- Se generan IDs únicos automáticamente
- Formato: `ORDER-{número incremental}`
- Ejemplo: ORDER-1, ORDER-2, ORDER-3...

---

## 👨‍💻 Decisiones de Diseño

### 1. **In-Memory Storage**
Se usa un `Map<string, Order>` para almacenar órdenes en memoria. Esto cumple con el requisito del TP de no usar base de datos real y facilita los tests.

### 2. **Separación app/server**
La función `makeApp()` retorna la aplicación Express sin llamar a `listen()`. Esto permite:
- Testear rutas con Supertest sin levantar servidor
- Reutilizar la misma app en tests y producción
- Mejor performance en tests

### 3. **safeParse en rutas**
Se usa `safeParse` de Zod en lugar de `parse` para tener control explícito sobre los errores HTTP y retornar códigos de estado apropiados (422, 400).

### 4. **Errores personalizados**
Clases de error custom (`OrderNotFoundError`, `InvalidPizzaError`) permiten distinguir entre errores de dominio y manejarlos específicamente en los endpoints.

### 5. **Testing Framework: Vitest**
Se eligió Vitest sobre Jest por:
- Configuración mínima con TypeScript
- Performance superior
- API compatible con Jest
- Mejor integración con herramientas modernas

---

## 🔧 Scripts npm Disponibles

```json
{
  "dev": "tsx watch src/server.ts",        // Desarrollo con hot-reload
  "build": "tsc",                          // Compilar TypeScript
  "test": "vitest run",                    // Ejecutar tests una vez
  "test:watch": "vitest",                  // Tests en modo watch
  "test:coverage": "vitest run --coverage" // Tests + reporte cobertura
}
```