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
    <input
      type="text"
      value={inputValue}
      className="p-2 w-full border rounded"
      placeholder="漢字を入力してください"
      autoComplete="on"
      style={{ color: "black", backgroundColor: "white" }}
      onChange={(e) => setInputValue(e.target.value)}
    />
  );
};

export default SearchBox;
