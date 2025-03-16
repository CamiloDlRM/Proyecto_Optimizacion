import numpy as np

import matplotlib.pyplot as plt
from matplotlib.patches import Polygon

def evaluar_funcion_costo(x, y):
    """Evalúa la función de costo f(x,y) = 3x + 2y"""
    return 3*x + 2*y

def verificar_factibilidad(x, y, restricciones):
    """
    Verifica si un punto (x,y) cumple con todas las restricciones.
    
    Parámetros:
    x, y: coordenadas del punto
    restricciones: lista de tuplas (a, b, c) donde cada restricción es de la forma ax + by <= c
    
    Retorna:
    bool: True si el punto es factible, False en caso contrario
    """
    if x < 0 or y < 0:
        return False
        
    for a, b, c in restricciones:
        if a*x + b*y > c:
            return False
    
    return True

def graficar_region_factible(restricciones):
    """
    Grafica la región factible dadas las restricciones.
    
    Parámetros:
    restricciones: lista de tuplas (a, b, c) donde cada restricción es de la forma ax + by <= c
    """
    plt.figure(figsize=(10, 8))
    
    # Definir límites del gráfico
    x_min, x_max = 0, 10
    y_min, y_max = 0, 10
    
    # Crear una malla de puntos
    x = np.linspace(x_min, x_max, 1000)
    
    # Graficar cada restricción
    for i, (a, b, c) in enumerate(restricciones):
        if b != 0:
            y = (c - a * x) / b
            plt.plot(x, y, label=f'{a}x + {b}y = {c}')
        else:
            # Si b=0, entonces es una línea vertical
            plt.axvline(x=c/a, label=f'{a}x = {c}')
    
    # Graficar restricciones de no negatividad
    plt.axvline(x=0, color='black', linestyle='-')
    plt.axhline(y=0, color='black', linestyle='-')
    
    # Identificar la región factible
    puntos_factibles = []
    vertices = []
    
    # Añadir las esquinas del primer cuadrante
    vertices.append((0, 0))
    
    # Encontrar intersecciones entre restricciones
    n = len(restricciones)
    for i in range(n):
        a1, b1, c1 = restricciones[i]
        
        # Intersección con los ejes
        if a1 != 0:
            # Intersección con eje x (y=0)
            x_intersect = c1 / a1
            if 0 <= x_intersect <= x_max:
                vertices.append((x_intersect, 0))
        
        if b1 != 0:
            # Intersección con eje y (x=0)
            y_intersect = c1 / b1
            if 0 <= y_intersect <= y_max:
                vertices.append((0, y_intersect))
        
        # Intersecciones entre restricciones
        for j in range(i+1, n):
            a2, b2, c2 = restricciones[j]
            
            # Resolver el sistema de ecuaciones
            det = a1*b2 - a2*b1
            if det != 0:  # Si no son paralelas
                x_intersect = (c1*b2 - c2*b1) / det
                y_intersect = (a1*c2 - a2*c1) / det
                
                # Verificar que el punto está en el primer cuadrante
                if x_intersect >= 0 and y_intersect >= 0:
                    # Verificar que el punto satisface todas las restricciones
                    satisface_todas = True
                    for a, b, c in restricciones:
                        if a*x_intersect + b*y_intersect > c + 1e-10:  # Pequeña tolerancia numérica
                            satisface_todas = False
                            break
                    
                    if satisface_todas:
                        vertices.append((x_intersect, y_intersect))
    
    # Ordenar vértices para formar un polígono
    if len(vertices) > 2:
        # Ordenar vértices en sentido horario alrededor de su centroide
        centroid = np.mean(vertices, axis=0)
        vertices.sort(key=lambda p: np.arctan2(p[1] - centroid[1], p[0] - centroid[0]))
        
        # Crear polígono
        polygon = Polygon(vertices, alpha=0.3, color='blue')
        plt.gca().add_patch(polygon)
    
    # Configurar gráfico
    plt.grid(True)
    plt.xlim(x_min, x_max)
    plt.ylim(y_min, y_max)
    plt.xlabel('x')
    plt.ylabel('y')
    plt.title('Región Factible')
    plt.legend()
    plt.show()

# Ejemplo de uso:
if __name__ == "__main__":
    # Definir el problema
    print("Problema de optimización:")
    print("Minimizar f(x,y) = 3x + 2y")
    print("Sujeto a:")
    print("1. x + y <= 8")
    print("2. x <= 5")
    print("3. y <= 5")
    print("4. x >= 0")
    print("5. y >= 0")
    
    # Definir restricciones (formato: ax + by <= c)
    restricciones = [
        (1, 1, 8),  # x + y <= 8
        (1, 0, 5),  # x <= 5
        (0, 1, 5),  # y <= 5
    ]
    
    # Graficar la región factible
    print("\nGraficando la región factible...")
    graficar_region_factible(restricciones)
    
    # Ejemplo de evaluación de un punto
    x, y = 3, 2
    valor = evaluar_funcion_costo(x, y)
    es_factible = verificar_factibilidad(x, y, restricciones)
    
    print(f"\nEvaluación del punto ({x}, {y}):")
    print(f"f({x}, {y}) = {valor}")
    
    if es_factible:
        print("El punto pertenece a la región factible.")
    else:
        print("El punto NO pertenece a la región factible.")
    
    # Para modificar las restricciones, simplemente cambia la lista 'restricciones'
    # Por ejemplo:
    print("\nModificando restricciones...")
    restricciones_modificadas = [
        (1, 1, 6),  # Cambiado: x + y <= 6
        (1, 0, 5),  # Mantenido: x <= 5
        (0, 1, 5),  # Mantenido: y <= 5
    ]
    
    print("Nuevas restricciones:")
    for i, (a, b, c) in enumerate(restricciones_modificadas):
        print(f"{i+1}. {a}x + {b}y <= {c}")
    
    print("\nGraficando la nueva región factible...")
    graficar_region_factible(restricciones_modificadas)