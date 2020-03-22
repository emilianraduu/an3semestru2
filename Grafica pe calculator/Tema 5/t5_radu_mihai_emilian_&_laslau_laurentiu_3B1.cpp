#define _CRT_SECURE_NO_WARNINGS

#include <stdlib.h>
#include <stdio.h>
#include <math.h>
#include <assert.h>
#include <float.h>
#include <iostream>
#include <vector>

using namespace std;
#include "GLUT/glut.h"
//http://www.oftenpaper.net/sierpinski.htm
// dimensiunea ferestrei in pixeli
#define dim 300

unsigned char prevKey;
int nivel = 0;
bool first_display = true;

// numarul maxim de iteratii pentru testarea apartenentei la mult.Julia-Fatou
#define NRITER_JF 5000
// modulul maxim pentru testarea apartenentei la mult.Julia-Fatou
#define MODMAX_JF 10000000
// ratii ptr. CJuliaFatou
#define RX_JF 0.01
#define RY_JF 0.01

const float Rs[] = { 255.0, 255.0, 102.0, 0.0, 0.0, 102.0, 255.0, 255.0, 102.0, 32.0 };
const float Gs[] = { 255.0, 255.0, 204.0, 102.0, 0.0, 102.0, 153.0, 0.0, 0.0, 32.0 };
const float Bs[] = { 204.0, 51.0, 0.0, 102.0, 153.0, 255.0, 255.0, 255.0, 102.0, 32.0 };

//Clase problema 1


class CComplex {
public:
	CComplex() : re(0.0), im(0.0) {}
	CComplex(double re1, double im1) : re(re1 * 1.0), im(im1 * 1.0) {}
	CComplex(const CComplex &c) : re(c.re), im(c.im) {}
	~CComplex() {}

	CComplex &operator=(const CComplex &c)
	{
		re = c.re;
		im = c.im;
		return *this;
	}

	double getRe() { return re; }
	void setRe(double re1) { re = re1; }

	double getIm() { return im; }
	void setIm(double im1) { im = im1; }

	double getModul() { return sqrt(re * re + im * im); }

	int operator==(CComplex &c1)
	{
		return ((re == c1.re) && (im == c1.im));
	}

	CComplex pow2()
	{
		CComplex rez;
		rez.re = powl(re * 1.0, 2) - powl(im * 1.0, 2);
		rez.im = 2.0 * re * im;
		return rez;
	}

	friend CComplex operator+(const CComplex &c1, const CComplex &c2);
	friend CComplex operator*(CComplex &c1, CComplex &c2);

	void print(FILE *f)
	{
		fprintf(f, "%.20f%+.20f i", re, im);
	}

private:
	double re, im;
};

CComplex operator+(const CComplex &c1, const CComplex &c2)
{
	CComplex rez(c1.re + c2.re, c1.im + c2.im);
	return rez;
}

CComplex operator*(CComplex &c1, CComplex &c2)
{
	CComplex rez(c1.re * c2.re - c1.im * c2.im,
		c1.re * c2.im + c1.im * c2.re);
	return rez;
}

class CJuliaFatou {
public:
	CJuliaFatou()
	{
		// m.c se initializeaza implicit cu 0+0i

		m.nriter = NRITER_JF;
		m.modmax = MODMAX_JF;
	}

	CJuliaFatou(CComplex &c)
	{
		m.c = c;
		m.nriter = NRITER_JF;
		m.modmax = MODMAX_JF;
	}

	~CJuliaFatou() {}

	void setmodmax(double v) { assert(v <= MODMAX_JF); m.modmax = v; }
	double getmodmax() { return m.modmax; }

	void setnriter(int v) { assert(v <= NRITER_JF); m.nriter = v; }
	int getnriter() { return m.nriter; }

	// testeaza daca x apartine multimii Julia-Fatou Jc
	// returneaza 0 daca apartine, -1 daca converge finit, +1 daca converge infinit
	int isIn(CComplex &x)
	{
		int rez = 0;
		// tablou in care vor fi memorate valorile procesului iterativ z_n+1 = z_n * z_n + c
		CComplex z0, z1;

		z0 = x;
		for (int i = 1; i < m.nriter; i++)
		{
			z1 = z0 * z0 + m.c;
			if (z1 == z0)
			{
				// x nu apartine m.J-F deoarece procesul iterativ converge finit
				rez = -1;
				break;
			}
			else if (z1.getModul() > m.modmax)
			{
				// x nu apartine m.J-F deoarece procesul iterativ converge la infinit
				rez = 1;
				break;
			}
			z0 = z1;
		}

		return rez;
	}

