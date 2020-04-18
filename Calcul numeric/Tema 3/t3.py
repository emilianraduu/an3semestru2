ERROR_CODE = -1

def generateMatrix(file):
    try:
        f = open(file, 'r')
    except:
        print('[ERROR] File not found.')
        return ERROR_CODE
    lines = f.read().split('\n')
    n = int(lines[0])
    mat = [{} for i in range(0, n)]
    zeros = [0 for i in range(0, n)]
    for line in lines[1:]:
        if line.strip() == '':
            continue
        info = line.split(',')
        linie_mat = int(info[1])
        val_mat = float(info[0])
        col_mat = int(info[2])
        mat[linie_mat][col_mat] = val_mat
        zeros[linie_mat] += 1
        if zeros[linie_mat] > 10:
            # print('[ERROR] Line ' + info[1] + ' of matrix ' + file +  ' has more than 10 elements != 0.')
            pass
    for i in range(0, len(mat)):
        mat[i] = dict(sorted(mat[i].items()))
    return mat

def aPlusb(a, b):
    suma = a
    for i in range(0, len(b)):
        for key in b[i].keys():
            if key in suma[i].keys():
                suma[i][key] += b[i][key]
            else:
                suma[i][key] = b[i][key]

    for i in range(0, len(suma)):
        suma[i] = dict(sorted(suma[i].items()))
    return suma

def checkSum(my_a, my_b):
    check = True
    a_plus_b = generateMatrix('aplusb.txt')
    my_a_plus_b = aPlusb(my_a, my_b)
    for i in range(0, len(my_a_plus_b)): 
        if my_a_plus_b[i] != a_plus_b[i]:
            check = False
    return check

def aTimesb(a, b):
    produs = [{} for i in range(0, len(a))]
    for i in range(0, len(a)):
        for j in range(0, len(a)):
            rez = 0
            for key in a[i].keys():
                if j in b[key].keys():
                    rez += a[i][key] * b[key][j]
            if rez != 0:
                produs[i][j] = rez
    for i in range(0, len(produs)):
        produs[i] = dict(sorted(produs[i].items()))
    return produs

def checkTimes(my_a, my_b):
    check = True
    a_times_b = generateMatrix('aorib.txt')
    my_a_times_b = aTimesb(my_a, my_b)
    for i in range(0, len(my_a_times_b)):  # verificare a ori b
        if my_a_times_b[i] != a_times_b[i]:
            check = False
    return check

def init():
    my_a = generateMatrix('a.txt')
    my_b = generateMatrix('b.txt')
    if my_a != ERROR_CODE and my_b != ERROR_CODE:
        if checkTimes(my_a, my_b) == True:
                    print('[SUCCESS] Multiplication is valid.')
        else:
            print('[ERROR] Multiplication failed.')
        if checkSum(my_a, my_b) == True:
            print('[SUCCESS] Addition is valid.')
        else:
            print('[ERROR] Addition failed.')
    else:
        print('[EXECUTION FAILED] One or multiple errors occured.')
        return ERROR_CODE
   
init()