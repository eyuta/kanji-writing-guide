import React, { useState, useEffect } from "react";

interface SearchBoxProps {
  initialValue: string;
  onSearch: (value: string) => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({ initialValue, onSearch }) => {
  const [inputValue, setInputValue] = useState(initialValue);

  useEffect(() => {
    const timer = setTimeout(() => {
      onSearch(inputValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [inputValue, onSearch]);

  return (
    <div className="relative">
      <textarea
        rows={2}
        value={inputValue}
        className="w-full pl-3 pr-10 py-2 rounded-md border focus:outline-none"
        placeholder="漢字を入力してください"
        autoComplete="on"
        style={{ color: "black", backgroundColor: "white" }}
        onChange={(e) => setInputValue(e.target.value)}
      />
      <button
        onClick={() => setInputValue("")}
        className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600 cursor-pointer"
      >
        ✕
      </button>
    </div>
  );
};

export default SearchBox;
