import React, { useEffect, useRef } from 'react';
import './sector.scss';

type Props = {
  length: number;
  radius?: number;
  start?: number;
  stroke?: Partial<Stroke>;
}
type Stroke = {
  color: string;
  width: number;
  dash?: number[];
}
const my_stroke: Stroke = {
  color: 'var(--xp-powered)', width: 2
};
export function Sector(
  { length, radius = 10, start = 0, stroke = my_stroke }: Props
) {
  const color = stroke.color ?? my_stroke.color;
  const width = stroke.width ?? my_stroke.width;
  const dash = stroke.dash ?? my_stroke.dash;
  const $ref = useRef<SVGPathElement | null>(null);
  if (length >= 360) length = 359.999; // circle
  useEffect(() => {
    const extent = radius - width / 2; // radius offset by stroke.width
    const startx = radius + extent * Math.cos(Math.PI * (start - 90) / 180);
    const starty = radius + extent * Math.sin(Math.PI * (start - 90) / 180);
    const finalx = radius + extent * Math.cos(Math.PI * (start + length - 90) / 180);
    const finaly = radius + extent * Math.sin(Math.PI * (start + length - 90) / 180);
    const bigarc = length <= 180 ? '0' : '1';
    const d = [
      'M', startx, starty,
      'A', extent, extent, 0, bigarc, 1, finalx, finaly
    ];
    if ($ref.current) {
      $ref.current.setAttribute('d', d.join(' '));
    }
  }, [
    length, radius, start, width
  ]);
  return <svg
    className='component sector'
    height={2 * radius} width={2 * radius}
    xmlns='http://www.w3.org/2000/svg'
  >
    <path ref={$ref} fill='none' style={{
      strokeWidth: `${width}px`, stroke: color,
      strokeDasharray: dash?.join(' ')
    }} />
  </svg>;
}
export default Sector;
