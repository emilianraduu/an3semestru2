
#include <stdlib.h>
#include <stdio.h>
#include <math.h>

#include <GLUT/glut.h>

// dimensiunea ferestrei in pixeli
#define dim 300

unsigned char prevKey;

// concoida lui Nicomede (concoida dreptei)
// $x = a + b \cdot cos(t), y = a \cdot tg(t) + b \cdot sin(t)$. sau
// $x = a - b \cdot cos(t), y = a \cdot tg(t) - b \cdot sin(t)$. unde
// $t \in (-\pi / 2, \pi / 2)$
void Display1() {
    double xmax, ymax, xmin, ymin;
    double a = 1, b = 2;
    double pi = 4 * atan(1.0);
    double ratia = 0.05;
    double t;

    // calculul valorilor maxime/minime ptr. x si y
    // aceste valori vor fi folosite ulterior la scalare
    xmax = a - b - 1;
    xmin = a + b + 1;
    ymax = ymin = 0;
    for (t = -pi / 2 + ratia; t < pi / 2; t += ratia) {
        double x1, y1, x2, y2;
        x1 = a + b * cos(t);
        xmax = (xmax < x1) ? x1 : xmax;
        xmin = (xmin > x1) ? x1 : xmin;

        x2 = a - b * cos(t);
        xmax = (xmax < x2) ? x2 : xmax;
        xmin = (xmin > x2) ? x2 : xmin;

        y1 = a * tan(t) + b * sin(t);
        ymax = (ymax < y1) ? y1 : ymax;
        ymin = (ymin > y1) ? y1 : ymin;

        y2 = a * tan(t) - b * sin(t);
        ymax = (ymax < y2) ? y2 : ymax;
        ymin = (ymin > y2) ? y2 : ymin;
    }

    xmax = (fabs(xmax) > fabs(xmin)) ? fabs(xmax) : fabs(xmin);
    ymax = (fabs(ymax) > fabs(ymin)) ? fabs(ymax) : fabs(ymin);

    // afisarea punctelor propriu-zise precedata de scalare
    glColor3f(1, 0.1, 0.1); // rosu
    glBegin(GL_LINE_STRIP);
    for (t = -pi / 2 + ratia; t < pi / 2; t += ratia) {
        double x1, y1, x2, y2;
        x1 = (a + b * cos(t)) / xmax;
        x2 = (a - b * cos(t)) / xmax;
        y1 = (a * tan(t) + b * sin(t)) / ymax;
        y2 = (a * tan(t) - b * sin(t)) / ymax;

        glVertex2f(x1, y1);
    }
    glEnd();

    glBegin(GL_LINE_STRIP);
    for (t = -pi / 2 + ratia; t < pi / 2; t += ratia) {
        double x1, y1, x2, y2;
        x1 = (a + b * cos(t)) / xmax;
        x2 = (a - b * cos(t)) / xmax;
        y1 = (a * tan(t) + b * sin(t)) / ymax;
        y2 = (a * tan(t) - b * sin(t)) / ymax;

        glVertex2f(x2, y2);
    }
    glEnd();
}

// graficul functiei 
// $f(x) = \bar sin(x) \bar \cdot e^{-sin(x)}, x \in \langle 0, 8 \cdot \pi \rangle$, 
void Display2() {
    double pi = 4 * atan(1.0);
    double xmax = 8 * pi;
    double ymax = exp(1.1);
    double ratia = 0.05;

    // afisarea punctelor propriu-zise precedata de scalare
    glColor3f(1, 0.1, 0.1); // rosu
    glBegin(GL_LINE_STRIP);
    for (double x = 0; x < xmax; x += ratia) {
        double x1, y1;
        x1 = x / xmax;
        y1 = (fabs(sin(x)) * exp(-sin(x))) / ymax;

        glVertex2f(x1, y1);
    }
    glEnd();
}


void Display3() {
    double xmax = 100;
    double ymax = 1;
    double ratia = 0.05;

    // afisarea punctelor propriu-zise precedata de scalare
    glColor3f(1, 0.1, 0.1); // rosu
    glBegin(GL_LINE_STRIP);
    for (double x = 0; x <= xmax - 5; x += ratia) {
        double x1, y1;
        x1 = x / xmax;
        if (x < 2) {
            y1 = 0.99;
        }
        else {
            y1 = fabs(x-round(x))/x / ymax;
        }
        glVertex2f(x1, y1);
    }
    glEnd();
}


void Display4() {
    double pi = 4 * atan(1.0);
    double xmax = 1;
    double ymax = 0.61;
    double ratia = 0.05;
    double a = 0.3;
    double b = 0.2;

    glColor3f(1, 0.1, 0.1); // rosu
    glBegin(GL_LINE_STRIP);
    for (double t = -pi; t < pi; t += ratia) {
        double x1, y1;
        x1 = 2 * (a * cos(t) + b) * cos(t);
        y1 = 2 * (a * cos(t) + b) * sin(t);
        glVertex2f(x1 / (xmax + 0.2), y1 / (ymax + 0.2));
    }
    glEnd();
}

