import React from 'react'
import classNames from 'classnames'

const Button = ({ children, size = 'md', color = 'primary' }) => {
  const buttonClasses = classNames(
    'py-2 px-4 font-semibold rounded',
    { 'text-sm': size === 'sm' },
    { 'text-base': size === 'md' },
    { 'text-lg': size === 'lg' },
    { [`bg-${color}-500`]: color },
    { [`hover:bg-${color}-700`]: color }
  )

  return <button className={buttonClasses}>{children}</button>
}

export default Button``
