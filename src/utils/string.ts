export const codeToString = (value: string) => {
  if (value) {
    const words = value.replaceAll("-", " ");
    return words.charAt(0).toUpperCase() + words.slice(1);
  }
};

export const byteToString = (value?: number) => {
  if (value === undefined) return 0;
  if (value > Math.pow(1024, 3))
    return `${(value / Math.pow(1024, 3)).toFixed(2)} GB`;
  if (value > Math.pow(1024, 2))
    return `${(value / Math.pow(1024, 2)).toFixed(2)} MB`;
  if (value > 1024) return `${(value / 1024).toFixed(2)} KB`;
  return `${value} B`;
};
