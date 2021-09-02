export const codeToString = (value: string) => {
  if (value) {
    const words = value.replaceAll("-", " ");
    return words.charAt(0).toUpperCase() + words.slice(1);
  }
};
