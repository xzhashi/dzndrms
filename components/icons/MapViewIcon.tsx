import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const MapViewIcon: React.FC<IconProps> = (props) => (
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
    <path d="M2 22L8 18L16 22L22 18V2L16 6L8 2L2 6V22ZM10 4.47214L14 6V19.5279L10 18V4.47214Z"></path>
  </svg>
);