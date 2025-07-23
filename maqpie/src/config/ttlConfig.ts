export type TtlConfig = {
  label: string;
  device: string;
};

export function getTtlConfigs(): TtlConfig[] {
  const keys = import.meta.env.VITE_TTL_KEYS;
  if (!keys) return [];

  return keys.split(',').map((key_: string) => {
    const key = key_.trim().toUpperCase();

    return {
      label: import.meta.env[`VITE_TTL_${key}_LABEL`]!,
      device: import.meta.env[`VITE_TTL_${key}_DEVICE`]!,
    };
  });
}
