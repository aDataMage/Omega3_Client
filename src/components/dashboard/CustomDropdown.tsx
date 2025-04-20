"use client";

import * as React from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface DropdownProps {
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  children?: React.ReactNode;
}

export function CustomSelectDropdown(props: DropdownProps) {
  const { value, onChange, children } = props;

  const handleValueChange = (newValue: string) => {
    if (onChange) {
      // Create a synthetic event to match the expected HTMLSelectElement change event
      const syntheticEvent = {
        target: { value: newValue },
      } as React.ChangeEvent<HTMLSelectElement>;
      onChange(syntheticEvent);
    }
  };

  // Convert children (option elements) to SelectItems
  const selectItems = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === "option") {
      return (
        <SelectItem key={child.props.value} value={child.props.value}>
          {child.props.children}
        </SelectItem>
      );
    }
    return null;
  });

  return (
    <Select value={value} onValueChange={handleValueChange}>
      <SelectTrigger className="h-8 w-full">
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
      <SelectContent>{selectItems}</SelectContent>
    </Select>
  );
}
