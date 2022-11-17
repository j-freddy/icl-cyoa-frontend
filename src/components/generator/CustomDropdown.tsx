import React, { DOMAttributes } from "react";
import { Button } from "react-bootstrap";
import { GoKebabVertical } from "react-icons/go";

// TODO: see if there's a way to fix this, very hacky solution to get typescript to shut up 
export const CustomToggle = React.forwardRef<any, DOMAttributes<any>>(({ children, onClick }, ref) => (

  <Button
    ref={ref}
    className='toggle-button'
    size={'sm'} variant={'light'}
    style={{ padding: '0.3em', }}
    onClick={(e) => {
      e.preventDefault();
      onClick?.(e);
    }}
  >
    <GoKebabVertical />
    {children}
  </Button>
));