	// afisarea multimii J-F care intersecteaza multimea argument
	void display(double xmin, double ymin, double xmax, double ymax)
	{
		glPushMatrix();
		glLoadIdentity();

		//    glTranslated((xmin + xmax) * 1.0 / (xmin - xmax), (ymin + ymax)  * 1.0 / (ymin - ymax), 0);
		//    glScaled(1.0 / (xmax - xmin), 1.0 / (ymax - ymin), 1);
		// afisarea propriu-zisa
		glBegin(GL_POINTS);
		for (double x = xmin; x <= xmax; x += RX_JF)
			for (double y = ymin; y <= ymax; y += RY_JF)
			{
				CComplex z(x, y);
				int r = isIn(z);
				//        z.print(stdout);
				if (r == 0)
				{
					//          fprintf(stdout, "   \n");
					glVertex3d(x, y, 0);
				}
				else if (r == -1)
				{
					//          fprintf(stdout, "   converge finit\n");
				}
				else if (r == 1)
				{
					//          fprintf(stdout, "   converge infinit\n");
				}
			}
		fprintf(stdout, "STOP\n");
		glEnd();

		glPopMatrix();
	}

private:
	struct SDate {
		CComplex c;
		// nr. de iteratii
		int nriter;
		// modulul maxim
		double modmax;
	} m;
};

class CMandelbrot {
public:
	CMandelbrot()
	{
		// m.c se initializeaza implicit cu 0+0i

		m.nriter = NRITER_JF;
		m.modmax = 2;
	}

	CMandelbrot(CComplex &c)
	{
		m.c = c;
		m.nriter = NRITER_JF;
		m.modmax = 2;
	}

	~CMandelbrot() {}

	void setmodmax(double v) { assert(v <= 2); m.modmax = v; }
	double getmodmax() { return m.modmax; }

	void setnriter(int v) { assert(v <= NRITER_JF); m.nriter = v; }
	int getnriter() { return m.nriter; }

	// testeaza daca x apartine multimii Mandelbrot
	// returneaza 0 daca apartine, -1 daca converge finit, +1 daca converge infinit
	int isIn(CComplex &c)
	{
		int rez = 0;
		// tablou in care vor fi memorate valorile procesului iterativ z_n+1 = z_n * z_n + c
		CComplex z0, z1;

		z0 = CComplex(0.0, 0.0);

		for (int i = 1; i < m.nriter; i++)
		{
			z1 = z0 * z0 + c;
			if (z1.getModul() > 2)
			{
				// x nu apartine m.J-F deoarece procesul iterativ converge la infinit
				rez = i;
				break;
			}
			z0 = z1;
		}

		return rez;
	}

	// afisarea multimii Mandelbrot care intersecteaza multimea argument
	void display(double xmin, double ymin, double xmax, double ymax)
	{
		glPushMatrix();
		glLoadIdentity();

		glTranslated((xmin + xmax) * 2.0 / (xmin - xmax), (ymin + ymax)  * 2.0 / (ymin - ymax), 0);
		glScaled(2.0 / (xmax - xmin), 2.0 / (ymax - ymin), 1);
		// afisarea propriu-zisa
		glBegin(GL_POINTS);

		std::vector<int> rs;

		for (double x = xmin; x <= xmax; x += RX_JF)
			for (double y = ymin; y <= ymax; y += RY_JF)
			{
				CComplex z(x, y);
				int r = isIn(z);
				double iterations = (double)r;
				//        z.print(stdout);
				if (r == 0 || r > 10)
				{
					//    fprintf(stdout, "   \n");		
					glColor3f(1.0, 0.1, 0.1);
					glVertex3d(x, y, 0);
				}
				else if (r == -1)
				{
					//          fprintf(stdout, "   converge finit\n");
				}
				else if (r == 1)
				{
					//          fprintf(stdout, "   converge infinit\n");
				}
				else if (r != 0)
				{


					double N = 256.0; // colors per element
					double N3 = N * N * N;
					// map n on the 0..1 interval (real numbers)
					double t = (double)iterations / (double)12;
					// expand n on the 0 .. 256^3 interval (integers)
					iterations = (t * (double)N3);

					double b = (double)(iterations / (N * N)) / 255.0f;
					int nn = iterations - b * N * N;
					double rr = (double)(nn / N) / 255.0f;
					double g = (double)(nn - rr * N) / 255.0f;

					//glColor3f(rr,g,b);
					//glColor3f(Rs[r - 1] / 255.0, Gs[r - 1] / 255.0, Bs[r - 1] / 255.0);
					glColor3f(Rs[10 - (r - 1)] / 255.0, Gs[10 - (r - 1)] / 255.0, Bs[10 - (r - 1)] / 255.0);

					glVertex3d(x, y, 0);

					if (std::find(rs.begin(), rs.end(), r) == rs.end())
					{
						/*cout << "r " << rr << " " << g << " " << b << '\n';
						cout << double(51.0 / 255.0) << '\n';*/
						rs.push_back(r);
					}

				}
			}
		fprintf(stdout, "STOP\n");
		glEnd();

		glPopMatrix();
	}

private:
	struct SDate {
		CComplex c;
		// nr. de iteratii
		int nriter;
		// modulul maxim
		double modmax;
	} m;
};

