import { PaymentMethod, PaymentStatus } from '../../types';

export type { PaymentMethod, PaymentStatus };

export interface RazorpayModalProps {
  isOpen: boolean;
  amountPaise: number;
  orderReference?: string;
  onSuccess: (paymentId: string) => void;
  onFailure: (reason: string) => void;
  onClose: () => void;
}
