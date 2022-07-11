import React, { LegacyRef } from "react";
import "./styles.scss";

interface Props {
  type: string;
  placeHolder: string;
  className: "swing" | "gate";
  label: string;
  refFromParent: LegacyRef<HTMLInputElement> | null;
  color?: string;
  error?: string;
  required: boolean;
}

const Input = ({
  type,
  placeHolder,
  className,
  label,
  refFromParent,
  color,
  error,
  required,
}: Props) => {
  return (
    <>
      <span
        className={error ? "picify-custom-input error" : "picify-custom-input"}
        style={
          {
            "--text-indent": `${45 + (label.length - 1) * 12.109}px`,
            "--color": color ? color : "#377d6a",
          } as any
        }
      >
        <input
          className={className}
          type={type}
          placeholder={placeHolder}
          ref={refFromParent}
          required={required}
        />
        <label>{label}</label>
      </span>
      {error ? <div className="error">{error}</div> : null}
    </>
  );
};

export default Input;
