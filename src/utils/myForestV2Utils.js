export const calculatePercentage = (target, gift, personal) => {
  if (target > gift + personal) {
    const total = target + gift + personal;
    const giftPercentage = (gift / total) * 100;
    const personalPercentage = (personal / total) * 100;
    return { giftPercentage, personalPercentage };
  } else {
    const total = gift + personal;
    const giftPercentage = (gift / total) * 100;
    const personalPercentage = (personal / total) * 100;
    return { giftPercentage, personalPercentage };
  }
};
