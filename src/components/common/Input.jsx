import { forwardRef } from 'react'
import { ChevronDown } from 'lucide-react'

const Input = forwardRef(function Input({
  label,
  error,
  icon: Icon,
  type = 'text',
  className = '',
  containerClass = '',
  textarea = false,
  select = false,
  options = [],
  ...props
}, ref) {
  const baseClass = `w-full rounded-xl border bg-white text-slate-800 text-sm transition-all duration-200 outline-none placeholder:text-slate-400 ${
    error
      ? 'border-rose-300 focus:border-rose-500 focus:ring-2 focus:ring-rose-50'
      : 'border-slate-200 focus:border-emerald-500 focus:ring-2 focus:ring-emerald-50'
  }`

  return (
    <div className={`space-y-1.5 ${containerClass}`}>
      {label && (
        <label className="block text-[13px] font-medium text-slate-600">
          {label} {props.required && <span className="text-rose-500">*</span>}
        </label>
      )}
      <div className="relative">
        {Icon && !textarea && !select && (
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Icon className="w-4 h-4 text-slate-400" />
          </div>
        )}
        {textarea ? (
          <textarea
            ref={ref}
            className={`${baseClass} px-3.5 py-2.5 resize-none ${className}`}
            {...props}
          />
        ) : select ? (
          <>
            <select
              ref={ref}
              className={`${baseClass} px-3.5 py-2.5 pr-10 appearance-none cursor-pointer ${className}`}
              {...props}
            >
              {options.map((option) => {
                const value = typeof option === 'string' ? option : option.value
                const optionLabel = typeof option === 'string' ? option : option.label

                return (
                  <option key={`${value}-${optionLabel}`} value={value}>
                    {optionLabel}
                  </option>
                )
              })}
            </select>
            <ChevronDown className="absolute right-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-slate-400 pointer-events-none" />
          </>
        ) : (
          <input
            ref={ref}
            type={type}
            className={`${baseClass} ${Icon ? 'pl-10 pr-3.5 py-2.5' : 'px-3.5 py-2.5'} ${className}`}
            {...props}
          />
        )}
      </div>
      {error && <p className="text-xs text-rose-500 mt-0.5">{error}</p>}
    </div>
  )
})

export default Input