//Clase problema 2
class C2coord
{
public:
  C2coord() 
  {
    m.x = m.y = 0;
  }

  C2coord(double x, double y) 
  {
    m.x = x;
    m.y = y;
  }

  C2coord(const C2coord &p) 
  {
    m.x = p.m.x;
    m.y = p.m.y;
  }

  C2coord &operator=(C2coord &p)
  {
    m.x = p.m.x;
    m.y = p.m.y;
    return *this;
  }

  int operator==(C2coord &p)
  {
    return ((m.x == p.m.x) && (m.y == p.m.y));
  }

protected:
  struct SDate
  {
    double x,y;
  } m;
};

class CPunct : public C2coord
{
public:
  CPunct() : C2coord(0.0, 0.0)
  {}

  CPunct(double x, double y) : C2coord(x, y)
  {}

  CPunct &operator=(const CPunct &p)
  {
    m.x = p.m.x;
    m.y = p.m.y;
    return *this;
  }

  void getxy(double &x, double &y)
  {
    x = m.x;
    y = m.y;
  }

  int operator==(CPunct &p)
  {
    return ((m.x == p.m.x) && (m.y == p.m.y));
  }

  void marcheaza()
  {
    glBegin(GL_POINTS);
      glVertex2d(m.x, m.y);
    glEnd();
  }

  void print(FILE *fis)
  {
    fprintf(fis, "(%+f,%+f)", m.x, m.y);
  }

};

class CVector : public C2coord
{
public:
  CVector() : C2coord(0.0, 0.0)
  {
    normalizare();
  }

  CVector(double x, double y) : C2coord(x, y)
  {
    normalizare();
  }

  CVector &operator=(CVector &p)
  {
    m.x = p.m.x;
    m.y = p.m.y;
    return *this;
  }

  int operator==(CVector &p)
  {
    return ((m.x == p.m.x) && (m.y == p.m.y));
  }

  CPunct getDest(CPunct &orig, double lungime)
  {
    double x, y;
    orig.getxy(x, y);
    CPunct p(x + m.x * lungime, y + m.y * lungime);
    return p;
  }

  void rotatie(double grade)
  {
    double x = m.x;
    double y = m.y;
    double t = 2 * (4.0 * atan(1.0)) * grade / 360.0;
    m.x = x * cos(t) - y * sin(t);
    m.y = x * sin(t) + y * cos(t);
    normalizare();
  }

  void deseneaza(CPunct p, double lungime) 
  {
    double x, y;
    p.getxy(x, y);
    glColor3f(1.0, 0.1, 0.1);
    glBegin(GL_LINE_STRIP);
      glVertex2d(x, y);
      glVertex2d(x + m.x * lungime, y + m.y * lungime);
    glEnd();
  }

  void print(FILE *fis)
  {
    fprintf(fis, "%+fi %+fj", C2coord::m.x, C2coord::m.y);
  }

private:
  void normalizare()
  {
    double d = sqrt(C2coord::m.x * C2coord::m.x + C2coord::m.y * C2coord::m.y);
    if (d != 0.0) 
    {
      C2coord::m.x = C2coord::m.x * 1.0 / d;
      C2coord::m.y = C2coord::m.y * 1.0 / d;
    }
  }
};

class CCurbaKoch
{
public:
  void segmentKoch(double lungime, int nivel, CPunct &p, CVector v)
  {
    CPunct p1;
    if (nivel == 0) 
    {
      v.deseneaza(p, lungime);
    }
    else
    {
  //    v.print(stderr);
  //    fprintf(stderr, "\n");
      segmentKoch(lungime / 3.0, nivel - 1, p, v);
      p1 = v.getDest(p, lungime / 3.0);
      v.rotatie(60);
  //    v.print(stderr);
  //    fprintf(stderr, "\n");
      segmentKoch(lungime / 3.0, nivel - 1, p1, v);
      p1 = v.getDest(p1, lungime / 3.0);
      v.rotatie(-120);
  //    v.print(stderr);
  //    fprintf(stderr, "\n");
      segmentKoch(lungime / 3.0, nivel - 1, p1, v);
      p1 = v.getDest(p1, lungime / 3.0);
      v.rotatie(60);
  //    v.print(stderr);
  //    fprintf(stderr, "\n");
      segmentKoch(lungime / 3.0, nivel - 1, p1, v);
    }
  }

