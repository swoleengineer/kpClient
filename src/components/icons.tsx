import React from 'react';



export enum IconTypeEnum {
  solid = 'fas',
  regular = 'far',
  light = 'fal',
  duo = 'fad',
  brand = 'fab'
}
interface IProps {
  type?: IconTypeEnum;
  style?: any;
  color?: boolean;
  light?: boolean;
  icon: string;
  push?: boolean;
  intent?: 'none' | 'primary' | 'success' | 'warning' | 'danger',
  iconSize?: number;
  className?: string;
  onClick?: Function;
  reverse?: boolean;
}
const keenIcon = (props: IProps) => {
  const { type = IconTypeEnum.duo, style = null, color = false, light = false, icon = '', push = false, intent = 'none', iconSize = undefined, className = '', onClick = () => null, reverse = false } = props;
  const iconColor = {
    none: {},
    primary: {
      '--fa-primary-color': reverse ? 'rgba(16,107,163,.85)' : '#106ba3',
      '--fa-secondary-color': reverse ? '#106ba3' : 'rgba(16,107,163,.85)'
    },
    success: {
      '--fa-primary-color': reverse ? 'rgba(13,128,80,.85)' : '#0d8050',
      '--fa-secondary-color': reverse ? '#0d8050' : 'rgba(13,128,80,.85)'
    },
    warning: {
      '--fa-primary-color': reverse ? 'rgba(191,115,38,.85)' : '#bf7326',
      '--fa-secondary-color': reverse ? '#bf7326' : 'rgba(191,115,38,.85)'
    },
    danger: {
      '--fa-primary-color': reverse ? 'rgba(194,48,48,.85)' : '#c23030',
      '--fa-secondary-color': reverse ? '#c23030' : 'rgba(194,48,48,.85)'
    }
  }
  return (
    <i
      onClick={() => onClick()}
      className={`${type} ${icon} ${(light && color) && intent !== 'none' ? 'fa-swap-opacity' : ''} ${className}`}
      style={{
        ...(iconSize ? { fontSize: `${iconSize}px`} : {}),
        ...(push ? {position: 'relative',
        top: '3px'} : {}),
        ...((type === IconTypeEnum.duo && color) && intent !== 'none'
          ? {
              '--fa-primary-color': reverse ? 'rgba(92,112,128,.85)' : '#5c7080',
              '--fa-secondary-color': reverse ? '#5c7080' : 'rgba(92,112,128,.85)'
            }
          : {}),
        ...iconColor[intent],
        ...(style || {})
      }}
    />
  )
}

export default keenIcon;


export const AddBookIcon = ({ style = {}, width = '30', height = '30' }) => (
  <svg xmlns="http://www.w3.org/2000/svg" x="0px" y="0px" viewBox="0 0 50 50"><path d="M 12 2 C 8.691 2 6 4.691 6 8 L 6 42.417969 C 6 45.495969 8.691 48 12 48 L 44 48 L 44 46 L 12 46 C 9.832 46 8 44.359969 8 42.417969 C 8 40.501969 9.757 39 12 39 L 44 39 L 44 29.154297 C 47.522 27.603297 50 24.079 50 20 C 50 15.921 47.522 12.396703 44 10.845703 L 44 2 L 12 2 z M 40 12 C 44.4 12 48 15.6 48 20 C 48 24.4 44.4 28 40 28 C 35.6 28 32 24.4 32 20 C 32 15.6 35.6 12 40 12 z M 40 14.099609 C 39.4 14.099609 39 14.499609 39 15.099609 L 39 19 L 35.099609 19 C 34.499609 19 34.099609 19.4 34.099609 20 C 34.099609 20.6 34.499609 21 35.099609 21 L 39 21 L 39 24.900391 C 39 25.500391 39.4 25.900391 40 25.900391 C 40.6 25.900391 41 25.500391 41 24.900391 L 41 21 L 44.900391 21 C 45.500391 21 45.900391 20.6 45.900391 20 C 45.900391 19.4 45.500391 19 44.900391 19 L 41 19 L 41 15.099609 C 41 14.499609 40.6 14.099609 40 14.099609 z"></path></svg>
)

// (
//   <svg 
//     xmlns="http://www.w3.org/2000/svg"
//     x="0px" y="0px"
//     width={width}
//     height={height}
//     viewBox={`0 0 ${width} ${height}`}
//     style={{ ...style }}>
//       <path d="M 12 2 C 8.691 2 6 4.691 6 8 L 6 42.417969 C 6 45.495969 8.691 48 12 48 L 44 48 L 44 46 L 12 46 C 9.832 46 8 44.359969 8 42.417969 C 8 40.501969 9.757 39 12 39 L 44 39 L 44 29.154297 C 47.522 27.603297 50 24.079 50 20 C 50 15.921 47.522 12.396703 44 10.845703 L 44 2 L 12 2 z M 40 12 C 44.4 12 48 15.6 48 20 C 48 24.4 44.4 28 40 28 C 35.6 28 32 24.4 32 20 C 32 15.6 35.6 12 40 12 z M 40 14.099609 C 39.4 14.099609 39 14.499609 39 15.099609 L 39 19 L 35.099609 19 C 34.499609 19 34.099609 19.4 34.099609 20 C 34.099609 20.6 34.499609 21 35.099609 21 L 39 21 L 39 24.900391 C 39 25.500391 39.4 25.900391 40 25.900391 C 40.6 25.900391 41 25.500391 41 24.900391 L 41 21 L 44.900391 21 C 45.500391 21 45.900391 20.6 45.900391 20 C 45.900391 19.4 45.500391 19 44.900391 19 L 41 19 L 41 15.099609 C 41 14.499609 40.6 14.099609 40 14.099609 z">
//       </path>
//   </svg>
// );
