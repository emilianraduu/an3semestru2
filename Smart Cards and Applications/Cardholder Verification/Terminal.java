import java.net.Socket;

import java.util.Scanner;
import com.sun.javacard.apduio.*;

import java.awt.Desktop;
import java.io.InputStream;
import java.io.OutputStream;
import java.math.BigInteger;
import java.io.File;

public class Terminal {
	private static String SUCCESS_CODE = "90";
	private static byte[][] instructionArray = {
			{ (byte) 0x00, (byte) 0xA4, (byte) 0x04, (byte) 0x00, (byte) 0x09, (byte) 0xA0, (byte) 0x00, (byte) 0x00,
					(byte) 0x00, (byte) 0x62, (byte) 0x03, (byte) 0x01, (byte) 0x08, (byte) 0x01, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB0, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB2, (byte) 0x01, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x01, (byte) 0x00, (byte) 0x17, (byte) 0x01, (byte) 0x00, (byte) 0x14,
					(byte) 0xDE, (byte) 0xCA, (byte) 0xFF, (byte) 0xED, (byte) 0x03, (byte) 0x02, (byte) 0x04,
					(byte) 0x00, (byte) 0x01, (byte) 0x09, (byte) 0xA0, (byte) 0x00, (byte) 0x00, (byte) 0x00,
					(byte) 0x62, (byte) 0x03, (byte) 0x01, (byte) 0x0C, (byte) 0x06, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xBC, (byte) 0x01, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB2, (byte) 0x02, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x02, (byte) 0x00, (byte) 0x20, (byte) 0x02, (byte) 0x00, (byte) 0x25,
					(byte) 0x00, (byte) 0x14, (byte) 0x00, (byte) 0x25, (byte) 0x00, (byte) 0x0E, (byte) 0x00,
					(byte) 0x15, (byte) 0x00, (byte) 0x6A, (byte) 0x00, (byte) 0x1D, (byte) 0x02, (byte) 0x25,
					(byte) 0x00, (byte) 0x0A, (byte) 0x00, (byte) 0x46, (byte) 0x00, (byte) 0x00, (byte) 0x00,
					(byte) 0xED, (byte) 0x08, (byte) 0x22, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00,
					(byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x02, (byte) 0x00, (byte) 0x08, (byte) 0x00, (byte) 0x00, (byte) 0x00,
					(byte) 0x00, (byte) 0x00, (byte) 0x02, (byte) 0x01, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xBC, (byte) 0x02, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB2, (byte) 0x04, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x04, (byte) 0x00, (byte) 0x18, (byte) 0x04, (byte) 0x00, (byte) 0x15,
					(byte) 0x02, (byte) 0x08, (byte) 0x01, (byte) 0x07, (byte) 0xA0, (byte) 0x00, (byte) 0x00,
					(byte) 0x00, (byte) 0x62, (byte) 0x01, (byte) 0x01, (byte) 0x00, (byte) 0x01, (byte) 0x07,
					(byte) 0xA0, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x62, (byte) 0x00, (byte) 0x01,
					(byte) 0x7F },
			{ (byte) 0x80, (byte) 0xBC, (byte) 0x04, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB2, (byte) 0x03, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x03, (byte) 0x00, (byte) 0x11, (byte) 0x03, (byte) 0x00, (byte) 0x0E,
					(byte) 0x01, (byte) 0x0A, (byte) 0xA0, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x62,
					(byte) 0x03, (byte) 0x01, (byte) 0x0C, (byte) 0x06, (byte) 0x01, (byte) 0x00, (byte) 0x5B,
					(byte) 0x7F },
			{ (byte) 0x80, (byte) 0xBC, (byte) 0x03, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB2, (byte) 0x06, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x06, (byte) 0x00, (byte) 0x20, (byte) 0x06, (byte) 0x00, (byte) 0x1D,
					(byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x80, (byte) 0x03, (byte) 0x03, (byte) 0x00,
					(byte) 0x02, (byte) 0x04, (byte) 0x04, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x74,
					(byte) 0xFF, (byte) 0xFF, (byte) 0x00, (byte) 0x67, (byte) 0x00, (byte) 0x7C, (byte) 0x00,
					(byte) 0x01, (byte) 0x02, (byte) 0x03, (byte) 0x04, (byte) 0x05, (byte) 0x06, (byte) 0x07,
					(byte) 0x08, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xBC, (byte) 0x06, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB2, (byte) 0x07, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x07, (byte) 0x00, (byte) 0x20, (byte) 0x07, (byte) 0x02, (byte) 0x25,
					(byte) 0x00, (byte) 0x05, (byte) 0x43, (byte) 0x18, (byte) 0x8C, (byte) 0x00, (byte) 0x04,
					(byte) 0x18, (byte) 0x10, (byte) 0x06, (byte) 0x90, (byte) 0x0B, (byte) 0x3D, (byte) 0x03,
					(byte) 0x10, (byte) 0x32, (byte) 0x38, (byte) 0x3D, (byte) 0x05, (byte) 0x04, (byte) 0x38,
					(byte) 0x3D, (byte) 0x06, (byte) 0x10, (byte) 0x07, (byte) 0x38, (byte) 0x3D, (byte) 0x07,
					(byte) 0x10, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x07, (byte) 0x00, (byte) 0x20, (byte) 0x1F, (byte) 0x38, (byte) 0x87,
					(byte) 0x00, (byte) 0x18, (byte) 0x8F, (byte) 0x00, (byte) 0x18, (byte) 0x3D, (byte) 0x06,
					(byte) 0x10, (byte) 0x08, (byte) 0x8C, (byte) 0x00, (byte) 0x03, (byte) 0x87, (byte) 0x01,
					(byte) 0x19, (byte) 0x1E, (byte) 0x25, (byte) 0x29, (byte) 0x04, (byte) 0x1E, (byte) 0x16,
					(byte) 0x04, (byte) 0x41, (byte) 0x04, (byte) 0x41, (byte) 0x31, (byte) 0x19, (byte) 0x1E,
					(byte) 0x25, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x07, (byte) 0x00, (byte) 0x20, (byte) 0x29, (byte) 0x05, (byte) 0x1E,
					(byte) 0x16, (byte) 0x05, (byte) 0x41, (byte) 0x04, (byte) 0x41, (byte) 0x31, (byte) 0x19,
					(byte) 0x1E, (byte) 0x25, (byte) 0x29, (byte) 0x06, (byte) 0xAD, (byte) 0x01, (byte) 0x19,
					(byte) 0x1E, (byte) 0x04, (byte) 0x41, (byte) 0x16, (byte) 0x06, (byte) 0x8B, (byte) 0x00,
					(byte) 0x05, (byte) 0x18, (byte) 0x8B, (byte) 0x00, (byte) 0x06, (byte) 0x7A, (byte) 0x04,
					(byte) 0x30, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x07, (byte) 0x00, (byte) 0x20, (byte) 0x8F, (byte) 0x00, (byte) 0x07,
					(byte) 0x18, (byte) 0x1D, (byte) 0x1E, (byte) 0x8C, (byte) 0x00, (byte) 0x08, (byte) 0x7A,
					(byte) 0x01, (byte) 0x10, (byte) 0xAD, (byte) 0x01, (byte) 0x8B, (byte) 0x00, (byte) 0x09,
					(byte) 0x61, (byte) 0x04, (byte) 0x03, (byte) 0x78, (byte) 0x04, (byte) 0x78, (byte) 0x01,
					(byte) 0x10, (byte) 0xAD, (byte) 0x01, (byte) 0x8B, (byte) 0x00, (byte) 0x0A, (byte) 0x7A,
					(byte) 0x02, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x07, (byte) 0x00, (byte) 0x20, (byte) 0x21, (byte) 0x19, (byte) 0x8B,
					(byte) 0x00, (byte) 0x0B, (byte) 0x2D, (byte) 0x19, (byte) 0x8B, (byte) 0x00, (byte) 0x0C,
					(byte) 0x60, (byte) 0x10, (byte) 0x1A, (byte) 0x04, (byte) 0x25, (byte) 0x10, (byte) 0xA4,
					(byte) 0x6B, (byte) 0x03, (byte) 0x7A, (byte) 0x11, (byte) 0x6E, (byte) 0x00, (byte) 0x8D,
					(byte) 0x00, (byte) 0x0D, (byte) 0x1A, (byte) 0x03, (byte) 0x25, (byte) 0x10, (byte) 0x80,
					(byte) 0x6A, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x07, (byte) 0x00, (byte) 0x20, (byte) 0x08, (byte) 0x11, (byte) 0x6E,
					(byte) 0x00, (byte) 0x8D, (byte) 0x00, (byte) 0x0D, (byte) 0x1A, (byte) 0x04, (byte) 0x25,
					(byte) 0x75, (byte) 0x00, (byte) 0x37, (byte) 0x00, (byte) 0x05, (byte) 0x00, (byte) 0x20,
					(byte) 0x00, (byte) 0x2B, (byte) 0x00, (byte) 0x30, (byte) 0x00, (byte) 0x25, (byte) 0x00,
					(byte) 0x40, (byte) 0x00, (byte) 0x1F, (byte) 0x00, (byte) 0x50, (byte) 0x00, (byte) 0x19,
					(byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x07, (byte) 0x00, (byte) 0x20, (byte) 0x70, (byte) 0x00, (byte) 0x31,
					(byte) 0x18, (byte) 0x19, (byte) 0x8C, (byte) 0x00, (byte) 0x0E, (byte) 0x7A, (byte) 0x18,
					(byte) 0x19, (byte) 0x8C, (byte) 0x00, (byte) 0x0F, (byte) 0x7A, (byte) 0x18, (byte) 0x19,
					(byte) 0x8C, (byte) 0x00, (byte) 0x10, (byte) 0x7A, (byte) 0x18, (byte) 0x19, (byte) 0x8C,
					(byte) 0x00, (byte) 0x11, (byte) 0x7A, (byte) 0x18, (byte) 0x19, (byte) 0x8C, (byte) 0x00,
					(byte) 0x12, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x07, (byte) 0x00, (byte) 0x20, (byte) 0x7A, (byte) 0x11, (byte) 0x6D,
					(byte) 0x00, (byte) 0x8D, (byte) 0x00, (byte) 0x0D, (byte) 0x7A, (byte) 0x04, (byte) 0x23,
					(byte) 0x19, (byte) 0x8B, (byte) 0x00, (byte) 0x0B, (byte) 0x2D, (byte) 0x19, (byte) 0x8B,
					(byte) 0x00, (byte) 0x13, (byte) 0x32, (byte) 0x19, (byte) 0xAD, (byte) 0x00, (byte) 0x92,
					(byte) 0x8B, (byte) 0x00, (byte) 0x14, (byte) 0x03, (byte) 0x29, (byte) 0x04, (byte) 0x70,
					(byte) 0x12, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x07, (byte) 0x00, (byte) 0x20, (byte) 0x1A, (byte) 0x16, (byte) 0x04,
					(byte) 0xAD, (byte) 0x00, (byte) 0x16, (byte) 0x04, (byte) 0x25, (byte) 0x38, (byte) 0x16,
					(byte) 0x04, (byte) 0x04, (byte) 0x41, (byte) 0x5B, (byte) 0x29, (byte) 0x04, (byte) 0x16,
					(byte) 0x04, (byte) 0xAD, (byte) 0x00, (byte) 0x92, (byte) 0x6C, (byte) 0xEB, (byte) 0x19,
					(byte) 0x03, (byte) 0xAD, (byte) 0x00, (byte) 0x92, (byte) 0x8B, (byte) 0x00, (byte) 0x15,
					(byte) 0x7A, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x07, (byte) 0x00, (byte) 0x20, (byte) 0x03, (byte) 0x24, (byte) 0xAD,
					(byte) 0x01, (byte) 0x8B, (byte) 0x00, (byte) 0x16, (byte) 0x61, (byte) 0x08, (byte) 0x11,
					(byte) 0x63, (byte) 0x01, (byte) 0x8D, (byte) 0x00, (byte) 0x0D, (byte) 0x19, (byte) 0x8B,
					(byte) 0x00, (byte) 0x0B, (byte) 0x2D, (byte) 0x1A, (byte) 0x07, (byte) 0x25, (byte) 0x32,
					(byte) 0x19, (byte) 0x8B, (byte) 0x00, (byte) 0x17, (byte) 0x5B, (byte) 0x29, (byte) 0x04,
					(byte) 0x1F, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x07, (byte) 0x00, (byte) 0x20, (byte) 0x04, (byte) 0x6B, (byte) 0x07,
					(byte) 0x16, (byte) 0x04, (byte) 0x04, (byte) 0x6A, (byte) 0x08, (byte) 0x11, (byte) 0x67,
					(byte) 0x00, (byte) 0x8D, (byte) 0x00, (byte) 0x0D, (byte) 0x1A, (byte) 0x08, (byte) 0x25,
					(byte) 0x29, (byte) 0x05, (byte) 0x16, (byte) 0x05, (byte) 0x10, (byte) 0x7F, (byte) 0x6E,
					(byte) 0x06, (byte) 0x16, (byte) 0x05, (byte) 0x63, (byte) 0x08, (byte) 0x11, (byte) 0x6A,
					(byte) 0x83, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x07, (byte) 0x00, (byte) 0x20, (byte) 0x8D, (byte) 0x00, (byte) 0x0D,
					(byte) 0xAF, (byte) 0x02, (byte) 0x16, (byte) 0x05, (byte) 0x41, (byte) 0x11, (byte) 0x7F,
					(byte) 0xFF, (byte) 0x6F, (byte) 0x08, (byte) 0x11, (byte) 0x6A, (byte) 0x84, (byte) 0x8D,
					(byte) 0x00, (byte) 0x0D, (byte) 0x18, (byte) 0xAF, (byte) 0x02, (byte) 0x16, (byte) 0x05,
					(byte) 0x41, (byte) 0x89, (byte) 0x02, (byte) 0x7A, (byte) 0x03, (byte) 0x24, (byte) 0xAD,
					(byte) 0x01, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x07, (byte) 0x00, (byte) 0x20, (byte) 0x8B, (byte) 0x00, (byte) 0x16,
					(byte) 0x61, (byte) 0x08, (byte) 0x11, (byte) 0x63, (byte) 0x01, (byte) 0x8D, (byte) 0x00,
					(byte) 0x0D, (byte) 0x19, (byte) 0x8B, (byte) 0x00, (byte) 0x0B, (byte) 0x2D, (byte) 0x1A,
					(byte) 0x07, (byte) 0x25, (byte) 0x32, (byte) 0x19, (byte) 0x8B, (byte) 0x00, (byte) 0x17,
					(byte) 0x5B, (byte) 0x29, (byte) 0x04, (byte) 0x1F, (byte) 0x04, (byte) 0x6B, (byte) 0x07,
					(byte) 0x16, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x07, (byte) 0x00, (byte) 0x20, (byte) 0x04, (byte) 0x04, (byte) 0x6A,
					(byte) 0x08, (byte) 0x11, (byte) 0x67, (byte) 0x00, (byte) 0x8D, (byte) 0x00, (byte) 0x0D,
					(byte) 0x1A, (byte) 0x08, (byte) 0x25, (byte) 0x29, (byte) 0x05, (byte) 0x16, (byte) 0x05,
					(byte) 0x10, (byte) 0x7F, (byte) 0x6E, (byte) 0x06, (byte) 0x16, (byte) 0x05, (byte) 0x63,
					(byte) 0x08, (byte) 0x11, (byte) 0x6A, (byte) 0x83, (byte) 0x8D, (byte) 0x00, (byte) 0x0D,
					(byte) 0xAF, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x07, (byte) 0x00, (byte) 0x20, (byte) 0x02, (byte) 0x16, (byte) 0x05,
					(byte) 0x43, (byte) 0x63, (byte) 0x08, (byte) 0x11, (byte) 0x6A, (byte) 0x85, (byte) 0x8D,
					(byte) 0x00, (byte) 0x0D, (byte) 0x18, (byte) 0xAF, (byte) 0x02, (byte) 0x16, (byte) 0x05,
					(byte) 0x43, (byte) 0x89, (byte) 0x02, (byte) 0x7A, (byte) 0x04, (byte) 0x22, (byte) 0x19,
					(byte) 0x8B, (byte) 0x00, (byte) 0x0B, (byte) 0x2D, (byte) 0x19, (byte) 0x8B, (byte) 0x00,
					(byte) 0x13, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x07, (byte) 0x00, (byte) 0x20, (byte) 0x32, (byte) 0x1F, (byte) 0x05,
					(byte) 0x6D, (byte) 0x08, (byte) 0x11, (byte) 0x67, (byte) 0x00, (byte) 0x8D, (byte) 0x00,
					(byte) 0x0D, (byte) 0x19, (byte) 0x05, (byte) 0x8B, (byte) 0x00, (byte) 0x14, (byte) 0x1A,
					(byte) 0x03, (byte) 0xAF, (byte) 0x02, (byte) 0x10, (byte) 0x08, (byte) 0x4F, (byte) 0x5B,
					(byte) 0x38, (byte) 0x1A, (byte) 0x04, (byte) 0xAF, (byte) 0x02, (byte) 0x11, (byte) 0x00,
					(byte) 0xFF, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x07, (byte) 0x00, (byte) 0x20, (byte) 0x53, (byte) 0x5B, (byte) 0x38,
					(byte) 0x19, (byte) 0x03, (byte) 0x05, (byte) 0x8B, (byte) 0x00, (byte) 0x15, (byte) 0x7A,
					(byte) 0x04, (byte) 0x22, (byte) 0x19, (byte) 0x8B, (byte) 0x00, (byte) 0x0B, (byte) 0x2D,
					(byte) 0x19, (byte) 0x8B, (byte) 0x00, (byte) 0x17, (byte) 0x5B, (byte) 0x32, (byte) 0xAD,
					(byte) 0x01, (byte) 0x1A, (byte) 0x08, (byte) 0x1F, (byte) 0x8B, (byte) 0x00, (byte) 0x19,
					(byte) 0x61, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x07, (byte) 0x00, (byte) 0x08, (byte) 0x08, (byte) 0x11, (byte) 0x63,
					(byte) 0x00, (byte) 0x8D, (byte) 0x00, (byte) 0x0D, (byte) 0x7A, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xBC, (byte) 0x07, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB2, (byte) 0x08, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x08, (byte) 0x00, (byte) 0x0D, (byte) 0x08, (byte) 0x00, (byte) 0x0A,
					(byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x00,
					(byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xBC, (byte) 0x08, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB2, (byte) 0x05, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x05, (byte) 0x00, (byte) 0x20, (byte) 0x05, (byte) 0x00, (byte) 0x6A,
					(byte) 0x00, (byte) 0x1A, (byte) 0x02, (byte) 0x00, (byte) 0x02, (byte) 0x01, (byte) 0x02,
					(byte) 0x00, (byte) 0x02, (byte) 0x00, (byte) 0x02, (byte) 0x00, (byte) 0x02, (byte) 0x02,
					(byte) 0x06, (byte) 0x80, (byte) 0x09, (byte) 0x00, (byte) 0x06, (byte) 0x80, (byte) 0x03,
					(byte) 0x00, (byte) 0x03, (byte) 0x80, (byte) 0x09, (byte) 0x08, (byte) 0x03, (byte) 0x80,
					(byte) 0x03, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x05, (byte) 0x00, (byte) 0x20, (byte) 0x01, (byte) 0x01, (byte) 0x00,
					(byte) 0x02, (byte) 0x00, (byte) 0x06, (byte) 0x00, (byte) 0x00, (byte) 0x01, (byte) 0x03,
					(byte) 0x80, (byte) 0x09, (byte) 0x02, (byte) 0x03, (byte) 0x80, (byte) 0x09, (byte) 0x05,
					(byte) 0x03, (byte) 0x80, (byte) 0x0A, (byte) 0x01, (byte) 0x03, (byte) 0x80, (byte) 0x0A,
					(byte) 0x0E, (byte) 0x06, (byte) 0x80, (byte) 0x07, (byte) 0x01, (byte) 0x06, (byte) 0x00,
					(byte) 0x01, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x05, (byte) 0x00, (byte) 0x20, (byte) 0xD2, (byte) 0x06, (byte) 0x00,
					(byte) 0x01, (byte) 0x79, (byte) 0x06, (byte) 0x00, (byte) 0x01, (byte) 0x1D, (byte) 0x06,
					(byte) 0x00, (byte) 0x02, (byte) 0x07, (byte) 0x06, (byte) 0x00, (byte) 0x00, (byte) 0xE5,
					(byte) 0x03, (byte) 0x80, (byte) 0x0A, (byte) 0x07, (byte) 0x03, (byte) 0x80, (byte) 0x0A,
					(byte) 0x09, (byte) 0x03, (byte) 0x80, (byte) 0x0A, (byte) 0x04, (byte) 0x03, (byte) 0x80,
					(byte) 0x09, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x05, (byte) 0x00, (byte) 0x0D, (byte) 0x04, (byte) 0x03, (byte) 0x80,
					(byte) 0x0A, (byte) 0x06, (byte) 0x01, (byte) 0x80, (byte) 0x09, (byte) 0x00, (byte) 0x03,
					(byte) 0x80, (byte) 0x09, (byte) 0x01, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xBC, (byte) 0x05, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB2, (byte) 0x09, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x09, (byte) 0x00, (byte) 0x20, (byte) 0x09, (byte) 0x00, (byte) 0x46,
					(byte) 0x00, (byte) 0x14, (byte) 0x20, (byte) 0x0D, (byte) 0x1F, (byte) 0x1E, (byte) 0x0D,
					(byte) 0x7C, (byte) 0x0E, (byte) 0x0F, (byte) 0x07, (byte) 0x09, (byte) 0x41, (byte) 0x11,
					(byte) 0x05, (byte) 0x05, (byte) 0x41, (byte) 0x0E, (byte) 0x05, (byte) 0x20, (byte) 0x09,
					(byte) 0x1C, (byte) 0x00, (byte) 0x2E, (byte) 0x05, (byte) 0x1E, (byte) 0x07, (byte) 0x2A,
					(byte) 0x04, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x09, (byte) 0x00, (byte) 0x20, (byte) 0x06, (byte) 0x06, (byte) 0x08,
					(byte) 0x0D, (byte) 0x07, (byte) 0x05, (byte) 0x10, (byte) 0x0D, (byte) 0x21, (byte) 0x06,
					(byte) 0x06, (byte) 0x06, (byte) 0x06, (byte) 0x07, (byte) 0x07, (byte) 0x05, (byte) 0x08,
					(byte) 0x24, (byte) 0x08, (byte) 0x08, (byte) 0x04, (byte) 0x09, (byte) 0x12, (byte) 0x15,
					(byte) 0x10, (byte) 0x10, (byte) 0x08, (byte) 0x04, (byte) 0x09, (byte) 0x12, (byte) 0x15,
					(byte) 0x0D, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB4, (byte) 0x09, (byte) 0x00, (byte) 0x09, (byte) 0x0F, (byte) 0x05, (byte) 0x0B,
					(byte) 0x05, (byte) 0x19, (byte) 0x07, (byte) 0x05, (byte) 0x0A, (byte) 0x08, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xBC, (byte) 0x09, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xBA, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0xB8, (byte) 0x00, (byte) 0x00, (byte) 0x14, (byte) 0x0a, (byte) 0xa0, (byte) 0x0,
					(byte) 0x0, (byte) 0x0, (byte) 0x62, (byte) 0x3, (byte) 0x1, (byte) 0xc, (byte) 0x6, (byte) 0x1,
					(byte) 0x08, (byte) 0x0, (byte) 0x0, (byte) 0x05, (byte) 0x01, (byte) 0x02, (byte) 0x03,
					(byte) 0x04, (byte) 0x05, (byte) 0x7F },
			{ (byte) 0x00, (byte) 0xA4, (byte) 0x04, (byte) 0x00, (byte) 0x0a, (byte) 0xa0, (byte) 0x0, (byte) 0x0,
					(byte) 0x0, (byte) 0x62, (byte) 0x3, (byte) 0x1, (byte) 0xc, (byte) 0x6, (byte) 0x1, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0x20, (byte) 0x00, (byte) 0x00, (byte) 0x05, (byte) 0x01, (byte) 0x02, (byte) 0x03,
					(byte) 0x04, (byte) 0x05, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0x30, (byte) 0x00, (byte) 0x00, (byte) 0x01, (byte) 0x64, (byte) 0x7F },
			{ (byte) 0x80, (byte) 0x30, (byte) 0x00, (byte) 0x00, (byte) 0x01, (byte) 0x64, (byte) 0x7F } };
	private static byte[] cvm_request = { (byte) 0x80, (byte) 0x70, (byte) 0x00, (byte) 0x00, (byte) 0x00,
			(byte) 0x00 };

	private static byte[] cvm_condition_codes = {};
	// X=100; Y=0;
	// B1=no cvm req and apply next rule; B2=if value < 100;
	// B1=plaintext pin; B2=if value>100;
	private static byte[] cvm_codes = { (byte) 0x64, (byte) 0x00, (byte) 0x01, (byte) 0x07 };
	private static CadClientInterface cad;
	private static Socket sock;

	private static boolean DONE_TRANSACTION = false;

	private static byte PLAINTEXT_PIN = (byte) 0x01;
	private static byte NO_CVM_REQUIRED = (byte) 0x1F;
	private static byte SKIP_TO_NEXT_NO_CVM = (byte) 0x5F;
	private static int timesCheckedPin = 0;
	private static byte ALWAYS = (byte) 0x00;
	private static byte TRANSACTION_IS_UNDER_X_VALUE = (byte) 0x06;
	private static byte TRANSACTION_IS_ABOVE_X_VALUE = (byte) 0x07;

	public static void main(String[] args) {
		openCref();
		createConnection();
		startTerminal();
		setupWallet();
		getBankCVM();
		getBalance();
		startTransactions();
		getBalance();
		stopTerminal();
	}

	private static void startTransactions() {
		Scanner scanInput = new Scanner(System.in);

		do {
			System.out.println("Introdu valoarea tranzactiei: ");
			Integer intValue = 0;
			try {
				intValue = Integer.parseInt(scanInput.next());
				byte byteValue = intValue.byteValue();
				checkPinRequired(byteValue, scanInput);
			} catch (Exception e) {
				System.out.println("Valoarea trebuie sa fie numerica");
			}

		} // end do
		while (!DONE_TRANSACTION);
	}

	private static boolean createTransaction(byte value, String[] pin) {
		byte[] verifyPin = { (byte) 0x80, (byte) 0x20, (byte) 0x00, (byte) 0x00 };
		byte[] bytePin = {};
		
		if (pin.length > 0) {
			for (int i = 0; i < pin.length; i++) {
				Integer number = Integer.parseInt(pin[i]);
				bytePin = appendToArray(bytePin, number.byteValue());
			}
			Integer pinLength = bytePin.length - 1;
			verifyPin = appendToArray(verifyPin, pinLength.byteValue());
			for (int i = 0; i < bytePin.length; i++) {
				verifyPin = appendToArray(verifyPin, bytePin[i]);
			}
			verifyPin = appendToArray(verifyPin, (byte) 0x7F);
			try {
				Apdu apdu = new Apdu(verifyPin);
				apdu.Lc--;

				cad.exchangeApdu(apdu);
				// System.out.println(apdu);
				
				if (checkResult(byteToHex(apdu.sw1sw2))) {
					System.out.println("Pin confirmat cu succes.");
					// System.out.println(apdu);
					return true;
				} else {
					timesCheckedPin+=1;
					
					if(timesCheckedPin == 3) {
						System.out.println("Pin-ul a fost introdus de mai mult de 3 ori incorect. Tranzactia se anuleaza.");
						DONE_TRANSACTION = true;
					}
					System.out.println("Pin incorect.");
					return false;
				}
				
			
			} catch (Exception e) {
				System.out.println("Eroare la introducerea pin-ului");
				return false;
			}
		} else {
			return true;
		}
	}

	private static void getBalance() {
		try {
			byte[] balance = { (byte) 0x80, (byte) 0x50, (byte) 0x00, (byte) 0x00, (byte) 0x00, (byte) 0x02 };
			Apdu apdu = new Apdu(balance);
			apdu.Lc--;
			cad.exchangeApdu(apdu); // System.out.println(apdu);
			if (checkResult(byteToHex(apdu.sw1sw2))) {
				byte bl = 0;
				byte[] data = apdu.getDataOut();
				for (int i = 0; i < apdu.getLe(); i++) {
					bl += data[i];
				}
				String stringBalance = Integer.toString(Byte.toUnsignedInt(bl));
				System.out.println("Balanta curenta a contului ".concat(stringBalance));
			} else {
				System.out.println("Eroare la preluarea balantei.");
			}
		} catch (Exception e) {
			System.out.println("Eroare la preluarea balantei.");
		}
	}

	private static void debit(byte value) {

		try {
			byte[] transaction = { (byte) 0x80, (byte) 0x40, (byte) 0x00, (byte) 0x00, (byte) 0x01 };
			transaction = appendToArray(transaction, value);
			transaction = appendToArray(transaction, (byte) 0x7F);
			Apdu apdu = new Apdu(transaction);
			apdu.Lc--;
			cad.exchangeApdu(apdu);
			if (checkResult(byteToHex(apdu.sw1sw2))) {
				DONE_TRANSACTION = true;
				System.out.println("Debitarea s-a realizat cu succes");
			} else {
				System.out.println("Debitarea nu s-a realizat cu succes");
				DONE_TRANSACTION = true;
			}
		} catch (Exception e) {
			System.out.println("Debitarea nu s-a realizat cu succes");
			DONE_TRANSACTION = true;
		}
	}

	private static void requirePin(byte value, Scanner scanInput) {
		do {
			System.out.println("Te rog introdu PIN-ul: ");
			String pin = "";
			try {
				pin = scanInput.next();
				String[] p = pin.split("");
				if (createTransaction(value, p)) {
					debit(value);
				}
//					byte k = Integer.byteValue(Integer.parseInt(pin[i]));

			} catch (Exception e) {
				System.out.println("PIN necorespunzator");
			}

		} // end do
		while (!DONE_TRANSACTION);
	}

	private static void checkPinRequired(byte byteValue, Scanner scanInput) {
		boolean biggerThanX = (Byte.compare(byteValue, cvm_codes[0]) >= 0);
		int i;
		boolean booleanPin = false;
		for (i = 2; i < cvm_codes.length; i += 2) {
			int pinRequired = checkCvmCodes(cvm_codes[i], cvm_codes[i + 1], biggerThanX);
			if (pinRequired == 0) {
				break;
			}
			if (pinRequired == 1) {
				booleanPin = true;
				break;
			}
			if (pinRequired == -1) {
				i += 2;
			}
			if (pinRequired == -2) {
				System.out.println("Eroare");
				break;
			}
		}
		if (!booleanPin) {
			biggerThanX = (Byte.compare(byteValue, cvm_condition_codes[0]) >= 0);
			for (i = 2; i < cvm_condition_codes.length; i += 2) {
				int pinRequired = checkCvmCodes(cvm_condition_codes[i], cvm_condition_codes[i + 1], biggerThanX);
				if (pinRequired == 0) {
					break;
				}
				if (pinRequired == 1) {
					booleanPin = true;
					break;
				}
				if (pinRequired == -1) {
					continue;
				}
				if (pinRequired == -2) {
					System.out.println("Eroare");
					break;
				}
			}
		}

		if (!booleanPin) {
			if (createTransaction(byteValue, new String[0])) {
				debit(byteValue);
			}
		} else {
			requirePin(byteValue, scanInput);
		}

	}

	private static int checkCvmCodes(byte b1, byte b2, boolean biggerThanX) {
		if (b1 == PLAINTEXT_PIN) {
			if (ruleApplies(b2, biggerThanX)) {
				return 1;
			} else {
				return 0;
			}
		}
		if (b1 == NO_CVM_REQUIRED) {
			if (ruleApplies(b2, biggerThanX)) {
				return 0;
			} else {
				return -2;
			}
		}
		if (b1 == SKIP_TO_NEXT_NO_CVM) {
			if (ruleApplies(b2, biggerThanX)) {
				return 0;
			} else {
				return -1;
			}
		}
		return 0;
	}

	private static boolean ruleApplies(byte b2, boolean biggerThanX) {
		if (b2 == ALWAYS) {
			return true;
		}
		if (b2 == TRANSACTION_IS_UNDER_X_VALUE) {
			if (biggerThanX) {
				return false; // regula nu se aplica daca valoarea e mai mare decat X
			} else {
				return true; // regula se aplica daca valoarea e mai mica decat X
			}
		}
		if (b2 == TRANSACTION_IS_ABOVE_X_VALUE) {
			if (biggerThanX) {
				return true;
			} else {
				return false;
			}
		}
		return true;
	}

	private static void getBankCVM() {
		try {
			Apdu apdu = new Apdu();
			apdu.command = cvm_request;
			apdu.setDataIn(null, 0);
			apdu.Le = 0;
			cad.exchangeApdu(apdu);
			String responseCode = byteToHex(apdu.sw1sw2);
			if (checkResult(responseCode)) {
				byte[] dataOut = apdu.getDataOut();
				for (int i = 0; i < apdu.getLe(); i++) {
					cvm_condition_codes = appendToArray(cvm_condition_codes, dataOut[i]);
				}
				System.out.println("Get Cardholder CVM apelat cu succes.");
			} else {
				System.out.println("Get Cardholder CVM nu s-a realizat cu succes.");
			}
		} catch (Exception e) {
			System.out.println("Eroare la preluarea CVM-ului bancii");
		}

	}

	private static byte[] appendToArray(byte[] array, byte byteToAppend) {
		byte[] c = new byte[array.length + 1];
		for (int i = 0; i < array.length; i++) {
			c[i] = array[i];
		}
		c[array.length] = byteToAppend;
		return c;
	}

	private static void setupWallet() {
		try {
			for (int i = 0; i < instructionArray.length; i++) {
				Apdu apdu = new Apdu(instructionArray[i]);
				apdu.Lc--;
				cad.exchangeApdu(apdu);
				// System.out.println(apdu);
				if (i == instructionArray.length - 1) {
					String responseCode = byteToHex(apdu.sw1sw2);
					if (!checkResult(responseCode)) {
						System.out.println("Cererea nu s-a realizat cu succes.");
						break;
					} else {
						System.out.println("Setup wallet complet.");
					}
				}
			}
		} catch (Exception e) {
			System.out.println("Eroare la instalarea applet-ului.");
		}
	}

	private static boolean checkResult(String result) {
		if (SUCCESS_CODE.equals(result)) {
			return true;
		} else {
			return false;
		}
	}

	private static String byteToHex(byte[] by) {
		int value = 0;
		for (int k = 0; k < by.length; k++) {
			value += ((long) by[k] & 0xffL) << (8 * k);
		}
		return Integer.toHexString(value).trim();
	}

	private static void startTerminal() {
		try {
			cad.powerUp();
			System.out.println("Terminalul a fost pornit cu succes.");
		} catch (Exception e) {
			System.out.println("Eroare la deschiderea terminalului.");
		}
	}

	private static void stopTerminal() {
		try {
			System.out.println("Terminalul a fost oprit cu succes.");
			cad.powerDown();
		} catch (Exception e) {
			System.out.println("Eroare la inchiderea terminalului.");
		}
	}

	private static void createConnection() {
		try {
			sock = new Socket("localhost", 9025);
			InputStream is = sock.getInputStream();
			OutputStream os = sock.getOutputStream();
			cad = CadDevice.getCadClientInstance(CadDevice.PROTOCOL_T0, is, os);
			System.out.println("Conexiune realizata cu succes la applet.");
		} catch (Exception e) {
			System.out.println("Eroare la conectarea cu applet-ul");
		}
	}

	private static void openCref() {
		try {
			System.out.println("cref_t0.exe a fost deschis.");
			File cref = new File(
					"C:\\Program Files (x86)\\Oracle\\Java Card Development Kit Simulator 3.1.0\\bin\\cref_t0.exe");
			Desktop.getDesktop().open(cref);
		} catch (Exception e) {
			System.out.println("Eroare la deschiderea fisierului");
		}
	}
}

