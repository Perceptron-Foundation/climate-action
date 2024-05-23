import { IconProps } from '../../../../../src/features/common/types/common';

const Conservation = ({ width, color }: IconProps) => {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width={width} fill="none">
      <path
        fill={color}
        fillRule="evenodd"
        d="M6.2 6.022a20.257 20.257 0 0 0 0 29.077l13.739 13.45c.613.601 1.607.601 2.22 0L35.9 35.1a20.257 20.257 0 0 0 0-29.077c-8.202-8.03-21.499-8.03-29.7 0Z"
        clipRule="evenodd"
      />
      <g clipPath="url(#a)">
        <path
          fill="#fff"
          d="M10.852 31.136c4.386-.533 5.777-1.439 5.777-1.439s2.308.38 4.507 0c7.814-1.285 8.55-7.798 7.754-11.238-.795-3.447 2.295-4.281 2.295-4.281l-2.247-2.564a2.604 2.604 0 0 0-1.874-.8c-4.386-.26-6.043 5.069-6.043 5.069s3.121.533 4.236 3.523c1.771 4.696-2.314 6.667-2.314 6.667v-.011c1.278-.924 2.121-2.405 2.121-4.08 0-2.807-2.313-5.075-5.157-5.075a5.19 5.19 0 0 0-2.771.805h-.013c-.036.012-.06.042-.096.054 0 .006-.012.006-.012.006-4.844 2.635-5.97 12.162-6.163 13.364ZM27.1 12.668a.5.5 0 0 1 1 0 .486.486 0 0 1-.5.485c-.277 0-.5-.219-.5-.485Z"
        />
      </g>
      <defs>
        <clipPath id="a">
          <path fill="#fff" d="M10.852 10.802h20.334v20.334H10.852z" />
        </clipPath>
      </defs>
    </svg>
  );
};
export default Conservation;
