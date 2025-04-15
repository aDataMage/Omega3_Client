import * as React from "react"
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

interface DropdownProps {
  value?: string
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void
  children?: React.ReactNode
}

export function CustomSelectDropdown(props: DropdownProps) {
  const { value, onChange, children } = props
  // Extract option values from children (which are <option>)
  const options = React.Children.map(children, (child) => {
    if (React.isValidElement(child) && child.type === "option") {
      return {
        value: child.props.value,
        label: child.props.children,
      }
    }
    return null
  })?.filter(Boolean)

  const handleChange = (newValue: string) => {
    if (onChange) {
      // Simulate native event structure expected by react-day-picker
      const syntheticEvent = {
        target: { value: newValue },
      } as React.ChangeEvent<HTMLSelectElement>

      onChange(syntheticEvent)
    }
  }

  return (
    <Select value={value} onValueChange={handleChange}>
      <SelectTrigger className="h-8">
        <SelectValue placeholder="Select..." />
      </SelectTrigger>
      <SelectContent>
        <SelectGroup>
          {options?.map((option) => (
            <SelectItem key={option.value} value={option.value}>
              {option.label}
            </SelectItem>
          ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
