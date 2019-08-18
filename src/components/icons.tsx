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
}
const keenIcon = (props: IProps) => {
  const { type = IconTypeEnum.duo, style = null, color = false, light = false, icon = '', push = false } = props;
  return (
    <i
      className={`${type} ${icon} ${light && color ? 'fa-swap-opacity' : ''}`}
      style={{
        ...(push ? {position: 'relative',
        top: '3px'} : {}),
        ...(type === IconTypeEnum.duo && color ? {
          '--fa-primary-color': '#5c7080',
          '--fa-secondary-color': 'rgba(92,112,128,.85)'
        } : {}),
        ...(style || {})
      }}
    />
  )
}

export default keenIcon;
