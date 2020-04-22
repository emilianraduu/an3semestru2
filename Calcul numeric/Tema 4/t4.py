import numpy, math
ERROR_CODE = -1
K_MAX = 10000

def getPrecision():
    u = 1.0
    m = 1

    while 1.0 + u != 1:
        u = 0.1 * u
        m += 1

    return u

epsilon = getPrecision()


def generateMatrixA(file):
    try:
        f = open(file, 'r')
    except:
        print('[ERROR] File not found.')
        return ERROR_CODE
    lines = f.read().split('\n')
    n = int(lines[0])
    diag = [0 for i in range(0, n)]
    mat = [{} for i in range(0, n)]
    for line in lines[1:]:
        if line.strip() == '':
            continue
        info = line.split(',')
        linie_mat = int(info[1])
        val_mat = float(info[0])
        col_mat = int(info[2])
        mat[linie_mat][col_mat] = val_mat
        if linie_mat == col_mat:
            diag[linie_mat] += 1
    if 0 in diag:
        print("[ERROR] Matrix doesn't have the diagonal not null.")
        return ERROR_CODE
    for i in range(0, len(mat)):
        mat[i] = dict(sorted(mat[i].items()))
    return mat

def generateMatrixB(file):
    try:
        f = open(file, 'r')
    except:
        print('[ERROR] File not found.')
        return ERROR_CODE
    lines = f.read().split('\n')
    mat = []
    for line in lines[1:]:
        if line.strip() == '':
            continue
        mat.append(float(line))
    return mat

def gaussSeidel(a, b):
    n = len(b)
    xc = xp = [0 for i in b]
    k = 0
    dx = epsilon
    while dx >= epsilon and k <= K_MAX and dx <= pow(10, 8): 
        xp = xc
        for index,line in enumerate(a):
            sum1 = 0.0
            sum2 = 0.0
            for j in range(1,index-1):
                if j in a[index]:
                    sum1 += a[index][j] * xc[j]
            for j in range(index+1,n):
                if j in a[index]:
                    sum2 += a[index][j] * xp[j]
            xc[index] = (b[index] - sum1 - sum2)/a[index][index]
        # euclidian_sum = 0
        dx = numpy.linalg.norm(numpy.subtract(xc,xp))
        # for i in range(0,len(xc)):
        #     euclidian_sum+= pow(xc[i] - xp[i],2)
        # dx = math.sqrt(euclidian_sum)
        k=k+1

    if dx < epsilon:
        return xc
    else:
        return ERROR_CODE
def init():
    my_a = generateMatrixA('a_5.txt')
    my_b = generateMatrixB('b_5.txt')
    if my_a != ERROR_CODE and my_b != ERROR_CODE:
        result = gaussSeidel(my_a,my_b)
        print(result)
    else: 
        print("[ERROR] One or more errors occured.")

init()