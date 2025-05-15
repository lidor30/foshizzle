import clsx from "clsx";
import React from "react";
import { useLanguage } from "../contexts/LanguageContext";

const LanguageSelector: React.FC = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div className="flex items-center">
      <div className="flex space-x-2">
        <button
          onClick={() => setLanguage("en")}
          className={clsx(
            "px-2 py-1 text-sm rounded-md transition-colors",
            language === "en"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          )}
        >
          EN
        </button>
        <button
          onClick={() => setLanguage("he")}
          className={clsx(
            "px-2 py-1 text-sm rounded-md transition-colors",
            language === "he"
              ? "bg-indigo-600 text-white"
              : "bg-gray-200 text-gray-800 hover:bg-gray-300"
          )}
        >
          HE
        </button>
      </div>
    </div>
  );
};

export default LanguageSelector;
