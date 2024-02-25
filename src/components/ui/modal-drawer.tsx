'use client';

import {
  ModalDrawer,
  ModalDrawerBody,
  ModalDrawerContent,
  ModalDrawerDescription,
  ModalDrawerHeader,
  ModalDrawerTitle,
} from '@/components/ui/modal-drawer-wrapper';
import { useEffect, useState } from 'react';

interface ModalProps {
  title?: string;
  description?: string;
  isOpen: boolean;
  onClose: () => void;
  children?: React.ReactNode;
  className?: string;
}

export const ModalDrawerComponent: React.FC<ModalProps> = ({
  title,
  description,
  isOpen,
  onClose,
  children,
  className,
}) => {
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    setIsMounted(true);
  }, []);

  if (!isMounted) {
    return null;
  }

  const onChange = (open: boolean) => {
    if (!open) {
      onClose();
    }
  };
  return (
    <ModalDrawer open={isOpen} onOpenChange={onChange}>
      <ModalDrawerContent className={className}>
        <ModalDrawerHeader>
          <ModalDrawerTitle>{title}</ModalDrawerTitle>
          <ModalDrawerDescription>{description}</ModalDrawerDescription>
        </ModalDrawerHeader>
        <ModalDrawerBody>{children}</ModalDrawerBody>
      </ModalDrawerContent>
    </ModalDrawer>
  );
};
