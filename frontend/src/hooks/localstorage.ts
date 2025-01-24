import { useState } from "react";

export const useLocalStorage = (
  key: string,
  initialValue: string
): [string, (newValue: string) => void, () => void] => {
  // Retrieve data from local storage on component mount
  const storedValue = localStorage.getItem(key);
  const initial = storedValue ?? initialValue;
  // State to hold the current value
  const [value, setValue] = useState(initial);

  // Update local storage and state when the value changes
  const updateValue = (newValue: string) => {
    setValue(newValue);
    localStorage.setItem(key, newValue);
  };

  // Remove the key from local storage and reset the state
  const removeValue = () => {
    setValue(initialValue);
    localStorage.removeItem(key);
  };

  return [value, updateValue, removeValue];
};

export default useLocalStorage;
