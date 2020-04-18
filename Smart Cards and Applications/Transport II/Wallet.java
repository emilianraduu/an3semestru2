/** 
 * Copyright (c) 1998, 2019, Oracle and/or its affiliates. All rights reserved.
 * 
 */

/*
 */

/*
 * @(#)Wallet.java	1.11 06/01/03
 */

package com.oracle.jcclassic.samples.wallet;

import javacard.framework.APDU;
import javacard.framework.Applet;
import javacard.framework.ISO7816;
import javacard.framework.ISOException;
import javacard.framework.OwnerPIN;

public class Wallet extends Applet {

    /* constants declaration */

    // code of CLA byte in the command APDU header
    final static byte Wallet_CLA = (byte) 0x80;

    // codes of INS byte in the command APDU header
    final static byte VERIFY = (byte) 0x20;
    final static byte CREDIT = (byte) 0x30;
    final static byte DEBIT = (byte) 0x40;
    final static byte GET_BALANCE = (byte) 0x50;
    final static byte PAY_PASS = (byte) 0x70;
    // maximum balance
    final static short MAX_BALANCE = 0x7FFF;
    // maximum transaction amount
    final static byte MAX_TRANSACTION_AMOUNT = 127;

    // maximum number of incorrect tries before the
    // PIN is blocked
    final static byte PIN_TRY_LIMIT = (byte) 0x03;
    // maximum size PIN
    final static byte MAX_PIN_SIZE = (byte) 0x08;

    // signal that the PIN verification failed
    final static short SW_VERIFICATION_FAILED = 0x6300;
    // signal the the PIN validation is required
    // for a credit or a debit transaction
    final static short SW_PIN_VERIFICATION_REQUIRED = 0x6301;
    // signal invalid transaction amount
    // amount > MAX_TRANSACTION_AMOUNT or amount < 0
    final static short SW_INVALID_TRANSACTION_AMOUNT = 0x6A83;

    // signal that the balance exceed the maximum
    final static short SW_EXCEED_MAXIMUM_BALANCE = 0x6A84;
    // signal the the balance becomes negative
    final static short SW_NEGATIVE_BALANCE = 0x6A85;

    /* instance variables declaration */
    OwnerPIN pin;
    short balance;
    short freeExpensiveTickets = 0;
    short globalExpensiveTicketCount = 0;
    short freeCheapTickets = 0;
    short globalCheapTicketCount = 0;
    
    boolean hasExpensiveSubscription = false;
    boolean hasCheapSubscription = false;
    
    short expensiveSubscriptionPrice = 35;
    short cheapSubscriptionPrice = 25;
    
    short cheapSubscriptionDay = 0;
    short cheapSubscriptionMonth = 0;
    
    short expensiveSubscriptionDay = 0;
    short expensiveSubscriptionMonth = 0;
    private Wallet(byte[] bArray, short bOffset, byte bLength) {

        // It is good programming practice to allocate
        // all the memory that an applet needs during
        // its lifetime inside the constructor
        pin = new OwnerPIN(PIN_TRY_LIMIT, MAX_PIN_SIZE);

        byte iLen = bArray[bOffset]; // aid length
        bOffset = (short) (bOffset + iLen + 1);
        byte cLen = bArray[bOffset]; // info length
        bOffset = (short) (bOffset + cLen + 1);
        byte aLen = bArray[bOffset]; // applet data length

        // The installation parameters contain the PIN
        // initialization value
        pin.update(bArray, (short) (bOffset + 1), aLen);
        register();

    } // end of the constructor

    public static void install(byte[] bArray, short bOffset, byte bLength) {
        // create a Wallet applet instance
        new Wallet(bArray, bOffset, bLength);
    } // end of install method

    @Override
    public boolean select() {

        // The applet declines to be selected
        // if the pin is blocked.
        if (pin.getTriesRemaining() == 0) {
            return false;
        }

        return true;

    }// end of select method

    @Override
    public void deselect() {

        // reset the pin value
        pin.reset();

    }

    @Override
    public void process(APDU apdu) {

        // APDU object carries a byte array (buffer) to
        // transfer incoming and outgoing APDU header
        // and data bytes between card and CAD

        // At this point, only the first header bytes
        // [CLA, INS, P1, P2, P3] are available in
        // the APDU buffer.
        // The interface javacard.framework.ISO7816
        // declares constants to denote the offset of
        // these bytes in the APDU buffer

        byte[] buffer = apdu.getBuffer();
        // check SELECT APDU command

        if (apdu.isISOInterindustryCLA()) {
            if (buffer[ISO7816.OFFSET_INS] == (byte) (0xA4)) {
                return;
            }
            ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
        }

        // verify the reset of commands have the
        // correct CLA byte, which specifies the
        // command structure
        if (buffer[ISO7816.OFFSET_CLA] != Wallet_CLA) {
            ISOException.throwIt(ISO7816.SW_CLA_NOT_SUPPORTED);
        }

        switch (buffer[ISO7816.OFFSET_INS]) {
            case GET_BALANCE:
                getBalance(apdu);
                return;
            case DEBIT:
                debit(apdu);
                return;
            case CREDIT:
                credit(apdu);
                return;
            case VERIFY:
                verify(apdu);
                return;
            case PAY_PASS:
            	paypass(apdu);
            	return;
            default:
                ISOException.throwIt(ISO7816.SW_INS_NOT_SUPPORTED);
        }

    } // end of process method

