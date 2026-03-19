// @dsp obj-a43fb66a
import * as React from 'react'
import { cn } from '../../utils/cn'

export type ButtonVariant = 'primary' | 'green' | 'outline' | 'ghost'
export type ButtonSize = 'md' | 'lg' | 'xl'

export interface ButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: ButtonVariant
  size?: ButtonSize
}

// @dsp func-1e7783bf
export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = 'primary', size = 'md', type, ...props }, ref) => {
    const computedType = type ?? 'button'

    return (
      <button
        ref={ref}
        type={computedType}
        className={cn(
          'hp-btn',
          variant === 'primary' && 'hp-btn--primary',
          variant === 'green' && 'hp-btn--green',
          variant === 'outline' && 'hp-btn--outline',
          variant === 'ghost' && 'hp-btn--ghost',
          size === 'md' && 'hp-btn--md',
          size === 'lg' && 'hp-btn--lg',
          size === 'xl' && 'hp-btn--xl',
          className,
        )}
        {...props}
      />
    )
  },
)

Button.displayName = 'Button'


