#include <iostream>
#include <GLUT/glut.h>
#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <fstream>

using namespace std;

int HEIGHT = 300;
int WIDTH = 300;

unsigned char prevKey;

struct VARF
{
    int x, y;
};
struct MUCHIE
{
    VARF vi, vf;
};
struct POLIGON
{
    MUCHIE muchii[];
};
struct INTERSECTIE
{
    int ymax;
    double xmin;
    double ratia;
};
struct INTERSECTII
{
    INTERSECTIE i[];
};

int DOM_SCAN[100];

class GrilaCarteziana
{
    int n;
    int m;
    bool M[100][100];

public:
    GrilaCarteziana()
    {
        n = 8;
        m = 8;
        clearGrid();
    }
    GrilaCarteziana(int x)
    {
        n = x;
        m = x;
        clearGrid();
    }
    GrilaCarteziana(int x, int y)
    {
        n = x;
        m = y;
        clearGrid();
    }

    void writePixel(int x, int y)
    {
        M[x][y] = M[x][y] xor 1;

        float raza = 0.6 / fmin(n, m);
        float pi = 3.1415926f;
        float ox;
        float oy;

        glPolygonMode(GL_FRONT, GL_FILL);
        glBegin(GL_POLYGON);

        ox = (-0.8 + (0.8 / (0.8 * (n / 1.6))) * (x - 1));
        oy = (0.8 - (0.8 / (0.8 * (n / 1.6))) * (y - 1));

        for (float i = 0; i < 2 * pi; i += pi / 6)
        {
            glVertex2f(ox + raza * cos(i), oy + raza * sin(i));
        }

        glEnd();
    }

    void writeThickPixel(int x, int y)
    {
        M[x][y] = M[x][y] xor 1;

        float raza = 0.6 / fmin(n, m);
        float pi = 3.1415926f;
        float ox;
        float oy;

        glPolygonMode(GL_FRONT, GL_FILL);
        glBegin(GL_POLYGON);

        ox = (-0.8 + (0.8 / (0.8 * (n / 1.6))) * (x - 1));
        oy = (0.8 - (0.8 / (0.8 * (n / 1.6))) * (y - 1));

        for (float i = 0; i < 2 * pi; i += pi / 6)
        {
            glVertex2f(ox + raza * cos(i), oy + raza * sin(i));
        }

        glEnd();

        glBegin(GL_POLYGON);

        ox = (-0.8 + (0.8 / (0.8 * (n / 1.6))) * (x - 2));
        oy = (0.8 - (0.8 / (0.8 * (n / 1.6))) * (y - 1));

        for (float i = 0; i < 2 * pi; i += pi / 6)
        {
            glVertex2f(ox + raza * cos(i), oy + raza * sin(i));
        }

        glEnd();

        glBegin(GL_POLYGON);

        ox = (-0.8 + (0.8 / (0.8 * (n / 1.6))) * (x));
        oy = (0.8 - (0.8 / (0.8 * (n / 1.6))) * (y - 1));

        for (float i = 0; i < 2 * pi; i += pi / 6)
        {
            glVertex2f(ox + raza * cos(i), oy + raza * sin(i));
        }

        glEnd();
    }

    void clearGrid()
    {
        for (int i = 1; i <= n; i++)
            for (int j = 1; j <= m; j++)
                M[i][j] = 0;
    }

    void displayGrid()
    {
        float pas_linie = 1.6 / (float)n;
        float pas_coloana = 1.6 / (float)m;

        glColor3d(0.5, 0.5, 0.5);

        glPolygonMode(GL_FRONT, GL_LINE);
        glBegin(GL_LINES);
        for (float i = 0.0; i <= pas_linie * (n + 1); i += pas_linie)
        {
            glVertex2f(-0.8, 0.8 - i);
            glVertex2f(0.8, 0.8 - i);
        }

        for (float j = 0.0; j <= pas_coloana * (m + 1); j += pas_coloana)
        {
            glVertex2f(-0.8 + j, 0.8);
            glVertex2f(-0.8 + j, -0.8);
        }

        glEnd();
    }

    void drawCircle(int raza, int cadran)
    {
        float r = (1.6 / (float)n) * raza;
        float pi = 3.1415926f;
        float ox;
        float oy;
        float limita = ((2.0 * pi) / 4.0f) * cadran;
        float start;
        switch (cadran)
        {
        case 1:
            start = 0.0;
            break;
        case 2:
            start = pi / 2.0;
            break;
        case 3:
            start = pi;
            break;
        default:
            start = (3 * pi) / 2.0;
        }

        ox = (-0.8 + (0.8 / (0.8 * (n / 1.6))) * (n / 2 - 1));
        oy = (0.8 - (0.8 / (0.8 * (n / 1.6))) * (n / 2 - 1));

        glColor3d(1.0, 0.1, 0.1);
        glPolygonMode(GL_FRONT, GL_FILL);
        glBegin(GL_LINE_STRIP);

        for (float i = start; i < limita; i += pi / 12.0)
        {
            glVertex2f(ox + r * cos(i), oy + r * sin(i));
        }

        glEnd();
    }

