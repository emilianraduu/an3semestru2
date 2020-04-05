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


class Pixel
{
public:
	int i;
	int j;

	Pixel()
	{
		i = 0;
		j = 0;
	}

	Pixel(int x, int y)
	{
		i = x;
		j = y;
	}
};

class GrilaCarteziana
{
private:
	//nr de linii
	int n;
	//nr de coloane
	int m;
	int size = 15;

	std::vector<Pixel> pixels = {};

public: 
	GrilaCarteziana()
	{
		n = 0;
		m = 0;
	}

	GrilaCarteziana(int nr_linii, int nr_coloane)
	{
		n = nr_linii;
		m = nr_coloane;
	}

	void AddPixel(Pixel pixel) 
	{
		pixels.push_back(pixel);
	}

	std::vector<Pixel> GetPixels() 
	{
		return pixels;
	}

	void DrawGrid()
	{
		glColor3f(0.3, 0.3, 0.3); // gri
		glBegin(GL_LINES);

		float range = max - min;

		for (int i = 0; i < size - 1; i++)
			for (int j = 0; j < size - 1; j++)
			{
				float std = float(float(i - 0) / float(size - 0));
				float x1 = std * range + min;

				std = float(float(j - 0) / float(size - 0));
				float y1 = std * range + min;

				std = float(float(i + 1 - 0) / float(size - 0));
				float x2 = std * range + min;

				std = float(float(j + 1 - 0) / float(size - 0));
				float y2 = std * range + min;

				glVertex2d(-x1, y1);
				glVertex2d(x1, y1);
				glVertex2d(-x1, y1);
				glVertex2d(-x1, -y1);

				glVertex2d(x1, y1);
				glVertex2d(x1, -y1);
				glVertex2d(-x1, -y1);
				glVertex2d(x1, -y1);
			}

		glEnd();
	}

	int GetSize()
	{
		return size;
	}

	void AfisareSegmentDreapta3Grup1(int x0, int y0, int xn, int yn, std::vector<Pixel> M)
	{
		int minV = 32000;
		int maxV = 0;

		// valoarea initiala a variabile de decizie
		// dx, dy sunt constante - a se vedea mai sus
		int dx = xn - x0;
		int dy = yn - y0;

		int d = 2 * dy - dx;
		int dE = 2 * dy;
		int dNE = 2 * (dy - dx);
		float x = x0, y = y0;

		Pixel pixel = Pixel(x, y);

		M.empty();
		M.push_back(pixel);

		while (x < xn)
		{
			cout << "while d: " << d << " x: " << x << " y: " << y << endl;
			if (d <= 0)
			{
				/* alegem E */
				d += dE;
				x++;
			}
			else
			{
				/* alegem NE */
				d += dNE;
				x++;
				y++;
			}

			pixel = Pixel(x, y);
			M.push_back(pixel);

			if (minV > x)
				minV = x;
			else if (minV > y)
				minV = y;

			if (maxV < x)
				maxV = x;
			else if (maxV < y)
				maxV = y;
		}

		minV--;
		maxV = size;

		float range = max - min;

		//desenam linia rosie

		glLineWidth(3);
		glBegin(GL_LINES);
		glColor3f(1, 0.1, 0.1); // rosu

		glVertex2f(min, min);

		float std = float(float(xn - minV) / float(maxV - minV));
		float xf = std * range + min;
		std = float(float(yn - minV) / float(maxV - minV));
		float yf = std * range + min;

		glVertex2f(xf, yf);

		glEnd();

		//desenam punctele

		glEnable(GL_POINT_SMOOTH);
		glEnable(GL_BLEND);
		glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

		glColor3f(0.3, 0.3, 0.3); // gri
		glBegin(GL_POINTS);


		for (Pixel p : M)
		{
			float std = float(float(p.i - minV) / float(maxV - minV));
			float x1 = std * range + min;

			std = float(float(p.j - minV) / float(maxV - minV));
			float y1 = std * range + min;

			glVertex2f(x1, y1);

			//cout << x1 << " " << y1 << '\n';
		}

		glEnd();
	}


