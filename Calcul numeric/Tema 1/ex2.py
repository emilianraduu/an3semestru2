u = 1.0
exp = 1

while 1.0 + u != 1.0:
    u = 0.1 * u
    print(u)
    exp += 1

precision = exp - 1
u = 1.0
while precision:
    u = 0.1 * u
    precision -= 1

x = 1.000000000003
y = u
z = u

if (x + y) + z != x + (y + z):
    print("yes")

if (x * y) * z != x * (y * z):
    print("no")
