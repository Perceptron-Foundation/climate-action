import type { ReactElement } from 'react';
import type { IconProps } from '../../../../../src/features/common/types/common';

import React from 'react';

function PlanetCashIcon({ color = '#000' }: IconProps): ReactElement {
  return (
    <svg
      width="20"
      height="14"
      viewBox="0 0 20 14"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        opacity="0.4"
        d="M2.85397 3.64067V12.2547C2.85397 12.3613 2.87498 12.4669 2.91578 12.5654C2.95659 12.6639 3.0164 12.7534 3.0918 12.8288C3.1672 12.9042 3.25672 12.9641 3.35523 13.0049C3.45375 13.0457 3.55934 13.0667 3.66597 13.0667H19.088C19.1946 13.0667 19.3002 13.0457 19.3987 13.0049C19.4972 12.9641 19.5867 12.9042 19.6621 12.8288C19.7375 12.7534 19.7974 12.6639 19.8382 12.5654C19.879 12.4669 19.9 12.3613 19.9 12.2547V3.64067C19.9 3.42532 19.8144 3.21878 19.6621 3.0665C19.5099 2.91422 19.3033 2.82867 19.088 2.82867H3.66597C3.45062 2.82867 3.24408 2.91422 3.0918 3.0665C2.93952 3.21878 2.85397 3.42532 2.85397 3.64067ZM11.67 11.3507C10.9735 11.4065 10.2767 11.2473 9.67362 10.8945C9.07052 10.5418 8.59016 10.0125 8.2974 9.37812C8.00464 8.74373 7.91357 8.0348 8.03648 7.34701C8.15939 6.65922 8.49036 6.02571 8.98472 5.53198C9.47908 5.03825 10.113 4.70809 10.801 4.58606C11.4889 4.46403 12.1977 4.55601 12.8317 4.84958C13.4657 5.14316 13.9944 5.62419 14.3464 6.22774C14.6984 6.83129 14.8567 7.5283 14.8 8.22467C14.7338 9.03231 14.3827 9.79012 13.8093 10.3627C13.2359 10.9354 12.4777 11.2855 11.67 11.3507Z"
        fill={color}
      />
      <path
        d="M17.122 1.95666H2.63401C2.4119 1.95929 2.19979 2.04938 2.04366 2.20737C1.88754 2.36537 1.79999 2.57854 1.80001 2.80066V10.4787C1.80001 10.5898 1.77812 10.6998 1.73561 10.8024C1.69309 10.9051 1.63078 10.9983 1.55222 11.0769C1.47366 11.1554 1.3804 11.2177 1.27776 11.2603C1.17511 11.3028 1.0651 11.3247 0.954006 11.3247V11.3247C0.842236 11.3257 0.731365 11.3046 0.627799 11.2626C0.524232 11.2205 0.430023 11.1584 0.350615 11.0797C0.271208 11.0011 0.208176 10.9074 0.165161 10.8043C0.122146 10.7011 0.100001 10.5904 0.100006 10.4787V1.11066C0.100006 0.88682 0.188927 0.672145 0.347208 0.513865C0.505489 0.355584 0.720163 0.266663 0.944006 0.266663H17.122C17.3458 0.266663 17.5605 0.355584 17.7188 0.513865C17.8771 0.672145 17.966 0.88682 17.966 1.11066C17.9663 1.22167 17.9446 1.33163 17.9023 1.43426C17.86 1.53689 17.7979 1.63017 17.7195 1.70875C17.6411 1.78734 17.548 1.84969 17.4455 1.89223C17.3429 1.93477 17.233 1.95666 17.122 1.95666Z"
        fill={color}
      />
      <path
        d="M10.9861 10.1947V9.13667C10.8655 9.18033 10.7383 9.20267 10.6101 9.20267C10.3121 9.20427 10.0257 9.08771 9.8135 8.87853C9.60132 8.66935 9.4807 8.38461 9.47806 8.08667V8.07667C9.47836 7.92718 9.50881 7.77929 9.56757 7.64183C9.62633 7.50437 9.71221 7.38018 9.82006 7.27667C9.70344 7.01679 9.68926 6.72245 9.78038 6.45257C9.8715 6.18268 10.0612 5.95717 10.3115 5.82116C10.5617 5.68515 10.8541 5.64868 11.1302 5.71905C11.4062 5.78942 11.6454 5.96143 11.8001 6.20066H11.8741C12.0588 6.19361 12.243 6.22391 12.4157 6.28973C12.5885 6.35555 12.7461 6.45555 12.8793 6.58374C13.0125 6.71193 13.1184 6.86568 13.1908 7.03577C13.2632 7.20587 13.3005 7.38882 13.3005 7.57367C13.3005 7.75851 13.2632 7.94146 13.1908 8.11156C13.1184 8.28165 13.0125 8.4354 12.8793 8.56359C12.7461 8.69178 12.5885 8.79178 12.4157 8.8576C12.243 8.92343 12.0588 8.95372 11.8741 8.94667C11.7443 8.9465 11.6152 8.92901 11.4901 8.89467V10.1947H10.9861Z"
        fill={color}
      />
    </svg>
  );
}

export default PlanetCashIcon;
