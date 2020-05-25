#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <assert.h>
#include <float.h>
#include <iostream>
#include <vector>
#include <GLUT/glut.h>
using namespace std;

#define dim 300
#define min -0.9
#define max 0.9
#define PI 3.1415926535897932384626433832795
unsigned char prevKey;

class GrilaCarteziana
{
private:
    int n;

public:
    GrilaCarteziana()
    {
        n = 0;
    }

    GrilaCarteziana(int marime)
    {
        n = marime;
    }

    void DrawGrid()
    {
        glColor3f(0.3, 0.3, 0.3); // gri
        glBegin(GL_LINES);

        float cellSize = (max - min) / n;

        for (int i = 0; i <= n; i++)
        {
            glVertex2d(min + cellSize * i, min);
            glVertex2d(min + cellSize * i, max);
        }
        for (int i = 0; i <= n; i++)
        {
            glVertex2d(min, min + cellSize * i);
            glVertex2d(max, min + cellSize * i);
        }

        glEnd();
    }

    void writePixel(int row, int col, float cellSize)
    {
        float range = max - min;
        float x = min + col * cellSize;
        float y = max - row * cellSize;
        if (x >= min && x <= max && y >= min && y <= max)
        {
            glVertex2f(x, y);
        }
    }

    void AfisarePuncteCerc3(int x, int y)
    {
        float range = max - min;
        float cellSize = range / n;
        glEnable(GL_POINT_SMOOTH);
        glEnable(GL_BLEND);
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

        glColor3f(0.3, 0.3, 0.3); // gri
        glBegin(GL_POINTS);
        writePixel(-x + n, y, cellSize);
        writePixel(-x + n, y + 1, cellSize);
        writePixel(-x + n, y - 1, cellSize);
        // writePixel(x+1, y, cellSize);
        // writePixel(x-1, y, cellSize);

        glEnd();
    }
    void AfisarePuncteElipsa(int x, int y)
    {
        // float X = (1.6 / (float)n) * x;
        // float Y = (1.6 / (float)n) * y;

        // float ox;
        // float oy;

        // glColor3d(1.0, 0.1, 0.1);
        // glPolygonMode(GL_FRONT, GL_FILL);
        // glBegin(GL_LINE_STRIP);
        // cout<<X<<" "<<Y<<endl;
        // // for (float i = 0; i < 2.0 * PI; i += PI / 12.0)
        // // {
        //     glVertex2f(X , Y );
        // // }

        // glEnd();
    }
    void AfisareElipsa(int a, int b)
    {
        int x = 0, y = b;
        double d1 = b * b - a * a * b + a * a / 4.0;
        double d2;
        AfisarePuncteElipsa(x, y);
        while (a * a * (y - 0.5) > b * b * (x + 1))
        {
            if (d1 < 0)
            {
                d1 += b * b * (2 * x + 3);
                x++;
            }
            else
            {
                d1 += b * b * (2 * x + 3) + a * a * (-2 * y + 2);
                x++;
                y--;
            }
            AfisarePuncteElipsa(x, y);
        }
        d2 = b * b * (x + 0.5) * (x + 0.5) + a * a * (y - 1) * (y - 1) - a * a * b * b;
        while (y > 0)
        {
            if (d2 < 0)
            {
                d2 += b * b * (2 * x + 2) + a * a * (-2 * y + 3);
                x++;
                y--;
            }
            else
            {
                d2 += a * a * (-2 * y + 3);
                y--;
                // este selectat S d2 += a*a*(-2*y+3); y--;
            }
            AfisarePuncteElipsa(x, y);
        }
    }
    void DrawCircle(int raza){

    }
    void AfisareCerc4(int raza)
    {
        float range = max - min;
        float cellSize = range / n;
        glEnable(GL_POINT_SMOOTH);
        glEnable(GL_BLEND);
        glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

        glColor3f(0.3, 0.3, 0.3); // gri
        glBegin(GL_POINTS);
        writePixel(n, 0, cellSize);

        glEnd();

        DrawCircle(raza);
        int x = 0, y = raza;
        int d = 1 - raza;
        int dE = 3, dSE = -2 * raza + 5;
        AfisarePuncteCerc3(x, y);
        while (y > x)
        {
            if (d < 0)
            {
                d += dE;
                dE += 2;
                dSE += 2;
            }
            else
            {
                d += dSE;
                dE += 2;
                dSE += 4;
                y--;
            }
            x++;
            AfisarePuncteCerc3(x, y);
        }
    }
};

void Init(void)
{

    glClearColor(1.0, 1.0, 1.0, 1.0);

    glLineWidth(1);

    glPointSize(12);

    glPolygonMode(GL_FRONT, GL_LINE);
}

void Reshape(int w, int h)
{
    glViewport(0, 0, (GLsizei)w, (GLsizei)h);
}
void Display1()
{

    GrilaCarteziana grila = GrilaCarteziana(20);
    grila.DrawGrid();
    grila.AfisareCerc4(17);
    // grila.showCircle(9);
}
void Display2()
{
    GrilaCarteziana grila = GrilaCarteziana(26);
    grila.DrawGrid();
    grila.AfisareElipsa(13, 13);

    // grila.fillElipse(2, 3, 5, 3);
}
void Display(void)
{
    glClear(GL_COLOR_BUFFER_BIT);
    switch (prevKey)
    {
    case '1':
        Display1();
        break;
    case '2':
        Display2();
        break;
    default:
        break;
    }
    glFlush();
}
void KeyboardFunc(unsigned char key, int x, int y)
{
    printf("Ati tastat <%c>. Mouse-ul este in pozitia %d, %d.\n",
           key, x, y);
    prevKey = key;
    if (key == 27)
        exit(0);
    glutPostRedisplay();
}

void MouseFunc(int button, int state, int x, int y)
{
}

int main(int argc, char **argv)
{
    glutInit(&argc, argv);

    glutInitWindowSize(dim, dim);

    glutInitWindowPosition(100, 100);

    glutInitDisplayMode(GLUT_SINGLE | GLUT_RGB);

    glutCreateWindow(argv[0]);

    Init();

    glutReshapeFunc(Reshape);

    glutKeyboardFunc(KeyboardFunc);

    glutMouseFunc(MouseFunc);

    glutDisplayFunc(Display);

    glutMainLoop();

    return 0;
}