    private void paypass(APDU apdu) {
    	   if (!pin.isValidated()) {
               ISOException.throwIt(SW_PIN_VERIFICATION_REQUIRED);
           }

           byte[] buffer = apdu.getBuffer();

           byte numBytes = (buffer[ISO7816.OFFSET_LC]);

           byte byteRead = (byte) (apdu.setIncomingAndReceive());

           // If numBytes isn't 3 (type, day and month) throw error
           if ((numBytes != 3) || (byteRead != 3)) {
               ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
           }

           // Get subscription type (1 cheap, 2 expensive)
           short subscriptionType = (short)(buffer[ISO7816.OFFSET_CDATA]);
           short dayStart = (short)(buffer[ISO7816.OFFSET_CDATA + 1]);
           short monthStart = (short)(buffer[ISO7816.OFFSET_CDATA + 2]);
           
           if((dayStart < 1 || dayStart > 30) || (monthStart < 1 || monthStart > 12)) {
        	   // custom error here
        		ISOException.throwIt(SW_NEGATIVE_BALANCE);
           }
           
           if(subscriptionType == 1) {
        	   if(balance - cheapSubscriptionPrice < 0 && hasCheapSubscription == false) {
               	ISOException.throwIt(SW_NEGATIVE_BALANCE);
               }
        	   if(hasCheapSubscription == true) {
        		   // custom error here
        		   ISOException.throwIt(SW_NEGATIVE_BALANCE);
        	   }
        	   else {
        		   balance -= cheapSubscriptionPrice;
        		   hasCheapSubscription = true;
        		   cheapSubscriptionDay = dayStart;
        		   cheapSubscriptionMonth = monthStart;
        	   }
           }
           if(subscriptionType == 2) {
        	   if(balance - expensiveSubscriptionPrice < 0 && hasExpensiveSubscription == false) {
               	ISOException.throwIt(SW_NEGATIVE_BALANCE);
               }
        	   if(hasExpensiveSubscription == true) {
        		   // custom error here
        		   ISOException.throwIt(SW_NEGATIVE_BALANCE);
        	   }
        	   else {
        		   balance -= expensiveSubscriptionPrice;
        		   hasExpensiveSubscription = true;
        		   expensiveSubscriptionDay = dayStart;
        		   expensiveSubscriptionMonth = monthStart;
        	   }
           }
    }
    private void credit(APDU apdu) {

        // access authentication
        if (!pin.isValidated()) {
            ISOException.throwIt(SW_PIN_VERIFICATION_REQUIRED);
        }

        byte[] buffer = apdu.getBuffer();

        // Lc byte denotes the number of bytes in the
        // data field of the command APDU
        byte numBytes = buffer[ISO7816.OFFSET_LC];

        // indicate that this APDU has incoming data
        // and receive data starting from the offset
        // ISO7816.OFFSET_CDATA following the 5 header
        // bytes.
        byte byteRead = (byte) (apdu.setIncomingAndReceive());

        // it is an error if the number of data bytes
        // read does not match the number in Lc byte
        if ((numBytes != 1) || (byteRead != 1)) {
            ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
        }

        // get the credit amount
        byte creditAmount = buffer[ISO7816.OFFSET_CDATA];

        // check the credit amount
        if ((creditAmount > MAX_TRANSACTION_AMOUNT) || (creditAmount < 0)) {
            ISOException.throwIt(SW_INVALID_TRANSACTION_AMOUNT);
        }

        // check the new balance
        if ((short) (balance + creditAmount) > MAX_BALANCE) {
            ISOException.throwIt(SW_EXCEED_MAXIMUM_BALANCE);
        }

        // credit the amount
        balance = (short) (balance + creditAmount);

    } // end of deposit method

