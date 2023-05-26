import React from "react";

interface Props {
  children: React.ReactNode;
  disabled?: boolean;
  onClick: () => void;
}

export default function Button(props: Props) {
  const { children, disabled } = props;
  return (
    <button
      disabled={disabled}
      onClick={props.onClick}
      type="button"
      className="disabled:border-gray-200 dark:disabled:border-gray-700 disabled:pointer-events-none disabled:text-gray-200 dark:disabled:text-gray-700 duration-150 text-highlight-700 hover:text-white border border-highlight-700 hover:bg-highlight-800 focus:ring-4 focus:outline-none focus:ring-highlight-300 font-medium rounded-lg text-sm px-5 py-2.5 text-center mr-2 mb-2 dark:border-highlight-500 dark:text-highlight-500 dark:hover:text-white dark:hover:bg-highlight-600 dark:focus:ring-highlight-800"
    >
      {children}
    </button>
  );
}
