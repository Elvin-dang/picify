import React, { ReactNode, useState } from "react";
import { Link } from "react-router-dom";
import { useOuterClick } from "../../customHooks";
import "./styles.scss";

interface Props {
  children: ReactNode;
  elements: {
    icon?: ReactNode;
    name: string;
    click?: () => void;
    to?: string;
  }[];
}

const MenuDropDown = ({ children, elements }: Props) => {
  const [open, setOpen] = useState<boolean>(false);
  const ref = useOuterClick(() => setOpen(false));

  return (
    <div className="menuDropDown" ref={ref}>
      <div onClick={() => setOpen(!open)}>{children}</div>
      <div className={open ? "menu active" : "menu"}>
        <ul>
          {elements.map((element, index) => {
            if (element.to) {
              return (
                <Link
                  to={element.to}
                  key={index}
                  onClick={() => setOpen(false)}
                >
                  <li>
                    {element.icon} {element.name}
                  </li>
                </Link>
              );
            }
            return (
              <li
                onClick={() => {
                  if (element.click) element.click();
                  setOpen(false);
                }}
                key={index}
              >
                {element.icon} {element.name}
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
};

export default MenuDropDown;
