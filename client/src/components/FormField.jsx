import React from "react";

const FormField = ({
  labelName,
  type,
  name,
  placeholder,
  value,
  handleChange,
  isSurpriseMe,
  handleSurpriseMe,
}) => {
  return (
    <div>
      <div className="flex items-center gap-2 mb-2">
        <label
          htmlFor={name}
          className="block text-sm font-medium text-gray-900"
        >
          {labelName}
        </label>
        {isSurpriseMe && (
          <button
            type="button"
            onClick={handleSurpriseMe}
            className="inline-flex items-center justify-center 
            px-4 py-2 border border-transparent rounded-md 
            shadow-sm text-sm font-medium text-white
             bg-blue-600 hover:bg-indigo-700 
             focus:outline-none focus:ring-2 focus:ring-offset-2
              focus:ring-indigo-500"
          >
            Surprise Me
          </button>
        )}
      </div>
      <input
        id={name}
        type={type}
        name={name}
        placeholder={placeholder}
        value={value}
        onChange={handleChange}
        className="bg-gray-50 border border-gray-400 text-gray-900
        text-sm rounded-lg focus:ring-[#4649ff] focus:border-[#4649ff]
        outline-none block w-full p-3"
        required
      />
    </div>
  );
};

export default FormField;
