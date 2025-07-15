import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const BedIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
        <path d="M22 11V18H20V11H15V18H13V11H8V18H6V11H2V20H4V22H20V20H22V11ZM17 8C17 9.10457 16.1046 10 15 10C13.8954 10 13 9.10457 13 8C13 6.89543 13.8954 6 15 6C16.1046 6 17 6.89543 17 8ZM11 8C11 9.10457 10.1046 10 9 10C7.89543 10 7 9.10457 7 8C7 6.89543 7.89543 6 9 6C10.1046 6 11 6.89543 11 8Z"></path>
    </svg>
);
