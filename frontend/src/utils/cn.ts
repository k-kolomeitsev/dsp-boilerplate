// @dsp obj-640c3440

// @dsp func-1e904370
export function cn(...classes: Array<string | false | null | undefined>): string {
  return classes.filter(Boolean).join(' ')
}


