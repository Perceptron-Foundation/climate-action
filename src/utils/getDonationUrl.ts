// calling this function before window is loaded may cause an error
export const getDonationUrl = (
  tenant: string | null,
  id: string,
  token: string | null,
  embed?: string | undefined | string[],
  callbackUrl?: string | undefined | string[],
  slug?: string
): string => {
  const country = localStorage.getItem('countryCode');
  const language = localStorage.getItem('language');
  let directGift = localStorage.getItem('directGift');
  if (directGift) {
    directGift = JSON.parse(directGift);
  }

  const callback_url = embed === 'true' ? callbackUrl : window.location.href;

  const sourceUrl = `${process.env.NEXT_PUBLIC_DONATION_URL}/?to=${id}${
    callback_url !== undefined ? '&callback_url=' + callback_url : ''
  }&country=${country}&locale=${language}${
    token ? '&token=' + token : ''
  }&tenant=${tenant ? tenant : process.env.TENANTID}${
    directGift ? '&s=' + directGift.id : '&s=' + slug
  }`;
  return sourceUrl;
};
