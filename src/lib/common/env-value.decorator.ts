// @dsp obj-bcf69896

// @dsp func-c32225c8
export interface EnvParam<TProperty> {
  name?: string;
  transform?: (raw: string) => TProperty;
  defaultValue?: TProperty;
}

// @dsp func-d19dfe95
export function EnvValue<TProperty>(params?: EnvParam<TProperty>) {
  return (target: any, propertyKey: string | symbol) => {
    const { name, transform, defaultValue } = params || {};
    const propertyType = (Reflect as any).getMetadata(
      'design:type',
      target,
      propertyKey,
    );
    const k = name || (propertyKey as string);
    const v = process.env[k];
    const storageKey = Symbol(`env:${String(propertyKey)}`);
    let value;

    if (v) {
      switch (propertyType) {
        case Number:
          value = parseFloat(v);
          break;
        case Boolean:
          // eslint-disable-next-line no-case-declarations
          const t = v.toLowerCase();
          value = ['true', '1', 'on', 'yes'].includes(t);
          break;
        default:
          value = transform ? transform(v) : v;
      }
    } else {
      value = typeof defaultValue !== 'undefined' ? defaultValue : target[k];
    }
    Object.defineProperty(target, propertyKey, {
      get() {
        const current = this[storageKey];
        return typeof current === 'undefined' ? value : current;
      },
      set(newValue) {
        if (typeof newValue === 'undefined') {
          // Class initialization with useDefineForClassFields writes undefined;
          // ignore it to avoid overwriting the value from env.
          return;
        }
        this[storageKey] = newValue;
      },
      enumerable: true,
    });
  };
}