	void AfisareSegmentDreapta3Grup2(int x0, int y0, int xn, int yn, std::vector<Pixel> M)
	{
		int minV = 32000;
		int maxV = 0;
		std::vector<Pixel> mainPixels = {};
		// valoarea initiala a variabile de decizie
		// dx, dy sunt constante - a se vedea mai sus
		int dx = xn - x0;
		int dy = yn - y0;

		int d = 2 * dy - dx;
		int dE = 2 * dy;
		int dNE = 2 * (dy - dx);
		float x = x0, y = y0;

		Pixel pixel = Pixel(x, y);

		M.empty();
		mainPixels.empty();

		M.push_back(pixel);
		//cout << M.at(0).i << " " << M.at(0).j << '\n';

		while (x < xn * 3)
		{
			if (d <= 0)
			{
				/* alegem E */
				d += dE;
				x++;
			}
			else
			{
				/* alegem NE */
				d += dNE;
				x++;
				y--;
			}

			pixel = Pixel(x, y);
			//cout << "while d: " << d << " x: " << x << " y: " << y << endl;
			M.push_back(pixel);

			if (minV > x)
				minV = x;
			else if (minV > y)
				minV = y;

			if (maxV < x)
				maxV = x;
			else if (maxV < y)
				maxV = y;
		}

		minV--;
		maxV = size;

		float range = max - min;

		int contor = -1;
		for (int i = 0; i < M.size(); i += 3)
		{
			//desenam punctele

			glEnable(GL_POINT_SMOOTH);
			glEnable(GL_BLEND);
			glBlendFunc(GL_SRC_ALPHA, GL_ONE_MINUS_SRC_ALPHA);

			glColor3f(0.3, 0.3, 0.3); // gri
			glBegin(GL_POINTS);

			Pixel p = M.at(i);
			contor++;
			p.i -= 4; //translatare pe axa x
			p.j -= contor;
			mainPixels.push_back(p);

			float stdy = float(float((p.j) - minV) / float(maxV - minV));
			float y = stdy * range + min;

			for (int ii = 0; ii <= 8; ii++)
			{
				float stdx = float(float(p.i + ii - minV) / float(maxV - minV));
				float x = stdx * range + min;

				if (x >= -1 && x <= 1)
					glVertex2f(x, y);
			}


			glEnd();

			glLineWidth(3);
			glColor3f(1, 0.1, 0.1); // rosu
			glBegin(GL_LINES);

			for (int ii = 1; ii < mainPixels.size() - 1; ii++)
			{
				cout << mainPixels.at(ii).i << " " << mainPixels.at(ii).j << endl;
				//desenam linia rosie

				float stdx = float(float(mainPixels.at(ii).i + 1 - minV) / float(maxV - minV));
				float stdy = float(float(mainPixels.at(ii).j + 1 - minV) / float(maxV - minV));

				float x = stdx * range + min;
				float y = stdy * range + min;


				if (x <= 1)
					glVertex2f(x, y);

				stdx = float(float(mainPixels.at(ii + 1).i + 1 - minV) / float(maxV - minV));
				stdy = float(float(mainPixels.at(ii + 1).j + 1 - minV) / float(maxV - minV));

				x = stdx * range + min;
				y = stdy * range + min;

				if (x <= 1)
					glVertex2f(x, y);
			}

			glEnd();
		}

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
	
	GrilaCarteziana gc = GrilaCarteziana(15, 15);
	gc.DrawGrid();
	gc.AfisareSegmentDreapta3Grup1(-0.9, -0.9, 15, 7, std::vector<Pixel>());

	glLineWidth(1);
	gc.AfisareSegmentDreapta3Grup2(0, 15, 11, 5, std::vector<Pixel>());
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
