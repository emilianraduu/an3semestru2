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

		for (int i = 0; i <= n; i++) {
			glVertex2d(min + cellSize * i, min);
			glVertex2d(min + cellSize * i, max);
		}
		for (int i = 0; i <= n; i++) {
			glVertex2d(min, min + cellSize * i);
			glVertex2d(max, min + cellSize * i);
		}

		glEnd();
	}

	void writePixel(int row, int col, float cellSize) {
		float range = max - min;
		float x = min + col * cellSize;
		float y = max - row * cellSize;
		if (x >= min && x <= max && y>= min && y <= max) {
			glVertex2f(x, y);
		}
	}
	void AfisareSegmentDreapta3Grup1(float x0, float y0, int xn, int yn)
	{
		float range = max - min;
		float cellSize = range / n;
		float xf = x0 + xn * cellSize;
		float yf = y0 + yn * cellSize;
		
		//desenam linia rosie
		glLineWidth(3);
		glBegin(GL_LINES);
		glColor3f(1, 0.1, 0.1); // rosu
		
		glVertex2f(x0, y0);
		glVertex2f(xf, yf);

		glEnd();

		//desenam punctele
		glEnable(GL_POINT_SMOOTH);
		glEnable(GL_BLEND);
		glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

		glColor3f(0.3, 0.3, 0.3); // gri
		glBegin(GL_POINTS);

		for (int i = 0; i <= xn; i += 2) {
			writePixel(n - i/2, i, cellSize);
			writePixel(n - i/2, i + 1, cellSize);
		}

		glEnd();
	}


	void AfisareSegmentDreapta3Grup2(float x0, float y0, int xn, int yn)
	{
		float range = max - min;
		float cellSize = range / n;
		float xf = x0 + xn * cellSize;
		float yf = y0 - yn * cellSize;

		//desenam linia rosie
		glLineWidth(3);
		glBegin(GL_LINES);
		glColor3f(1, 0.1, 0.1); // rosu

		glVertex2f(x0, y0);
		glVertex2f(xf, yf);

		glEnd();

		//desenam punctele
		glEnable(GL_POINT_SMOOTH);
		glEnable(GL_BLEND);
		glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

		glColor3f(0.3, 0.3, 0.3); // gri
		glBegin(GL_POINTS);

		for (int i = 0; i <= xn; i += 3) {
			writePixel(i / 3, i, cellSize);
			writePixel(i / 3, i - 1, cellSize);
			writePixel(i / 3, i + 1, cellSize);

			writePixel(i / 3 - 1, i, cellSize);
			writePixel(i / 3 - 1, i - 1, cellSize);
			writePixel(i / 3 - 1, i + 1, cellSize);

			writePixel(i / 3 + 1, i, cellSize);
			writePixel(i / 3 + 1, i - 1, cellSize);
			writePixel(i / 3 + 1, i + 1, cellSize);
		}
		glEnd();

	}
};



void Init(void) {

	glClearColor(1.0, 1.0, 1.0, 1.0);

	glLineWidth(1);

	glPointSize(12);

	glPolygonMode(GL_FRONT, GL_LINE);
}

void Display(void)
{
	glClear(GL_COLOR_BUFFER_BIT);
	
	GrilaCarteziana gc = GrilaCarteziana(15);
	gc.DrawGrid();
	gc.AfisareSegmentDreapta3Grup1(min, min, 15, 7);

	glLineWidth(1);
	gc.AfisareSegmentDreapta3Grup2(min, max, 15, 5);
	glFlush();
}

void Reshape(int w, int h)
{
	glViewport(0, 0, (GLsizei)w, (GLsizei)h);
}

void KeyboardFunc(unsigned char key, int x, int y)
{

}

void MouseFunc(int button, int state, int x, int y)
{
}

int main(int argc, char** argv)
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
