import React from "react";

export default function Loader() {
  return (
    <div className="flex items-center justify-center min-h-48 p-10">
      <div className="animate-spin rounded-full h-32 w-32 border-t-2 border-b-2 border-highlight-900 dark:border-highlight-500"></div>
    </div>
  );
}
