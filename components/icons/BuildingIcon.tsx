
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const BuildingIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M21 20H3V11L12 5L21 11V20ZM19 18V12L12 7.5L5 12V18H19Z"></path>
        <path d="M9 17H7V14H9V17ZM13 17H11V14H13V17ZM17 17H15V14H17V17Z"></path>
    </svg>
);
