import React from 'react';
import * as ToastPrimitive from '@radix-ui/react-toast';
import { X } from 'lucide-react';

interface ToastProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  title: string;
  description?: string;
  variant?: 'success' | 'error' | 'info';
}

export const Toast: React.FC<ToastProps> = ({
  open,
  onOpenChange,
  title,
  description,
  variant = 'info',
}) => {
  const variantStyles = {
    success: 'bg-success text-success-foreground',
    error: 'bg-error text-error-foreground',
    info: 'bg-info text-info-foreground',
  };

  return (
    <ToastPrimitive.Provider swipeDirection="right">
      <ToastPrimitive.Root
        open={open}
        onOpenChange={onOpenChange}
        className={`${variantStyles[variant]} rounded-lg shadow-lg p-4 flex items-start gap-3 max-w-sm`}
        duration={3000}
      >
        <div className="flex-1">
          <ToastPrimitive.Title className="font-medium text-body">
            {title}
          </ToastPrimitive.Title>
          {description && (
            <ToastPrimitive.Description className="text-body-sm mt-1 opacity-90">
              {description}
            </ToastPrimitive.Description>
          )}
        </div>
        <ToastPrimitive.Close className="text-current opacity-70 hover:opacity-100">
          <X className="w-4 h-4" strokeWidth={1.5} />
        </ToastPrimitive.Close>
      </ToastPrimitive.Root>
      <ToastPrimitive.Viewport className="fixed bottom-0 right-0 p-6 flex flex-col gap-2 w-full max-w-sm z-50" />
    </ToastPrimitive.Provider>
  );
};