void Display5() {
    double pi = 4 * atan(1.0);
    double ratia = 0.05;
    double a = 0.2;

    glColor3f(0, 0, 1); // albastru
    glBegin(GL_LINE_STRIP);
    for (double t = -pi/2; t < pi/2; t += ratia) {
        double x1, y1;
        if (t == pi / 6) {
            continue;
        }
        x1 = a / (4 * pow(cos(t), 2) - 3);
        y1 = (a * tan(t)) / (4 * pow(cos(t), 2) - 3);
        glVertex2f(x1, y1);
        if (x1 <= -1 + ratia) {
            break;
        }
    }
    glEnd();
}


void Display6() {
    double pi = 4 * atan(1.0);
    double xmax = 1;
    double ymax = 0.61;
    double ratia = 0.05;
    double a = 0.1;
    double b = 0.2;

    glColor3f(1, 0.1, 0.1); // rosu
    glBegin(GL_LINE_STRIP);
    for (double t = -3 * pi; t < 3 * pi; t += ratia) {
        double x1, y1;
        x1 = a * t -b * sin(t);
        y1 = a - b * cos(t);
        glVertex2f(x1 , y1 );
    }
    glEnd();
}

void Display7() {
    double pi = 4 * atan(1.0);
    double ratia = 0.05;
    double R = 0.1;
    double r = 0.3;

    glColor3f(1, 0.1, 0.1); // rosu
    glBegin(GL_LINE_STRIP);
    for (double t = 0; t <= 2*pi; t += ratia) {
        double x1, y1;
        x1 = (R + r)* cos(r / R * t) - r * cos(t + r / R * t);
        y1 = (R + r)* sin(r / R * t) - r * sin(t + r / R * t);
        glVertex2f(x1 , y1 );
    }
    glEnd();
}

void Display8() {
    double pi = 4 * atan(1.0);
    double ratia = 0.05;
    double R = 0.1;
    double r = 0.3;

    glColor3f(1, 0.1, 0.1); // rosu
    glBegin(GL_LINE_STRIP);
    for (double t = 0; t <= 2 * pi; t += ratia) {
        double x1, y1;
        x1 = (R - r) * cos(r / R * t) - r * cos(t - r / R * t);
        y1 = (R - r) * sin(r / R * t) - r * sin(t - r / R * t);
        glVertex2f(x1, y1);
    }
    glEnd();
}

float r9(float a, float t) {
    return a * sqrt(2 * cos(t * 2));
}
float x9(float r, float t) {
    return r * cos(t);
}
float y9(float r, float t) {
    return r * sin(t);
}
void Display9() {
    double pi = 4 * atan(1.0);
    double ratia = 0.00001;
    double a = 0.4;

    glColor3f(1, 0.1, 0.1); // rosu
    glBegin(GL_LINE_STRIP);
    for (double t = -pi/4; t < pi/4 - 0.001; t += ratia) {
        double x1, y1, r;
        r = r9(a,t);
        glVertex2f(x9(r, t), y9(r, t));
    }
    for (double t = -pi/4; t < pi/4 - 0.001; t += ratia) {
        double x1, y1, r;
        r = r9(a,t);
        glVertex2f(x9(-r, t), y9(-r, t));
    }
    glEnd();
}

float r10(float a, float t) {
    return a * exp(1+t);
}
void Display10() {
    double pi = 4 * atan(1.0);
    double ratia = 0.001;
    double a = 0.02;

    glColor3f(1, 0.1, 0.1); // rosu
    glBegin(GL_LINE_STRIP);
    for (double t = 0; t < 100; t += ratia) {
        double x1, y1, r;
        r = r10(a, t);
        glVertex2f(x9(r, t), y9(r, t));
    }
    glEnd();
}

void Init(void) {

    glClearColor(1.0, 1.0, 1.0, 1.0);

    glLineWidth(1);

    //   glPointSize(4);

    glPolygonMode(GL_FRONT, GL_LINE);
}

void Display(void) {
    glClear(GL_COLOR_BUFFER_BIT);

    switch (prevKey) {
    case '1':
        Display1();
        break;
    case '2':
        Display2();
        break;
    case '3':
        Display3();
        break;
    case '4':
        Display4();
        break;
    case '5':
        Display5();
        break;
    case '6':
        Display6();
        break;
    case '7':
        Display7();
        break;
    case '8':
        Display8();
        break;
    case '9':
        Display9();
        break;
    case '0':
        Display10();
        break;
    default:
        break;
    }

    glFlush();
}

void Reshape(int w, int h) {
    glViewport(0, 0, (GLsizei)w, (GLsizei)h);
}

void KeyboardFunc(unsigned char key, int x, int y) {
    prevKey = key;
    if (key == 27) // escape
        exit(0);
    glutPostRedisplay();
}

void MouseFunc(int button, int state, int x, int y) {
}

int main(int argc, char** argv) {

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