    void showCirclePoints(int x, int y, int cadran)
    {
        if (x < y)
        {
            if (cadran == 1)
            {
                writeThickPixel((n / 2) + y, (n / 2) - x);
            }
            else if (cadran == 2)
            {
                writeThickPixel((n / 2) - y, (n / 2) - x);
            }
            else if (cadran == 3)
            {
                writeThickPixel((n / 2) - y, (n / 2) + x);
            }
            else
            {
                writeThickPixel((n / 2) + y, (n / 2) + x);
            }
        }
        else
        {
            if (cadran == 1)
            {
                writeThickPixel((n / 2) + x, (n / 2) - y);
            }
            else if (cadran == 2)
            {
                writeThickPixel((n / 2) - x, (n / 2) - y);
            }
            else if (cadran == 3)
            {
                writeThickPixel((n / 2) - x, (n / 2) + y);
            }
            else
            {
                writeThickPixel((n / 2) + x, (n / 2) + y);
            }
        }
    }

    void showCircle(int raza)
    {
        int x = 0, y = raza;
        double d = 1 - raza;
        int dE = 3, dSE = -2 * raza + 5;

        int cadran;

        if (y > x)
            cadran = 1;
        showCirclePoints(x, y, cadran);
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
            showCirclePoints(x, y, cadran);
        }

        drawCircle(raza, cadran);
    }

    void drawElipse(int x, int y)
    {
        float X = (1.6 / (float)n) * x;
        float Y = (1.6 / (float)n) * y;
        float pi = 3.1415926f;
        float ox;
        float oy;

        glColor3d(1.0, 0.1, 0.1);
        glPolygonMode(GL_FRONT, GL_FILL);
        glBegin(GL_LINE_STRIP);

        for (float i = 0; i < 2.0 * pi; i += pi / 12.0)
        {

            glVertex2f(ox + X * cos(i), oy + Y * sin(i));
        }

        glEnd();
    }

    void showElipse(int a, int b)
    {
        int x = 0;
        int y = b;
        float d1 = b * b - a * a * b + a * a / 4.0;
        float d2;
        showElipsePoints(x, y);
        while (a * a * (y - 0.5) > b * b * (x + 1))
        {
            if (d1 < 0)
            {
                d1 += b * b * (2 * x + 3);
                x++;
            }
            else
            {
                d1 += b * b * (2 * x + 3) + a * a * (2 * y - 2);
                x++;
                y--;
            }
            showElipsePoints(x, y);
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
            }
            showElipsePoints(x, y);
        }
    }

    void fillElipse(int x0, int y0, int a, int b)
    {
        int xi = 0, x = 0, y = b;
        double fxpyp = 0.0;
        double deltaE, deltaSE, deltaS;

        showElipsePoints(x, y);
        while (a * a * (y - 0.5) > b * b * (x + 1))
        {
            deltaE = b * b * (2 * x + 1);
            deltaSE = b * b * (2 * x + 1) + a * a * (-2 * y + 1);
            if (fxpyp + deltaE <= 0.0)
            {
                fxpyp += deltaE;
                x++;
                showElipsePoints(x, y);
            }
            else if (fxpyp + deltaSE <= 0.0)
            {
                fxpyp += deltaSE;
                x++;
                y--;
                showElipsePoints(x, y);
            }
            showElipsePoints(x, y);
        }
        while (y > 0)
        {
            deltaSE = b * b * (2 * x + 1) + a * a * (-2 * y + 1);
            deltaS = a * a * (-2 * y + 1);
            if (fxpyp + deltaSE <= 0.0)
            {
                fxpyp += deltaSE;
                x++;
                y--;
            }
            else
            {
                fxpyp += deltaS;
                y--;
            }
            showElipsePoints(x, y);
        }

        drawElipse(a, b);
    }

    void showElipsePoints(int x, int y)
    {
        int i;
        int j;
        for (i = 0; i <= x; i++)
            for (j = 0; j <= y; j++)
            {
                writePixel((n / 2) - i + 1, (n / 2) + j + 1);
            }
    }
};

void Display1()
{

    GrilaCarteziana grila = GrilaCarteziana(20);
    grila.displayGrid();

    grila.showCircle(9);
}
void Display2()
{
    GrilaCarteziana grila = GrilaCarteziana(16);
    grila.displayGrid();

    grila.fillElipse(2, 3, 5, 3);
}

void Init(void)
{
    glClearColor(1.0, 1.0, 1.0, 1.0);
    glLineWidth(2);
    glPointSize(4);
    glPolygonMode(GL_FRONT, GL_LINE);
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

void Reshape(int w, int h)
{
    //    printf("Call Reshape : latime = %d, inaltime = %d\n", w, h);
    int wid = h * (float)WIDTH / HEIGHT;
    int hei = w * (float)HEIGHT / WIDTH;
    int left = w - wid;
    int up = h - hei;
    if (w > h)
        glViewport(0, 0, wid, h);
    else
        glViewport(0, 0, w, hei);
}
void MouseFunc(int button, int state, int x, int y)
{
    //    printf("Call MouseFunc : ati %s butonul %s in pozitia %d %d\n",
    //       (state == GLUT_DOWN) ? "apasat" : "eliberat",
    //       (button == GLUT_LEFT_BUTTON) ?
    //       "stang" :
    //       ((button == GLUT_RIGHT_BUTTON) ? "drept": "mijlociu"),
    //       x, y);
}

int main(int argc, char **argv)
{
    glutInit(&argc, argv);
    glutInitWindowSize(WIDTH, HEIGHT);
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