import React from 'react';

export enum IconTypeEnum {
  solid = 'fas',
  regular = 'far',
  light = 'fal',
  duo = 'fad'
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
}
const keenIcon = (props: IProps) => {
  const { type = IconTypeEnum.duo, style = null, color = false, light = false, icon = '', push = false, intent = 'none', iconSize = undefined, className = '', onClick = () => null } = props;
  const iconColor = {
    none: {},
    primary: {
      '--fa-primary-color': '#106ba3',
      '--fa-secondary-color': 'rgba(16,107,163,.85)'
    },
    success: {
      '--fa-primary-color': '#0d8050',
      '--fa-secondary-color': 'rgba(13,128,80,.85)'
    },
    warning: {
      '--fa-primary-color': '#bf7326',
      '--fa-secondary-color': 'rgba(191,115,38,.85)'
    },
    danger: {
      '--fa-primary-color': '#c23030',
      '--fa-secondary-color': 'rgba(194,48,48,.85)'
    }
  }
  return (
    <i
      onClick={() => onClick()}
      className={`${type} ${icon} ${(light && color) && intent !== 'none' ? 'fa-swap-opacity' : ''} ${className}`}
      style={{
        ...iconColor[intent],
        ...(iconSize ? { fontSize: `${iconSize}px`} : {}),
        ...(push ? {position: 'relative',
        top: '3px'} : {}),
        ...((type === IconTypeEnum.duo && color) && intent !== 'none' ? {
          '--fa-primary-color': '#5c7080',
          '--fa-secondary-color': 'rgba(92,112,128,.85)'
        } : {}),
        ...(style || {})
      }}
    />
  )
}

export default keenIcon;
