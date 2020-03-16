import math
import random
import numpy as np

def precision():
    u=0.1
    exp=1
    while(1.0+u!=1.0):
        exp=u
        u=u/10
    return exp

pm=precision()

print(pm)

print((pm+1)+pm,(pm+pm)+1,(pm+1)+pm==(pm+pm)+1)

n=4
Matix_A=np.array([[random.randint(0,1) for i in range(n)] for i in range(n)])
Matix_B=np.array([[random.randint(0,1) for i in range(n)] for i in range(n)])

print('A = ')
print(Matix_A)
print('B = ')
print(Matix_B)


sub_matrix_dim=math.ceil(n/math.floor(math.log(n,2)))

def create_sub_matrix_a(A,sub_matrix_dim):
    submatrix=[]
    counter=0
    while((sub_matrix_dim*counter)<len(A)):
        submatrix.append(A[:,(sub_matrix_dim*counter):(sub_matrix_dim*(counter+1))])
        counter+=1
    return submatrix


def create_sub_matrix_b(B,sub_matrix_dim):
    submatrix=[]
    counter=0
    while((sub_matrix_dim*counter)<len(B)):
        submatrix.append(B[(sub_matrix_dim*counter):(sub_matrix_dim*(counter+1)),:])
        counter+=1
    return submatrix

def create_sub_matrix_c(sub_A,sub_B):
    sub_C=[]
    for i in range(len(sub_A)):
        sub_C.append(calculate_product(sub_A[i],sub_B[i]))
    return sub_C


def calculate_product(sub_A,sub_B):
    result=[]
    for i in range(len(sub_A)):
        row=[0 for l in range(len(sub_A))]
        for j in range(len(sub_A[i])):
            if sub_A[i][j]==1:
                for k in range(len(row)):
                    if(row[k]==1 or sub_B[j][k]==1):
                        row[k]=1
        result.append(row)
    return result

def calculate_c(sub_C):
    dim=len(sub_C[0])
    C=[[1 for i in range(dim)] for j in range(dim)]
    for i in range(dim):
        for j in range(dim):
            if 0 in sub_C[:,i,j]:
                C[i][j]=0

    return C


sub_matrix_A=create_sub_matrix_a(Matix_A,sub_matrix_dim)
sub_matrix_B=create_sub_matrix_b(Matix_B,sub_matrix_dim)
sub_matrix_C=np.array(create_sub_matrix_c(sub_matrix_A,sub_matrix_B))

C=np.array(calculate_c(sub_matrix_C))
print('C = ')
print(C)
