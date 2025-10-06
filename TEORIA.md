# Teoría - Trabajo Práctico 2

## 1. Explique el ciclo Rojo → Verde → Refactor y por qué es importante el tamaño de los pasos

El ciclo TDD consiste en tres pasos: *Rojo* (escribir un test que falle), *Verde* (implementar el código mínimo para que pase), y *Refactor* (mejorar el código manteniendo los tests en verde). El tamaño de los pasos es crucial porque pasos pequeños permiten detectar errores rápidamente, mantener el foco en una funcionalidad específica y facilitan el debugging. Pasos muy grandes aumentan la complejidad, dificultan identificar la causa de fallos y pueden llevar a sobre-ingeniería prematura.

## 2. Diferencie tests unitarios, de integración y E2E en APIs

*Tests unitarios* prueban una unidad aislada (función, clase, método) sin dependencias externas, usando mocks/stubs para colaboradores. *Tests de integración* verifican la interacción entre múltiples componentes (ej: endpoint + servicio + validación), pueden usar dependencias reales o simuladas. *Tests E2E* validan el flujo completo desde la perspectiva del usuario, incluyendo base de datos real, servidor HTTP y toda la infraestructura. En APIs, los unitarios prueban servicios/lógica, los de integración prueban rutas con Supertest, y E2E probarían con cliente real contra ambiente staging.

## 3. ¿Qué es un doble de prueba? Defina mock, stub y spy y cuándo conviene cada uno

Un *doble de prueba* es un objeto que reemplaza una dependencia real en tests. *Stub* devuelve respuestas predefinidas sin lógica (útil para simular respuestas de APIs externas). *Mock* es un stub que además verifica cómo fue usado (qué métodos se llamaron, con qué argumentos, cuántas veces). *Spy* envuelve un objeto real, permitiendo su ejecución normal pero registrando las llamadas para verificación posterior. Use stub para control simple de respuestas, mock cuando necesite verificar interacciones, y spy cuando quiera observar sin alterar comportamiento.

## 4. ¿Por qué es útil separar app de server? Muestre (en 8–10 líneas) un ejemplo mínimo con makeApp() y un test de integración con Supertest

Separar app de server permite testear rutas sin levantar un servidor HTTP real, mejora la velocidad de tests y facilita múltiples configuraciones. Ejemplo:

typescript
// app.ts
import express from 'express';

export const makeApp = () => {
  const app = express();
  app.use(express.json());
  app.get('/health', (req, res) => res.json({ status: 'ok' }));
  return app;
};

// app.test.ts
import request from 'supertest';
import { makeApp } from './app';

test('GET /health retorna status ok', async () => {
  const response = await request(makeApp()).get('/health');
  expect(response.status).toBe(200);
  expect(response.body).toEqual({ status: 'ok' });
});


## 5. Zod: diferencia entre parse y safeParse. ¿Dónde usaría cada uno en una ruta Express y por qué?

*parse* lanza una excepción (ZodError) si la validación falla, útil cuando queremos que el flujo se interrumpa automáticamente. *safeParse* retorna un objeto { success: boolean, data?, error? } sin lanzar excepciones, ideal para control explícito del flujo. En Express, use safeParse en middlewares de validación para capturar errores y retornar 400/422 con mensajes claros al cliente. Use parse en código interno donde una falla de validación representa un error crítico que debe propagarse.

## 6. Dé dos ejemplos de reglas de dominio que deben probarse con tests unitarios (no sólo validación de entrada)

*Ejemplo 1: Cálculo de precio de pizza* - El precio debe calcularse según tamaño base (S=$10, M=$15, L=$20) más $2 por topping adicional. Test unitario debe verificar: pizza M con 3 toppings = $21. *Ejemplo 2: Cancelación de pedido* - No se puede cancelar un pedido con status "delivered" o "cancelled". Test unitario debe verificar que intentar cancelar un pedido entregado retorna error de negocio, mientras que cancelar un pedido "pending" o "preparing" debe cambiar el status a "cancelled". Estas reglas van más allá de validar tipos de datos.

## 7. ¿Qué malos olores suele haber en suites de tests? Dé 3 ejemplos (naming, duplicación, asserts débiles, mocks frágiles, etc.)

*1. Naming ambiguo: Tests con nombres como "test1" o "funciona correctamente" no describen qué se está probando. Mejor: "debería retornar 404 cuando el pedido no existe". **2. Duplicación excesiva: Repetir setup/teardown idéntico en cada test en lugar de usar helpers o beforeEach, violando DRY. **3. Aserciones débiles: Usar expect(result).toBeTruthy() en lugar de comparaciones exactas como expect(result.id).toBe('123'), permitiendo que bugs pasen desapercibidos. **4. Mocks frágiles*: Mockear implementaciones internas en lugar de interfaces, haciendo que tests se rompan con refactors que no cambian comportamiento.

## 8. ¿Cómo trazará criterios de aceptación ↔ tests? Incluya un mini ejemplo de tabla con 2 filas

| ID Criterio | Descripción | Tests Asociados |
|-------------|-------------|-----------------|
| CA-01 | Como cliente puedo crear un pedido con items válidos y recibo confirmación con ID | POST /orders - debería crear pedido exitosamente, OrderService.createOrder - debería generar ID único |
| CA-02 | Como cliente no puedo cancelar un pedido ya entregado y recibo error 409 | POST /orders/:id/cancel - debería retornar 409 para pedido entregado, OrderService.cancelOrder - debería lanzar error si status es delivered |

Esta matriz permite verificar que cada requisito funcional tiene tests correspondientes y facilita auditorías de cobertura funcional.

## 9. ¿Por qué no perseguir 100% de cobertura a toda costa? Mencione riesgos/limitaciones

Perseguir 100% de cobertura puede llevar a *tests superficiales* que solo ejecutan código sin verificar comportamiento correcto, creando falsa seguridad. También genera *costo/beneficio negativo* al gastar tiempo testeando código trivial (getters/setters, configuración) en lugar de lógica compleja. Además, *cobertura no garantiza calidad*: puedes tener 100% de líneas cubiertas pero no probar casos edge, condiciones de carrera o integraciones. Es mejor priorizar cobertura alta en lógica de negocio crítica y aceptar menor cobertura en código boilerplate o glue code.

## 10. Defina y dé un ejemplo de helper/builder para tests

Un *helper* es una función auxiliar que reduce duplicación en tests. Un *builder* es un patrón que facilita crear objetos complejos para tests. Ejemplo:

typescript
// test-helpers.ts
export class OrderBuilder {
  private order = {
    id: '1',
    items: [{ size: 'M', toppings: ['cheese'] }],
    status: 'pending',
    address: '123 Main Street',
    totalPrice: 15
  };

  withStatus(status: string) {
    this.order.status = status;
    return this;
  }

  withItems(items: any[]) {
    this.order.items = items;
    return this;
  }

  build() {
    return { ...this.order };
  }
}

// Uso en test
const deliveredOrder = new OrderBuilder().withStatus('delivered').build();


Este patrón hace tests más legibles y mantenibles al centralizar la construcción de datos de prueba.