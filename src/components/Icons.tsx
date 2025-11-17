import React from 'react';

interface IconProps {
  className?: string;
}

export const HomeIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M3 9L12 2L21 9V20C21 20.5304 20.7893 21.0391 20.4142 21.4142C20.0391 21.7893 19.5304 22 19 22H5C4.46957 22 3.96086 21.7893 3.58579 21.4142C3.21071 21.0391 3 20.5304 3 20V9Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="calligraphic-stroke"
    />
    <path 
      d="M9 22V12H15V22" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="calligraphic-stroke"
    />
  </svg>
);

export const ChartIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M18 20V10" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="calligraphic-stroke"
    />
    <path 
      d="M12 20V4" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="calligraphic-stroke"
    />
    <path 
      d="M6 20V14" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="calligraphic-stroke"
    />
  </svg>
);

export const UserIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M20 21V19C20 17.9391 19.5786 16.9217 18.8284 16.1716C18.0783 15.4214 17.0609 15 16 15H8C6.93913 15 5.92172 15.4214 5.17157 16.1716C4.42143 16.9217 4 17.9391 4 19V21" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="calligraphic-stroke"
    />
    <path 
      d="M12 11C14.2091 11 16 9.20914 16 7C16 4.79086 14.2091 3 12 3C9.79086 3 8 4.79086 8 7C8 9.20914 9.79086 11 12 11Z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="calligraphic-stroke"
    />
  </svg>
);

export const MoonIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="calligraphic-stroke"
    />
  </svg>
);

export const SunIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <circle 
      cx="12" 
      cy="12" 
      r="5" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="calligraphic-stroke"
    />
    <path 
      d="M12 1V3M12 21V23M4.22 4.22L5.64 5.64M18.36 18.36L19.78 19.78M1 12H3M21 12H23M4.22 19.78L5.64 18.36M18.36 5.64L19.78 4.22" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="calligraphic-stroke"
    />
  </svg>
);

export const LockIcon: React.FC<IconProps> = ({ className = "" }) => (
  <svg 
    width="12" 
    height="12" 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <rect 
      x="3" 
      y="11" 
      width="18" 
      height="11" 
      rx="2" 
      ry="2" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="calligraphic-stroke"
    />
    <path 
      d="M7 11V7C7 5.67392 7.52678 4.40215 8.46447 3.46447C9.40215 2.52678 10.6739 2 12 2C13.3261 2 14.5979 2.52678 15.5355 3.46447C16.4732 4.40215 17 5.67392 17 7V11" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="calligraphic-stroke"
    />
  </svg>
);

export const LogOut: React.FC<IconProps> = ({ className = "" }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M9 21H5a2 2 0 0 1-2-2V7a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2z" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="calligraphic-stroke"
    />
    <path 
      d="M16 17l-4-4m0 0l4 4m0 0l-4 4" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="calligraphic-stroke"
    />
  </svg>
);

export const Settings: React.FC<IconProps> = ({ className = "" }) => (
  <svg 
    width="20" 
    height="20" 
    viewBox="0 0 24 24" 
    fill="none" 
    className={className}
    xmlns="http://www.w3.org/2000/svg"
  >
    <path 
      d="M12 15l-2-2m0 0l2 2m-2-2l2 2M12 9l-2-2m0 0l2 2m-2-2l2 2" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="calligraphic-stroke"
    />
    <circle 
      cx="12" 
      cy="12" 
      r="3" 
      stroke="currentColor" 
      strokeWidth="2" 
      strokeLinecap="round" 
      strokeLinejoin="round" 
      className="calligraphic-stroke"
    />
  </svg>
);