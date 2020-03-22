import numpy

def suma1(l, u, p, i):
    sum = 0
    for k in range(0, p):
        sum += l[p][k]*u[k][i]
    return sum

def suma2(l, u, p, i):
    sum = 0
    for k in range(0, p):
        sum += l[i][k]*u[k][p]
    return sum

def suma3(A, X, i):
    sum = 0
    for j in range(0, i):
        sum += A[i][j]*X[j][0]
    return sum


def suma4(U, X, i):
    sum = 0
    for j in range(i, len(U)):
        sum += U[i][j]*X[j][0]
    return sum

def decomp(A):
    L = numpy.zeros(shape=(len(A), len(A)))
    U = numpy.zeros(shape=(len(A), len(A)))
    for k, v in enumerate(L):
        for kk, vv in enumerate(v):
            if k == kk:
                L[k][kk] = 1
    for p in range(0, len(A)):
        for i in range(p, len(A)):
            U[p][i] = A[p][i]-suma1(L, U, p, i)
        for i in range(p+1, len(A)):
            L[i][p] = (A[i][p]-suma2(L, U, p, i))/U[p][p]
    return [L, U]


def sol(A, B):
    [L, U] = decomp(A)
    Y = numpy.zeros(shape=(len(A), 1))
    X = numpy.zeros(shape=(len(A), 1))
    for i in range(0, len(Y)):
        Y[i][0] = (B[i][0]-suma3(L, Y, i))
    for i in range(len(A)-1, -1, -1):
        X[i][0] = (Y[i][0]-suma4(U, X, i))/U[i][i]
    return X


def rev(A, show_print=True):
    [L, U] = decomp(A)
    Ainvers = numpy.zeros(shape=(len(A), len(A)))
    for j in range(0, len(A)):
        ej = numpy.zeros(shape=(len(L), 1))
        ej[j] = 1
        yj = sol(L, ej)
        x = sol(U, yj)
        for i in range(0, len(x)):
            Ainvers[i][j] = x[i][0]
    if(show_print):
        print(Ainvers)
    return Ainvers

def init():
    A = numpy.array([ [2.5, 2, 2], [5, 6, 5], [5, 6, 6.5]])
    B = numpy.array(([[2], [2], [2]]))
    [L, U] = decomp(A)
    x = sol(A, B)
    print("A = \n",A)
    print("L = \n",L)
    print("U = \n",U)
    print("\n")
    print("norma =", numpy.linalg.norm(A*x-B, 2))
    print("det(A) =", numpy.linalg.det(L)*numpy.linalg.det(U))

    print("norma 1 =", numpy.linalg.norm(x-numpy.linalg.inv(A)*B))
    print("norma 2 =",numpy.linalg.norm(rev(A, False)-numpy.linalg.inv(A)))
    X = sol(A, B)
    print("A = \n",A)
    print("X = \n",X)
    print("B = \n",B)
    print("\n")
    print("inversa:")

    rev(A)

init()