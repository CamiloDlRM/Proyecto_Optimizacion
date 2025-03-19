import time
import numpy as np
import scipy.sparse as sparse
# Matrix operations functions
def valores(n, m, densidad):
    valores = np.arange(-1000, 1000)
    p = [(1-densidad) / (len(valores)-1)] * int((len(valores))/2) + [densidad] + [(1-densidad) / (len(valores)-1)] * int((len(valores)-1)/2)
    matriz = np.random.choice(valores, size=(n, m), p=p)
    return matriz

# Convierte a matriz dispersa por método propio
def matrices_esparse(matriz):
    filas = []
    columnas = []
    valores = []
    for i in range(len(matriz)):
        for j in range(len(matriz[i])):
            if matriz[i][j] != 0:
                filas.append(i)
                columnas.append(j)
                valores.append(matriz[i][j])
    return filas, columnas, valores

# Convierte a matriz dispersa por método elegido por el usuario
def convertir_sparse(matriz, metodo):
    metodo = metodo.lower()
    if metodo == "coo":
        return sparse.coo_matrix(matriz)
    elif metodo == "csr":
        return sparse.csr_matrix(matriz)
    elif metodo == "csc":
        return sparse.csc_matrix(matriz)
    else:
        raise ValueError("Método {metodo}' no válido")

# Ejecuta la operación suma para el exp entre densas
def operation_densas_exp(matrizA, matrizB):
    start = time.time()
    np.add(matrizA, matrizB)
    end = time.time()
    return end-start

# Ejecuta la operación suma para el exp con dispersas coo
def operatoin_sparse_exp(matrizA, matrizB):
    start = time.time()
    matrizA = sparse.coo_matrix(matrizA)
    matrizB = sparse.coo_matrix(matrizB)
    matrizA + matrizB
    end = time.time()
    return end-start

# Ejecuta la operación suma para el exp método propio coo
def operation_matriz_exp(matrizA, matrizB):
    start = time.time()
    filas1, columnas1, valores1 = matrices_esparse(matrizA)
    filas2, columnas2, valores2 = matrices_esparse(matrizB)
    fila_sum, columna_sum, valores_sum = [], [], []
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

    end = time.time()
    return end-start

# Ejecuta los tiempos de ejecución de cada uno del experimento
def tiempo_ejecution_exp(n, m):
    matrizA = valores(int(n), int(m), float(0.5))
    matrizB = valores(int(n), int(m), float(0.5))
    
    # Operación método propio
    tiempomat = operation_matriz_exp(matrizA, matrizB)

    # Operación método seleccionado
    tiemposparse = operatoin_sparse_exp(matrizA, matrizB)

    # Operación entre densas
    tiempodensas = operation_densas_exp(matrizA, matrizB)
    
    return tiempomat, tiemposparse, tiempodensas

def tiempo_ejecution_user(n, m, metodo, operacion, densidad):
    matrizA = valores(int(n), int(m), float(densidad))
    matrizB = valores(int(n), int(m), float(densidad))
    matrizC = valores(int(m), int(n), float(densidad))
    
    start = time.time()
    matrizA_sparse = convertir_sparse(matrizA, metodo)
    matrizB_sparse = convertir_sparse(matrizB, metodo)
    matrizC_sparse = convertir_sparse(matrizC, metodo)
    
    if operacion == "multiplicación":
        resultado = matrizA_sparse @ matrizC_sparse
    elif operacion == "suma":
        resultado = matrizA_sparse + matrizB_sparse
    elif operacion == "resta":
        resultado = matrizA_sparse - matrizB_sparse
    elif operacion == "Transpuesta":
        resultado = matrizA_sparse.T   
    end = time.time()
    
    return end-start