  void afisare(double lungime, int nivel)
  {
    CVector v1(sqrt(3.0)/2.0, 0.5);
    CPunct p1(-1.0, 0.0);

    CVector v2(0.0, -1.0);
    CPunct p2(0.5, sqrt(3.0)/2.0);

    CVector v3(-sqrt(3.0)/2.0, 0.5);
    CPunct p3(0.5, -sqrt(3.0)/2.0);

    segmentKoch(lungime, nivel, p1, v1);
    segmentKoch(lungime, nivel, p2, v2);
    segmentKoch(lungime, nivel, p3, v3);
  }
};

class CArboreBinar
{
public:
  void arboreBinar(double lungime, int nivel, CPunct &p, CVector v)
  {
    CPunct p1;
    if (nivel == 0) 
    {
      v.deseneaza(p, lungime);
    }
    else
    {
      arboreBinar(lungime, nivel - 1, p, v);
      p1 = v.getDest(p, lungime);

      v.rotatie(-45);
      arboreBinar(lungime / 2.0, nivel - 1, p1, v);

      v.rotatie(90);
      arboreBinar(lungime / 2.0, nivel - 1, p1, v);
    }
  }

  void afisare(double lungime, int nivel)
  {
    CVector v(0.0, -1.0);
    CPunct p(0.0, 1.0);

    arboreBinar(lungime, nivel, p, v);
  }
};

class CArborePerron
{
public:
  void arborePerron(double lungime, 
                    int nivel, 
                    double factordiviziune, 
                    CPunct p, 
                    CVector v)
  {
    assert(factordiviziune != 0);
    CPunct p1, p2;
    if (nivel == 0) 
    {
    }
    else
    {
      v.rotatie(30);
      v.deseneaza(p, lungime);
      p1 = v.getDest(p, lungime);
      arborePerron(lungime * factordiviziune, nivel - 1, factordiviziune, p1, v);

      v.rotatie(-90);
      v.deseneaza(p, lungime);
      p1 = v.getDest(p, lungime);
      p2 = p1;

      v.rotatie(-30);
      v.deseneaza(p1, lungime);
      p1 = v.getDest(p1, lungime);
      arborePerron(lungime * factordiviziune, nivel - 1, factordiviziune, p1, v);

      p1 = p2;
      v.rotatie(90);
      v.deseneaza(p1, lungime);
      p1 = v.getDest(p1, lungime);
      p2 = p1;

      v.rotatie(30);
      v.deseneaza(p1, lungime);
      p1 = v.getDest(p1, lungime);
      arborePerron(lungime * factordiviziune, nivel - 1, factordiviziune, p1, v);

      p1 = p2;
      v.rotatie(-90);
      v.deseneaza(p1, lungime);
      p1 = v.getDest(p1, lungime);
      arborePerron(lungime * factordiviziune, nivel - 1, factordiviziune, p1, v);
    }
  }

  void afisare(double lungime, int nivel)
  {
    CVector v(0.0, 1.0);
    CPunct p(0.0, -1.0);

    v.deseneaza(p, 0.25);
    p = v.getDest(p, 0.25);
    arborePerron(lungime, nivel, 0.4, p, v);
  }
};

class CCurbaHilbert
{
public:
  void curbaHilbert(double lungime, int nivel, CPunct &p, CVector &v, int d)
  {
    if (nivel == 0) 
    {
    }
    else
    {
      v.rotatie(d * 90);
      curbaHilbert(lungime, nivel - 1, p, v, -d);

      v.deseneaza(p, lungime);
      p = v.getDest(p, lungime);

      v.rotatie(-d * 90);
      curbaHilbert(lungime, nivel - 1, p, v, d);

      v.deseneaza(p, lungime);
      p = v.getDest(p, lungime);

      curbaHilbert(lungime, nivel - 1, p, v, d);

      v.rotatie(-d * 90);
      v.deseneaza(p, lungime);
      p = v.getDest(p, lungime);
      
      curbaHilbert(lungime, nivel - 1, p, v, -d);

      v.rotatie(d * 90);
    }
  }

