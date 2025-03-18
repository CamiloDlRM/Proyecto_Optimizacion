import numpy as np
import matplotlib.pyplot as plt
from matplotlib.patches import Polygon
from scipy.spatial import ConvexHull

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
        if a*x + b*y > c + 1e-10:  # Pequeña tolerancia numérica
            return False
    
    return True

def graficar_region_factible(restricciones, punto=None):
    """
    Grafica la región factible dadas las restricciones y un punto específico.
    
    Parámetros:
    restricciones: lista de tuplas (a, b, c) donde cada restricción es de la forma ax + by <= c
    punto: tupla (x, y) que representa el punto a graficar
    """
    plt.figure(figsize=(10, 8))
    
    # Definir límites del gráfico (ajustar según problema)
    x_max = 10
    y_max = 10
    
    # Crear una malla de puntos
    x = np.linspace(0, x_max, 1000)
    
    # Graficar cada restricción
    for i, (a, b, c) in enumerate(restricciones):
        if b != 0:
            y = (c - a * x) / b
            plt.plot(x, y, label=f'{a}x + {b}y = {c}')
        else:
            # Si b=0, entonces es una línea vertical
            plt.axvline(x=c/a, label=f'{a}x = {c}')
    
    # Graficar restricciones de no negatividad
    plt.axvline(x=0, color='black', linestyle='-', label='x = 0')
    plt.axhline(y=0, color='black', linestyle='-', label='y = 0')
    
    # Identificar la región factible
    vertices = []
    
    # Añadir el origen
    if verificar_factibilidad(0, 0, restricciones):
        vertices.append([0, 0])
    
    # Encontrar intersecciones entre restricciones
    n = len(restricciones)
    
    # Intersecciones con los ejes
    for a, b, c in restricciones:
        # Intersección con eje x (y=0)
        if a != 0:
            x_intersect = c / a
            if x_intersect >= 0 and verificar_factibilidad(x_intersect, 0, restricciones):
                vertices.append([x_intersect, 0])
        
        # Intersección con eje y (x=0)
        if b != 0:
            y_intersect = c / b
            if y_intersect >= 0 and verificar_factibilidad(0, y_intersect, restricciones):
                vertices.append([0, y_intersect])
    
    # Intersecciones entre restricciones
    for i in range(n):
        a1, b1, c1 = restricciones[i]
        for j in range(i+1, n):
            a2, b2, c2 = restricciones[j]
            
            # Resolver el sistema de ecuaciones
            det = a1*b2 - a2*b1
            if abs(det) > 1e-10:  # Si no son paralelas
                x_intersect = (c1*b2 - c2*b1) / det
                y_intersect = (a1*c2 - a2*c1) / det
                
                # Verificar que el punto satisface todas las restricciones
                if verificar_factibilidad(x_intersect, y_intersect, restricciones):
                    vertices.append([x_intersect, y_intersect])
    
    # Convertir a array para usar con ConvexHull
    if len(vertices) >= 3:
        vertices = np.array(vertices)
        try:
            hull = ConvexHull(vertices)
            # Extraer los vértices del casco convexo
            vertices_ordenados = vertices[hull.vertices]
            
            # Crear polígono
            polygon = Polygon(vertices_ordenados, alpha=0.4, color='blue')
            plt.gca().add_patch(polygon)
        except Exception as e:
            print(f"Error al crear el casco convexo: {e}")
    
    # Graficar el punto si se proporciona
    if punto:
        plt.scatter(punto[0], punto[1], color='red', s=100, zorder=5)
        plt.text(punto[0] + 0.1, punto[1] + 0.1, f'({punto[0]}, {punto[1]})', fontsize=12)
    
    # Configurar gráfico
    plt.grid(True)
    plt.xlim(0, x_max)
    plt.ylim(0, y_max)
    plt.xlabel('x')
    plt.ylabel('y')
    plt.title('Región Factible')
    plt.legend()
    plt.tight_layout()
    plt.show()


