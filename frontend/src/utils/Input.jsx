import React, { forwardRef } from 'react';
import { PiFolderSimpleBold } from "react-icons/pi";
import { IoDocumentOutline } from "react-icons/io5";

const Input = forwardRef(({ Toggle, value, onChange, onKeyUp, type, onBlur }, ref) => {
  return (
    <div>
      {Toggle && (
        <div className='flex w-full rounded-md bg-gray-900 p-1 gap-1 focus-within:ring-2 focus-within:ring-blue-500'>
          {type === 'folder' ? (
            <PiFolderSimpleBold className='text-white w-[20px] h-[20px] rounded-sm'/>
          ) : (
            <IoDocumentOutline className='text-white w-[20px] h-[20px] rounded-sm'/>
          )}
          <input 
            type="text" 
            value={value}
            ref={ref}
            className='h-6 w-full focus:outline-none bg-transparent text-white'
            onChange={onChange}
            onKeyUp={onKeyUp}
            onBlur={onBlur}
          />
        </div>
      )}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;