  void afisare(double lungime, int nivel)
  {
    CVector v(0.0, 1.0);
    CPunct p(0.0, 0.0);

    curbaHilbert(lungime, nivel, p, v, 1);
  }
};

struct Point {
	float x;
	float y;
}; // end Point

class CTriunghiSierpinski
{
public:
	void triunghiSierpinski(Point a, Point b, Point c, int nivel)
	{
		// cout << "draw " << nivel << '\n';

		if (nivel == 0)
		{
			glBegin(GL_TRIANGLES);
			glVertex2f(a.x, a.y);
			glVertex2f(b.x, b.y);
			glVertex2f(c.x, c.y);
			glEnd();
			// cout << "Hello!" << endl;
		}
		else
		{
			Point p0, p1, p2;
		
			p0.x = (a.x + b.x) / 2.0;
			p0.y = (a.y + b.y) / 2.0;
			p1.x = (a.x + c.x) / 2.0;
			p1.y = (a.y + c.y) / 2.0;
			p2.x = (b.x + c.x) / 2.0;
			p2.y = (c.y + b.y) / 2.0;
			triunghiSierpinski(a, p0, p1, nivel - 1);
			triunghiSierpinski(b, p2, p0, nivel - 1);
			triunghiSierpinski(c, p1, p2, nivel - 1);

		}
	}

	void curve(CVector &v, CPunct &p, unsigned nivel, double length, int angle)
	{ 
		if (0 == nivel) 
		{ 
			v.deseneaza(p, length); 
			p = v.getDest(p, length);
		} 
		else 
		{ 
			curve(v, p, nivel - 1, length / 2, -angle);
			v.rotatie(+angle);
			curve(v, p, nivel - 1, length / 2, +angle); 
			v.rotatie(+angle);  
			curve(v, p, nivel - 1, length / 2, -angle);
		} 
	}

	void sierpinski_arrowhead_curve(CVector &v, CPunct &p, unsigned nivel, double length)
	{     
		// If order is even we can just draw the curve.     
		if ( 0 == (nivel & 1) ) 
		{        
			curve(v, p, nivel, length, +60);
		}     
		else /* order is odd */ 
		{         
			v.rotatie( +60); 
			curve(v, p, nivel, length, -60); 
		} 
	} 

	void afisare(int nivel)
	{

		CVector v(0.0, 1.0);
		CPunct p(0.0, -0.5);

		sierpinski_arrowhead_curve(v, p, nivel, 1);
	}

};

