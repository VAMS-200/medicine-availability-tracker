const FormInput = ({
  label,
  type = "text",
  name,
  value,
  onChange,
  required = false,
  placeholder = "",
}) => {
  return (
    <div className="mb-3">
      <label
        htmlFor={name}
        className="block mb-1 text-sm font-medium text-slate-700"
      >
        {label} {required && <span className="text-red-500">*</span>}
      </label>
      <input
        id={name}
        name={name}
        type={type}
        required={required}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="w-full rounded-lg border border-slate-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
      />
    </div>
  );
};

export default FormInput;
