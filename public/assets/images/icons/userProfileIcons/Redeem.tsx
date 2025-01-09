import type { IconProps } from '../../../../../src/features/common/types/common';

import React from 'react';

function Icon({ color = 'black' }: IconProps) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      x="0"
      y="0"
      width="30px"
      height="30px"
      enableBackground="new 0 0 512 512"
      version="1.1"
      viewBox="0 0 512 512"
      xmlSpace="preserve"
    >
      <path
        fill={color}
        d="M344 288H104c-4.4 0-8 3.6-8 8v32c0 4.4 3.6 8 8 8h240c4.4 0 8-3.6 8-8v-32c0-4.4-3.6-8-8-8zM400.8 5.7L357.3 37 318.7 9.2c-16.8-12.1-39.2-12.1-56.1 0L224 37 185.4 9.2a47.888 47.888 0 0 0-56.1 0L90.7 37 47.2 5.7C27.4-8.5 0 5.6 0 29.9v452.3c0 23.8 27.1 38.6 47.2 24.2L90.7 475l38.6 27.8c16.8 12.1 39.2 12.1 56.1 0L224 475l38.6 27.8c16.8 12.1 39.3 12.1 56.1 0l38.6-27.8 43.5 31.3c19.8 14.2 47.2.1 47.2-24.1V29.9C448 6 420.9-8.7 400.8 5.7zm-.8 440.8l-42.7-30.7-66.7 48-66.7-48-66.7 48-66.7-48L48 446.5v-381l42.7 30.7 66.7-48 66.7 48 66.7-48 66.7 48L400 65.5v381zM344 176H104c-4.4 0-8 3.6-8 8v32c0 4.4 3.6 8 8 8h240c4.4 0 8-3.6 8-8v-32c0-4.4-3.6-8-8-8z"
      />
    </svg>
  );
}

export default Icon;