class CCovorSierpinski
{
public:
	void covorSierpinski(Point a, Point b, Point c, Point d, int level)
	{
		// cout << "draw " << level << '\n';
		
		if (nivel == 1)
		{
			glBegin(GL_LINE_LOOP);
			glVertex2f(-0.5, 0.5); 
			glVertex2f(0.5, 0.5);
			glVertex2f(0.5, -0.5);
			glVertex2f(-0.5, -0.5);
			glEnd();
		}

		if (level == 0 || level == 1)
		{
			/*glBegin(GL_POLYGON);
			glRectf(a.x, a.y, c.x, c.y);
			glEnd();*/

			Point a1, b1, c1, d1;
			float xdist = abs(a.x - b.x);
			float ydist = abs(a.y - d.y);

			a1.x = a.x + xdist / 3;			a1.y = a.y - ydist / 3;
			b1.x = b.x - xdist / 3;			b1.y = b.y - ydist / 3;
			c1.x = c.x - xdist / 3;			c1.y = c.y + ydist / 3;
			d1.x = d.x + xdist / 3;			d1.y = d.y + ydist / 3;

			glBegin(GL_LINE_LOOP);
			glVertex2f(a1.x, a1.y);
			glVertex2f(b1.x, b1.y);
			glVertex2f(c1.x, c1.y);
			glVertex2f(d1.x, d1.y);
			glEnd();
		}
		else
		{
			if (level % 2 == 1 || nivel % 2 == 0)
			{
				glBegin(GL_LINE_LOOP);
				glVertex2f(a.x, a.y);
				glVertex2f(b.x, b.y);
				glVertex2f(c.x, c.y);
				glVertex2f(d.x, d.y);
				glEnd();
			}

			float xdist = abs(a.x - b.x);
			float ydist = abs(a.y - d.y);

			glBegin(GL_LINE_LOOP);
			glVertex2f(a.x + xdist / 3, a.y - ydist / 3);
			glVertex2f(b.x - xdist / 3, b.y - ydist / 3);
			glVertex2f(c.x - xdist / 3, c.y + ydist / 3);
			glVertex2f(d.x + xdist / 3, d.y + ydist / 3);
			glEnd();
			Point a1, b1, c1, d1;

			//1
			a1.x = a.x;						a1.y = a.y;
			b1.x = a.x + xdist / 3;			b1.y = a.y;
			c1.x = a.x + xdist / 3;			c1.y = a.y - ydist / 3;
			d1.x = a.x;						d1.y = a.y - ydist / 3;
			covorSierpinski(a1, b1, c1, d1, level - 1);

			//2
			a1.x = a.x + xdist / 3;			a1.y = a.y;
			b1.x = b.x - xdist / 3;			b1.y = b.y;
			c1.x = b.x - xdist / 3;			c1.y = b.y - ydist / 3;
			d1.x = a.x + xdist / 3;			d1.y = a.y - ydist / 3;
			covorSierpinski(a1, b1, c1, d1, level - 1);

			//3
			a1.x = b.x - xdist / 3;			a1.y = b.y;
			b1.x = b.x;						b1.y = b.y;
			c1.x = b.x;						c1.y = b.y - ydist / 3;
			d1.x = b.x - xdist / 3;			d1.y = b.y - ydist / 3;
			covorSierpinski(a1, b1, c1, d1, level - 1);

			//4
			a1.x = b.x - xdist / 3;			a1.y = b.y - ydist / 3;
			b1.x = b.x;						b1.y = b.y - ydist / 3;
			c1.x = c.x;						c1.y = c.y + ydist / 3;
			d1.x = c.x - xdist / 3;			d1.y = c.y + ydist / 3;
			covorSierpinski(a1, b1, c1, d1, level - 1);

			//5
			a1.x = c.x - xdist / 3;			a1.y = c.y + ydist / 3;
			b1.x = c.x;						b1.y = c.y + ydist / 3;
			c1.x = c.x;						c1.y = c.y;
			d1.x = c.x - xdist / 3;			d1.y = c.y;
			covorSierpinski(a1, b1, c1, d1, level - 1);

			//6
			a1.x = d.x + xdist / 3;			a1.y = d.y + ydist / 3;
			b1.x = c.x - xdist / 3;			b1.y = c.y + ydist / 3;
			c1.x = c.x - xdist / 3;			c1.y = c.y;
			d1.x = d.x + xdist / 3;			d1.y = d.y;
			covorSierpinski(a1, b1, c1, d1, level - 1);

			//7
			a1.x = d.x;						a1.y = d.y + ydist / 3;
			b1.x = d.x + xdist / 3;			b1.y = d.y + ydist / 3;
			c1.x = d.x + xdist / 3;			c1.y = d.y;
			d1.x = d.x;						d1.y = d.y;
			covorSierpinski(a1, b1, c1, d1, level - 1);

			//8
			a1.x = a.x;						a1.y = a.y - ydist / 3;
			b1.x = a.x + xdist / 3;			b1.y = a.y - ydist / 3;
			c1.x = d.x + xdist / 3;			c1.y = d.y + ydist / 3;
			d1.x = d.x;						d1.y = d.y + ydist / 3;
			covorSierpinski(a1, b1, c1, d1, level - 1);
		}
	}

	void afisare(int nivel)
	{
		Point a, b, c, d;
		a.x = -0.5; a.y = 0.5;
		b.x = 0.5; b.y = 0.5;
		c.x = 0.5; c.y = -0.5;
		d.x = -0.5; d.y = -0.5;

		covorSierpinski(a, b, c, d, nivel);
		// cout << "afisare " << nivel << '\n';
	}
};
// afisare curba lui Koch "fulg de zapada"

class CReversedArborePerron
{
public:
	void arborePerron(double lungime,
		int nivel,
		double factordiviziune,
		CPunct p,
		CVector v)
	{
		assert(factordiviziune != 0);
		CPunct p1, p2;
		if (nivel == 0)
		{
		}
		else
		{
			v.rotatie(-45);
			v.deseneaza(p, lungime);
			p1 = v.getDest(p, lungime);
			arborePerron(lungime * factordiviziune, nivel - 1, factordiviziune, p1, v);

			v.rotatie(90);
			v.deseneaza(p, lungime);
			p1 = v.getDest(p, lungime);
			p2 = p1;

			v.rotatie(15);
			v.deseneaza(p1, lungime);
			p1 = v.getDest(p1, lungime);
			arborePerron(lungime * factordiviziune, nivel - 1, factordiviziune, p1, v);

			p1 = p2;
			v.rotatie(-60);
			v.deseneaza(p1, lungime);
			p1 = v.getDest(p1, lungime);
			p2 = p1;

			v.rotatie(-90);
			v.deseneaza(p1, lungime/2);
			p1 = v.getDest(p1, lungime/2);
			arborePerron(lungime * factordiviziune, nivel - 1, factordiviziune, p1, v);

			p1 = p2;
			v.rotatie(120);
			v.deseneaza(p1, lungime/2);
			p1 = v.getDest(p1, lungime/2);
			arborePerron(lungime * factordiviziune, nivel - 1, factordiviziune, p1, v);
		}
	}

