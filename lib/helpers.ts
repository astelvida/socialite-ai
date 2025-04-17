export const fakeFetch = async (data: unknown = true, delay: number = 1000) => {
  return new Promise(resolve => {
    setTimeout(() => {
      resolve(data);
    }, delay);
  });
};
