import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const KeyIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path d="M15.583 11.001C15.011 10.428 15.011 9.48 15.583 8.908L18.89 5.601C19.986 4.505 19.553 2.706 18.141 2.193L16.082 1.385C15.421 1.149 14.732 1.455 14.375 2.001L10.375 8.001C9.079 10.038 9.696 12.828 11.733 14.124L2.876 23.001H6.001L15.583 13.401V11.001ZM14.001 8.001L16.001 4.706L17.294 5.295L15.001 8.001H14.001Z"></path>
    </svg>
);