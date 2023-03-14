import React from 'react'
import classNames from 'classnames'

const TextField = ({
  label,
  name,
  value = '',
  onChange,
  placeholder = '',
  type = 'text',
}) => {
  const inputClasses = classNames(
    'w-full px-3 py-2 rounded border-2 border-primary-500 focus:outline-none focus:border-primary-700'
  )
  return (
    <div className='mb-4'>
      <label className='block mb-2 font-bold text-gray-700' htmlFor={name}>
        {label}
      </label>
      <textarea
        type={type}
        name={name}
        onChange={onChange}
        className={inputClasses}
        placeholder={placeholder}
      >
        {value}
      </textarea>
    </div>
  )
}

export default TextField
