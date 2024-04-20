export const formatAddress = (address: string) => {
  return `${address.slice(1, 7)}...${address.slice(-5, -1)}`;
};
