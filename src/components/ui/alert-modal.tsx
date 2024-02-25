'use client';

import { useEffect, useState } from 'react';

import { Modal } from '@/components/ui/modal';
import { Button } from '@/components/ui/button';

interface AlertModalProps {
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  loading: boolean;
  children?: React.ReactNode;
}

export const AlertModal: React.FC<AlertModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  loading,
  children,
  description,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  return (
    <Modal
      title="Are you sure?"
      description={!description ? 'This action cannot be undone.' : description}
      isOpen={isOpen}
      onClose={onClose}
    >
      {children}
      <div className="flex w-full items-center justify-end space-x-2 pt-6">
        <Button disabled={loading} variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type='submit' disabled={loading} variant="destructive" onClick={onConfirm}>
          {loading ? (
            <>
              Loading
            </>
          ) : (
            'Confirm'
          )}
        </Button>
      </div>
    </Modal>
  );
};