    private void debit(APDU apdu) {

        // access authentication
        if (!pin.isValidated()) {
            ISOException.throwIt(SW_PIN_VERIFICATION_REQUIRED);
        }

        byte[] buffer = apdu.getBuffer();

        byte numBytes = (buffer[ISO7816.OFFSET_LC]);

        byte byteRead = (byte) (apdu.setIncomingAndReceive());

        // If numBytes isn't 2 (amount, type, day and month) throw error
        if ((numBytes != 4) || (byteRead != 4)) {
            ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
        }

        // Get ticket amount and ticket type
        short ticketAmount = (short)(buffer[ISO7816.OFFSET_CDATA]);
        short ticketType = (short)(buffer[ISO7816.OFFSET_CDATA + 1]);
        
        short day = (short)(buffer[ISO7816.OFFSET_CDATA + 2]);
        short month = (short)(buffer[ISO7816.OFFSET_CDATA + 3]);
        // Initialize debitAmount = 0
        short debitAmount = 0;
        
        // type 1 and type 2 are the cheap tickets
        if(ticketType == 1 || ticketType == 2) {
        	// increment the counter for how many cheap tickets were purchased
        		debitAmount = 1;
        		globalCheapTicketCount += ticketAmount;

        } else {
        	// type 3 and 4 are the expensive tickets
        	if(ticketType == 3 || ticketType == 4) {
        		debitAmount = 3;
        		// increment the counter for how many expensive tickets were purchased
        		globalExpensiveTicketCount += ticketAmount;
        	}
        }
        // check if there are any discounts
        while(globalCheapTicketCount > 30) {
        	freeCheapTickets += 1;
        	globalCheapTicketCount -= 30;
        }
        while(globalExpensiveTicketCount > 10) {
        	freeExpensiveTickets += 1;
        	globalExpensiveTicketCount -= 10;
        }
        // calculate the amount that needs to be payed
        debitAmount = (short)(debitAmount * ticketAmount);

        // subtract free tickets amount
        if(freeCheapTickets > 0 && (ticketType == 1 || ticketType == 2)) {
        	debitAmount -= freeCheapTickets;
        }
        if(freeExpensiveTickets > 0 && (ticketType == 3 || ticketType == 4)) {
        	debitAmount -= freeExpensiveTickets * 3;
        }

       	if(hasCheapSubscription == true && (ticketType == 1 || ticketType == 2)) {
    		if(checkDateValidity(day, month, cheapSubscriptionDay, cheapSubscriptionMonth)) {
    			debitAmount = 0;
    		} else {
    			hasCheapSubscription = false;
    			cheapSubscriptionDay = 0;
    			cheapSubscriptionMonth = 0;
    		}
    	}
      	if(hasExpensiveSubscription == true && (ticketType == 3 || ticketType == 4)) {
    		if(checkDateValidity(day, month, expensiveSubscriptionDay, expensiveSubscriptionMonth)) {
    			debitAmount = 0;
    		} else {
    			hasExpensiveSubscription = false;
    			expensiveSubscriptionDay = 0;
    			expensiveSubscriptionMonth = 0;
    		}
    	}
        // check if user can afford the tickets
        if(balance - debitAmount < 0) {
        	ISOException.throwIt(ISO7816.SW_APPLET_SELECT_FAILED);
        } else {
        balance = (short) (balance - debitAmount);
        }

    } // end of debit method
    
    
    // custom function to check date validity
    private boolean checkDateValidity(short day, short month, short startDay, short startMonth) {
    	boolean validDay = checkDay(day, startDay);
    	boolean validMonth = checkMonth(month, startMonth);
    	if(validDay && validMonth) {
    		return true;
    	} else {
    		return false;
    	}
    }
    private boolean checkDay(short day, short startDay) {
    	if(day < 0 || day > 30) {
    		return false;
    	}
    	if(startDay == 1) {
    		startDay = 31;
    		if(startDay-1 < day) {
    			return false;
    		}
    		startDay = 1;
    	}
    	return true;
    }
    private boolean checkMonth(short month, short startMonth) {
    	if(month < 0 || month > 12) {
    		return false;
    	}
    	if(startMonth == 12) {
    		startMonth = 0;
    		if(startMonth+1 < month) {
    			return false;
    		}
    		startMonth = 12;
    	}
    	if(startMonth+1 < month) {
			return false;
		}
    	return true;
    }
    private void getBalance(APDU apdu) {

        byte[] buffer = apdu.getBuffer();

        // inform system that the applet has finished
        // processing the command and the system should
        // now prepare to construct a response APDU
        // which contains data field
        short le = apdu.setOutgoing();

        if (le < 2) {
            ISOException.throwIt(ISO7816.SW_WRONG_LENGTH);
        }

        // informs the CAD the actual number of bytes
        // returned
        apdu.setOutgoingLength((byte) 2);

        // move the balance data into the APDU buffer
        // starting at the offset 0
        buffer[0] = (byte) (balance >> 8);
        buffer[1] = (byte) (balance & 0xFF);

        // send the 2-byte balance at the offset
        // 0 in the apdu buffer
        apdu.sendBytes((short) 0, (short) 2);

    } // end of getBalance method

    private void verify(APDU apdu) {

        byte[] buffer = apdu.getBuffer();
        // retrieve the PIN data for validation.
        byte byteRead = (byte) (apdu.setIncomingAndReceive());

        // check pin
        // the PIN data is read into the APDU buffer
        // at the offset ISO7816.OFFSET_CDATA
        // the PIN data length = byteRead
        if (pin.check(buffer, ISO7816.OFFSET_CDATA, byteRead) == false) {
            ISOException.throwIt(SW_VERIFICATION_FAILED);
        }

    } // end of validate method
} // end of class Wallet


