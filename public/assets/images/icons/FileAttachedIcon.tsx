import type { ReactElement } from 'react';
import type { IconProps } from '../../../../src/features/common/types/common';

import React from 'react';

function FileAttachedIcon({ color = '#2f3336' }: IconProps): ReactElement {
  return (
    <svg viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M17.75 16H7.17002C5.08002 16 3.22002 14.47 3.02002 12.39C2.79002 10.01 4.66002 8 7.00002 8H19.36C20.67 8 21.86 8.94 21.99 10.24C22.14 11.74 20.97 13 19.5 13H9.00002C8.45002 13 8.00002 12.55 8.00002 12C8.00002 11.45 8.45002 11 9.00002 11H17.75C18.16 11 18.5 10.66 18.5 10.25C18.5 9.84 18.16 9.5 17.75 9.5H9.14002C7.83002 9.5 6.64002 10.44 6.51002 11.74C6.36002 13.24 7.53002 14.5 9.00002 14.5H19.33C21.42 14.5 23.28 12.97 23.48 10.89C23.71 8.5 21.84 6.5 19.5 6.5H7.23002C4.36002 6.5 1.79002 8.6 1.52002 11.46C1.22002 14.75 3.78002 17.5 7.00002 17.5H17.75C18.16 17.5 18.5 17.16 18.5 16.75C18.5 16.34 18.16 16 17.75 16Z"
        fill={color}
        fillOpacity="0.54"
      />
    </svg>
  );
}

export default FileAttachedIcon;
