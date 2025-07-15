export const getImageUrl = (imagePath: string) => {
  return new URL(`../../../public/${imagePath}`, import.meta.url).href;
};
