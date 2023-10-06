/* eslint-disable @typescript-eslint/prefer-nullish-coalescing */

import { type HTMLAttributes } from "react";

export function Label ({ 
  children, className, 
  labelTopLeft, labelTopRight,
  labelBottomLeft, labelBottomRight,
  ...props
}: {
  labelTopLeft?: string | false,
  labelTopRight?: string | false,
  labelBottomLeft?: string | false,
  labelBottomRight?: string | false,
} & HTMLAttributes<HTMLDivElement>) {
  return (
    <div className={`form-control ${className}`} {...props}>
      {(labelTopLeft || labelTopRight) && <label className="label">
        <span className="label-text">{ labelTopLeft }</span>
        <span className="label-text-alt">{ labelTopRight }</span>
      </label>}
      { children }
      {(labelBottomLeft || labelBottomRight) && <label className="label">
        <span className="label-text">{ labelBottomLeft }</span>
        <span className="label-text-alt">{ labelBottomRight }</span>
      </label>}
    </div>
  );
}
