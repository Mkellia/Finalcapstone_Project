"use client";
import { Toaster as ChakraToaster, createToaster } from "@chakra-ui/react";

export const toaster = createToaster({
  placement: 'top-end',
  pauseOnPageIdle: true,
});

const typeStyles: Record<string, { bg: string; border: string; color: string }> = {
  success: { bg: '#F0FFF4', border: '#68D391', color: '#276749' },
  error:   { bg: '#FFF5F5', border: '#FC8181', color: '#9B2C2C' },
  info:    { bg: '#EBF8FF', border: '#63B3ED', color: '#2C5282' },
  warning: { bg: '#FFFAF0', border: '#F6AD55', color: '#7B341E' },
};

export function Toaster() {
  return (
    <ChakraToaster toaster={toaster}>
      {(toast) => {
        const style = typeStyles[toast.type ?? 'info'] ?? typeStyles.info;
        return (
          <div style={{
            background: style.bg,
            border: `1px solid ${style.border}`,
            borderRadius: '10px',
            padding: '12px 16px',
            minWidth: '280px',
            maxWidth: '380px',
            boxShadow: '0 4px 16px rgba(0,0,0,0.12)',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
          }}>
            {toast.title && (
              <p style={{ margin: 0, fontWeight: 600, fontSize: '14px', color: style.color }}>
                {toast.title as string}
              </p>
            )}
            {toast.description && (
              <p style={{ margin: 0, fontSize: '13px', color: style.color, opacity: 0.85 }}>
                {toast.description as string}
              </p>
            )}
          </div>
        );
      }}
    </ChakraToaster>
  );
}