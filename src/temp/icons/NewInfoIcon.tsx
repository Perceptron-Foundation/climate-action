import React from 'react';
import { IconProps } from '../../features/common/types/common';

const NewInfoIcon = ({ height, width, color }: IconProps) => {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width={width}
      height={height}
      viewBox="0 0 10 10"
      fill="none"
    >
      <g clipPath="url(#clip0_1339_811)">
        <path
          d="M5 0C2.23889 0 0 2.23889 0 5C0 7.76111 2.23889 10 5 10C7.76111 10 10 7.76111 10 5C10 2.23889 7.76111 0 5 0ZM5.88556 7.09889L5.82444 7.30333C5.81444 7.33889 5.79333 7.37 5.76444 7.39333C5.42 7.65778 4.97889 7.76111 4.55333 7.67778L4.55667 7.67333C4.54556 7.67111 4.53444 7.67 4.52333 7.66667C4.15667 7.57556 3.93333 7.20556 4.02444 6.83889L4.5 4.92444C4.61333 4.46556 4.11 4.57444 3.90222 4.63778C3.87667 4.64556 3.85 4.63111 3.84222 4.60556C3.84 4.59667 3.84 4.58667 3.84222 4.57778L3.90333 4.37333C3.91333 4.33778 3.93444 4.30667 3.96333 4.28333C4.30778 4.01889 4.74889 3.91556 5.17444 3.99889C5.17444 3.99889 5.20111 4.00333 5.21444 4.00667C5.58111 4.09778 5.80444 4.46778 5.71333 4.83444L5.21333 6.84778C5.19111 7.19444 5.63333 7.09778 5.82667 7.03889C5.85222 7.03111 5.87889 7.04556 5.88667 7.07111C5.88889 7.08 5.88889 7.09 5.88667 7.09889H5.88556ZM5.44556 3.72444C5.05111 3.72444 4.73111 3.40444 4.73111 3.01C4.73111 2.61556 5.05111 2.29556 5.44556 2.29556C5.84 2.29556 6.16 2.61556 6.16 3.01C6.16 3.40444 5.84 3.72444 5.44556 3.72444Z"
          fill={color}
        />
      </g>
      <defs>
        <clipPath id="clip0_1339_811">
          <rect width="10" height="10" fill="white" />
        </clipPath>
      </defs>
    </svg>
  );
};

export default NewInfoIcon;
