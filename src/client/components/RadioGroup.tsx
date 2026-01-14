/** @jsxImportSource hono/jsx/dom */
import type { FC } from "hono/jsx";
import { fieldsetClass, legendClass, radioGroupClass, labelClass } from "../UrlBuilder.styles";

interface Option<T extends string> {
  value: T;
  label: string;
}

interface RadioGroupProps<T extends string> {
  name: string;
  legend: string;
  options: Option<T>[];
  value: T;
  onChange: (value: T) => void;
}

export const RadioGroup: FC<RadioGroupProps<string>> = ({
  name,
  legend,
  options,
  value,
  onChange,
}) => (
  <fieldset class={fieldsetClass}>
    <legend class={legendClass}>{legend}</legend>
    <div class={radioGroupClass}>
      {options.map((option) => (
        <label class={labelClass}>
          <input
            type="radio"
            name={name}
            value={option.value}
            checked={value === option.value}
            onChange={() => onChange(option.value)}
          />
          {option.label}
        </label>
      ))}
    </div>
  </fieldset>
);
