import time
import numpy as np
import scipy.sparse as sp
# Matrix operations functions
def valores(n, m, densidad):
    """Generate random matrices with chosen density"""
    valores = np.arange(1000)
    p = [densidad] + [(1-densidad) / (len(valores)-1)] * (len(valores)-1)
    matriz_a = np.random.choice(valores, size=(n, m), p=p)
    matriz_b = np.random.choice(valores, size=(n, m), p=p)
    return matriz_a, matriz_b

def matrices_esparse(matriz):
    """Convert to sparse matrix using custom method"""
    filas = []
    columnas = []
    valores = []
    for i in range(len(matriz)):
        for j in range(len(matriz[i])):
            if matriz[i][j] != 0:
                filas.append(i)
                columnas.append(j)
                valores.append(int(matriz[i][j]))
    return filas, columnas, valores

def convertir_sparse(matriz, metodo):
    """Convert to sparse matrix using method chosen by user"""
    if metodo == "coo":
        return sp.coo_matrix(matriz)
    elif metodo == "csr":
        return sp.csr_matrix(matriz)
    elif metodo == "csc":
        return sp.csc_matrix(matriz)
    else:
        raise ValueError("Método no válido")

def operation_sparse(matriz_a, matriz_b, metodo):
    """Execute operations between sparse matrices using chosen method"""
    start = time.time()
    matriz_a_sparse = convertir_sparse(matriz_a, metodo)
    matriz_b_sparse = convertir_sparse(matriz_b, metodo)
    matriz_a_sparse + matriz_b_sparse  # Sum
    matriz_a_sparse - matriz_b_sparse  # Subtraction
    matriz_a_sparse.T  # Transpose
    matriz_b_sparse.T
    end = time.time()
    return end - start

def operation_densas(matriz_a, matriz_b):
    """Execute operations between dense matrices"""
    start = time.time()
    np.transpose(matriz_a)
    np.transpose(matriz_b)
    np.add(matriz_a, matriz_b)
    np.subtract(matriz_a, matriz_b)
    end = time.time()
    return end - start

def operation_matriz(matriz_a, matriz_b):
    """Execute operations between sparse matrices using custom method"""
    start = time.time()
    filas1, columnas1, valores1 = matrices_esparse(matriz_a)
    filas2, columnas2, valores2 = matrices_esparse(matriz_b)
    fila_sum, columna_sum, valores_sum = [], [], []
    fila_rest, columna_rest, valores_rest = [], [], []

    # Sum
    i, j = 0, 0
    while i < len(filas1) and j < len(filas2):
        if (filas1[i], columnas1[i]) == (filas2[j], columnas2[j]):
            valores_sum.append(valores1[i] + valores2[j])
            fila_sum.append(filas1[i])
            columna_sum.append(columnas1[i])
            i += 1
            j += 1
        elif (filas1[i], columnas1[i]) < (filas2[j], columnas2[j]):
            valores_sum.append(valores1[i])
            fila_sum.append(filas1[i])
            columna_sum.append(columnas1[i])
            i += 1
        else:
            valores_sum.append(valores2[j])
            fila_sum.append(filas2[j])
            columna_sum.append(columnas2[j])
            j += 1

    while i < len(filas1):
        valores_sum.append(valores1[i])
        fila_sum.append(filas1[i])
        columna_sum.append(columnas1[i])
        i += 1

    while j < len(filas2):
        valores_sum.append(valores2[j])
        fila_sum.append(filas2[j])
        columna_sum.append(columnas2[j])
        j += 1

    # Subtraction
    i, j = 0, 0
    while i < len(filas1) and j < len(filas2):
        if (filas1[i], columnas1[i]) == (filas2[j], columnas2[j]):
            valores_rest.append(valores1[i] - valores2[j])
            fila_rest.append(filas1[i])
            columna_rest.append(columnas1[i])
            i += 1
            j += 1
        elif (filas1[i], columnas1[i]) < (filas2[j], columnas2[j]):
            valores_rest.append(valores1[i])
            fila_rest.append(filas1[i])
            columna_rest.append(columnas1[i])
            i += 1
        else:
            valores_rest.append(-valores2[j])
            fila_rest.append(filas2[j])
            columna_rest.append(columnas2[j])
            j += 1

    while i < len(filas1):
        valores_rest.append(valores1[i])
        fila_rest.append(filas1[i])
        columna_rest.append(columnas1[i])
        i += 1

    while j < len(filas2):
        valores_rest.append(-valores2[j])
        fila_rest.append(filas2[j])
        columna_rest.append(columnas2[j])
        j += 1

    # Transpose
    filas1, columnas1 = columnas1, filas1
    filas2, columnas2 = columnas2, filas2
    end = time.time()
    return end - start

def tiempo_ejecution(matriz_a, matriz_b, metodo):
    """Execute and measure execution times for each method"""
    results = {}
    
    # Custom method
    start = time.time()
    filas, columnas, valores = matrices_esparse(matriz_a)
    end = time.time()
    results['tiempo_metodo_propio'] = end - start
    
    # Selected method
    start = time.time()
    matriz_esparse = convertir_sparse(matriz_a, metodo)
    end = time.time()
    results['tiempo_metodo_python'] = end - start
    
    # Operations using custom method
    tiempo = operation_matriz(matriz_a, matriz_b)
    results['tiempo_operacion_metodo_propio'] = tiempo
    
    # Operations using selected method
    tiempo = operation_sparse(matriz_a, matriz_b, metodo)
    results['tiempo_operacion_metodo_python'] = tiempo
    
    # Operations between dense matrices
    tiempo = operation_densas(matriz_a, matriz_b)
    results['tiempo_operacion_densas'] = tiempo
    
    return results