import React, { useState } from 'react';
import { CheckCircle2, ShieldCheck } from 'lucide-react';
import { Modal } from '../../components/common/Modal';
import { Button } from '../../components/common/Button';
import { formatPaise } from '../../utils/currency';
import { RazorpayModalProps } from './payment.types';
import './payments.css';

export const RazorpayModal: React.FC<RazorpayModalProps> = ({
  isOpen,
  amountPaise,
  onSuccess,
  onFailure,
  onClose,
}) => {
  const [isProcessing, setIsProcessing] = useState(false);

  const handleSimulateSuccess = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setIsProcessing(false);
      onSuccess(`pay_${Date.now()}`);
    }, 700);
  };

  const handleSimulateFailure = () => {
    onFailure('Transaction declined by issuing bank (Sandbox simulation)');
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Razorpay Payment Gateway">
      <div>
        <div className="razorpay-amount-box">
          <div className="razorpay-amount-label">Payable to FarmDirect Escrow</div>
          <div className="razorpay-amount-val">{formatPaise(amountPaise)}</div>
          <span className="razorpay-mode-badge">Sandbox Test Mode</span>
        </div>

        <div className="razorpay-actions">
          <Button
            variant="primary"
            fullWidth
            isLoading={isProcessing}
            onClick={handleSimulateSuccess}
          >
            <CheckCircle2 size={16} /> Simulate Successful Payment
          </Button>

          <Button variant="danger" fullWidth onClick={handleSimulateFailure}>
            Simulate Failed Payment
          </Button>
        </div>

        <div className="mt-4 text-center text-caption flex items-center justify-center gap-1">
          <ShieldCheck size={14} color="var(--color-primary)" />
          <span>Direct farm settlement • Bank grade 256-bit SSL</span>
        </div>
      </div>
    </Modal>
  );
};