	void afisare(double lungime, int nivel)
	{
		CVector v(0.0, -1.0);
		CPunct p(0.0, 2.0);
		float lungimeLinie = 0.25;
		v.deseneaza(p, lungimeLinie);
		p = v.getDest(p, lungimeLinie);
		arborePerron(lungime, nivel, 0.4, p, v);
	}
};


// Display problema 1

// multimea Julia-Fatou pentru z0 = 0 si c = -0.12375+0.056805i
void DisplayQ() {
	CComplex c(-0.12375, 0.056805);
	CJuliaFatou cjf(c);

	glColor3f(1.0, 0.1, 0.1);
	cjf.setnriter(30);
	cjf.display(-0.8, -0.4, 0.8, 0.4);
}
// multimea Julia-Fatou pentru z0 = 0 si c = -0.012+0.74i
void DisplayW() {
	CComplex c(-0.012, 0.74);
	CJuliaFatou cjf(c);

	glColor3f(1.0, 0.1, 0.1);
	cjf.setnriter(30);
	cjf.display(-1, -1, 1, 1);
}
// multimea Mandelbrot
void DisplayE() {
	//CComplex c(-0.012, 0.74);
	CComplex c(-0.12375, 0.056805);
	CMandelbrot cm(c);

	glColor3f(1.0, 0.1, 0.1);
	cm.setnriter(30);
	cm.display(-2, -2, 2, 2);
}


// Display problema 2

// afisare curba lui Koch
void Display1() {
  CCurbaKoch cck;
  cck.afisare(sqrt(3.0), nivel);

  char c[3];
  sprintf(c, "%2d", nivel);
  glRasterPos2d(-0.98,-0.98);
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'N');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'i');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'v');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'e');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'l');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, '=');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, c[0]);
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, c[1]);

  glRasterPos2d(-1.0,0.9);
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'c');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'u');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'r');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'b');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'a');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, ' ');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'l');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'u');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'i');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, ' ');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'K');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'o');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'c');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'h');

  nivel++;
}
// afisare arbore binar
void Display2() {
  CArboreBinar cab;
  cab.afisare(1, nivel);

  char c[3];
  sprintf(c, "%2d", nivel);
  glRasterPos2d(-0.98,-0.98);
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'N');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'i');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'v');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'e');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'l');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, '=');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, c[0]);
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, c[1]);

  glRasterPos2d(-1.0,0.9);
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'a');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'r');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'b');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'o');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'r');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'e');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, ' ');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'b');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'i');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'n');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'a');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'r');

  nivel++;
}
// afisare arborele lui Perron
void Display3() {
  CArborePerron cap;

  char c[3];
  sprintf(c, "%2d", nivel);
  glRasterPos2d(-0.98,-0.98);
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'N');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'i');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'v');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'e');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'l');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, '=');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, c[0]);
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, c[1]);

  glRasterPos2d(-1.0,-0.9);
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'a');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'r');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'b');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'o');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'r');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'e');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, ' ');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'P');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'e');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'r');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'r');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'o');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'n');

  glPushMatrix();
  glLoadIdentity();
  glScaled(0.4, 0.4, 1);
  glTranslated(-0.5, -0.5, 0.0);
  cap.afisare(1, nivel);
  glPopMatrix();
  nivel++;
}
// afisare curba lui Hilbert
void Display4() {
  CCurbaHilbert cch;
  cch.afisare(0.05, nivel);

  char c[3];
  sprintf(c, "%2d", nivel);
  glRasterPos2d(-0.98,-0.98);
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'N');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'i');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'v');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'e');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'l');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, '=');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, c[0]);
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, c[1]);

  glRasterPos2d(-1.0,-0.9);
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'c');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'u');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'r');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'b');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'a');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, ' ');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'H');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'i');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'l');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'b');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'e');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'r');
  glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 't');

  nivel++;
}
// afisare curba lui Serpinski
void Display5()
{
	CTriunghiSierpinski csierp;
	csierp.afisare(nivel);

	char c[3];
	sprintf(c, "%2d", nivel);
	glRasterPos2d(-0.98, -0.98);
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'N');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'i');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'v');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'e');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'l');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, '=');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, c[0]);
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, c[1]);

	glRasterPos2d(-1.0, -0.9);
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'c');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'u');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'r');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'b');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'a');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, ' ');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'S');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'i');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'e');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'r');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'p');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'i');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'n');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 's');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'k');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'i');

	nivel++;
	// cout << nivel << '\n';
}
// afisare covorul lui Serpinski
void Display6()
{
	CCovorSierpinski csierp;
	/*if (nivel == 0) {
		++nivel;
	}*/
	
	char c[3];
	sprintf(c, "%2d", nivel);
	glRasterPos2d(-0.98, -0.98);
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'N');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'i');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'v');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'e');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'l');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, '=');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, c[0]);
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, c[1]);

	glRasterPos2d(-1.0, -0.9);
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'c');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'o');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'v');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'o');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'r');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, ' ');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'S');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'i');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'e');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'r');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'p');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'i');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'n');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 's');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'k');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'i');
	csierp.afisare(nivel);
	nivel++;
	// cout << nivel << '\n';
}
// afisare arborele lui Perron inversat
void Display7()
{
	CReversedArborePerron revcap;

	char c[3];
	sprintf(c, "%2d", nivel);
	glRasterPos2d(-0.98, -0.98);
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'N');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'i');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'v');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'e');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'l');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, '=');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, c[0]);
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, c[1]);

	glRasterPos2d(-1.0, -0.9);
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'a');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'r');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'b');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'o');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'r');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'e');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, ' ');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'P');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'e');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'r');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'r');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'o');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'n');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, ' ');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'i');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'n');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'v');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'e');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 'r');
	glutBitmapCharacter(GLUT_BITMAP_9_BY_15, 's');

	glPushMatrix();
	glLoadIdentity();
	glScaled(0.4, 0.4, 1);
	glTranslated(-0.5, -0.5, 0.0);

	revcap.afisare(1, nivel);
	glPopMatrix();
	nivel++;
}

