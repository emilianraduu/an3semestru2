import random
import numpy as np
ERROR_CODE = -1
ε = pow(10, -9)
kmax =  1000000

def generareMatrice(file):
    try:
        f = open(file, 'r')
    except:
        print('[ERROR] File not found.')
        return ERROR_CODE
    lines = f.read().split('\n')
    n = int(lines[0])
    mat = [{} for i in range(0, n)]
    for line in lines[1:]:
        if line.strip() == '':
            continue
        info = line.split(',')
        linie_mat = int(info[1])
        val_mat = float(info[0])
        col_mat = int(info[2])
        mat[linie_mat][col_mat] = val_mat
        mat[col_mat][linie_mat] = val_mat
    return mat


def createMatrix(size):
    if size < 500:
        return None
    matrix = [{} for i in range(0, size)]
    random_seed = [random.randint(1, size-1) for i in range(int(size/10))]
    for i in random_seed:
        random_seed2 = [random.randint(1, size-1) for i in range(int(size/10))]
        seed2 = [k for k in random_seed2 if k > i]
        for j in seed2:
            num = random.randint(0, 100)
            matrix[i][j] = num
            matrix[j][i] = num
    return matrix


def aTimesb(a, b):
    produs = np.zeros((len(a), len(a)))
    for i in range(0, len(a)):
        rez = 0
        for key in a[i].keys():
            rez += a[i][key] * b[i]
            produs[i][key] = rez
    return produs


def verificareSimetrie(matrix):
    simetrica = True
    for index, i in enumerate(matrix):
        for key in i.keys():
            if(matrix[index][key] != matrix[key][index]):
                simetrica = False
    return simetrica


def metodaPuterii(matrix):
    n = len(matrix)
    v = [1 for i in range(0, n)]
    w = aTimesb(matrix, v)
    λ = np.dot(w,v)
    k = 0
    while True:
        wNorm = np.linalg.norm(w)
        v = w * 1/wNorm
        k += 1
        λv = λ * v
        a =np.diff(w,λv.any())
        if(np.linalg.norm(a) > n * ε and k <= kmax):
            break
    return wNorm


def init():
    # matriceRandom = createMatrix(500)
    matriceFisier = generareMatrice('a_300.txt')

    # simetrieRandom = verificareSimetrie(matriceRandom)
    simetrieFisier= verificareSimetrie(matriceFisier)
    if(simetrieFisier):
        # valoareProprieRandom = metodaPuterii(matriceRandom)
        valoareProprieFisier = metodaPuterii(matriceFisier)
        # print("[SUCCESS] Valoare proprie matrice random: ", valoareProprieRandom)
        print("[SUCCESS] Valoare proprie matrice fisier: ",valoareProprieFisier)

    else:
        print('[EROARE] Matricile nu sunt simetrice, bro :(')
        return ERROR_CODE


init()
