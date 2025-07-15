
import React from 'react';

type IconProps = React.SVGProps<SVGSVGElement>;

export const CompassIcon: React.FC<IconProps> = (props) => (
    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" {...props}>
      <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.822 14.957a.75.75 0 0 1-1.06-1.06l4.25-4.25a.75.75 0 0 1 1.06 1.06l-4.25 4.25Zm.03-6.914-.014.014L6.93 14.55a.75.75 0 0 1-1.06-1.06l4.242-4.243a.75.75 0 0 1 1.06 0l4.243 4.243a.75.75 0 0 1-1.06 1.06L12.008 10.3l-1.49 1.49Z" clipRule="evenodd" />
    </svg>
);