void Init(void) {

   glClearColor(1.0,1.0,1.0,1.0);

   glLineWidth(1);

   glPointSize(1);

   glPolygonMode(GL_FRONT, GL_LINE);
}

void Display(void) 
{	
	if (first_display) {
		first_display = false;
		unsigned char origPrevKey = prevKey;
		prevKey = '1';
		Display();
		nivel = 0;
		glClear(GL_COLOR_BUFFER_BIT);
		prevKey = origPrevKey;
	}

	switch(prevKey) 
	{
	case '0':
		glClear(GL_COLOR_BUFFER_BIT);
		nivel = 0;
		fprintf(stderr, "nivel = %d\n", nivel);
		break;
	case '1':
		glClear(GL_COLOR_BUFFER_BIT);
		Display1();
		break;
	case '2':
		glClear(GL_COLOR_BUFFER_BIT);
		Display2();
		break;
	case '3':
		glClear(GL_COLOR_BUFFER_BIT);
		Display3();
		break;
	case '4':
		glClear(GL_COLOR_BUFFER_BIT);
		Display4();
		break;
	case '5':
		glClear(GL_COLOR_BUFFER_BIT);
		Display5();
		break;
	case '6':
		glClear(GL_COLOR_BUFFER_BIT);
		Display6();
		break;
	case '7':
		glClear(GL_COLOR_BUFFER_BIT);
		Display7();
		break;
	case 'q':
		glClear(GL_COLOR_BUFFER_BIT);
		DisplayQ();
		break;
	case 'w':
		glClear(GL_COLOR_BUFFER_BIT);
		DisplayW();
		break;
	case 'e':
		glClear(GL_COLOR_BUFFER_BIT);
		DisplayE();
		break;
	default:
		break;
	}
	glFlush();
}

void Reshape(int w, int h) 
{
   glViewport(0, 0, (GLsizei) w, (GLsizei) h);
}

void KeyboardFunc(unsigned char key, int x, int y) 
{
   prevKey = key;
   if (key == 27) // escape
      exit(0);
   glutPostRedisplay();
}

void MouseFunc(int button, int state, int x, int y) 
{
}

int main(int argc, char** argv) 
{
  glutInit(&argc, argv);

  glutInitWindowSize(dim, dim);

  glutInitWindowPosition(100, 100);

  glutInitDisplayMode (GLUT_SINGLE | GLUT_RGB);

  glutCreateWindow (argv[0]);

  Init();

  glutReshapeFunc(Reshape);

  glutKeyboardFunc(KeyboardFunc);

  glutMouseFunc(MouseFunc);

  glutDisplayFunc(Display);

  glutMainLoop();

  return 0;
}


