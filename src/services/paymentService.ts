import { PaymentMethodType } from '../types/order';

export interface PaymentProcessRequest {
  orderId: string;
  amount: number;
  method: PaymentMethodType;
  upiId?: string;
  cardNumber?: string;
}

export interface PaymentProcessResponse {
  success: boolean;
  transactionId?: string;
  error?: string;
}

export interface IPaymentService {
  processPayment(req: PaymentProcessRequest): Promise<PaymentProcessResponse>;
}

class MockPaymentService implements IPaymentService {
  async processPayment(req: PaymentProcessRequest): Promise<PaymentProcessResponse> {
    // Simulate brief network verification
    await new Promise((res) => setTimeout(res, 800));

    if (req.method === 'cod') {
      return {
        success: true,
        transactionId: `COD-${Date.now().toString().slice(-6)}`,
      };
    }

    if (req.method === 'upi') {
      if (req.upiId && !req.upiId.includes('@')) {
        return {
          success: false,
          error: 'Please provide a valid UPI ID (e.g. name@okhdfcbank or phone@upi)',
        };
      }
      return {
        success: true,
        transactionId: `UPI-${Date.now().toString().slice(-8)}`,
      };
    }

    if (req.method === 'card') {
      if (req.cardNumber && req.cardNumber.replace(/\s+/g, '').length < 16) {
        return {
          success: false,
          error: 'Invalid card number length. Please check the 16 digits.',
        };
      }
      return {
        success: true,
        transactionId: `TXN-CARD-${Date.now().toString().slice(-8)}`,
      };
    }

    return {
      success: true,
      transactionId: `NB-${Date.now().toString().slice(-6)}`,
    };
  }
}

export const paymentService: IPaymentService = new MockPaymentService();
