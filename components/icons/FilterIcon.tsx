import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const FilterIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M10 18H14V16H10V18ZM3 6V8H21V6H3ZM6 13H18V11H6V13Z"></path>
    </svg>
);
