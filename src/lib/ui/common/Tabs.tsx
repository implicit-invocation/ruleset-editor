import { useState } from "react";

export const Tabs = ({
  renderTab,
  renderTitle,
  tabNames,
  ...props
}: React.ButtonHTMLAttributes<HTMLDivElement> & {
  tabNames: string[];
  renderTab: (name: string) => React.ReactNode;
  renderTitle: (name: string) => React.ReactNode;
}) => {
  const [activeIndex, setActiveIndex] = useState(0);
  return (
    <div {...props} className="w-full h-full flex flex-col">
      <div className="flex flex-row gap-2 p-1 px-3">
        {tabNames.map((name, index) => (
          <div
            key={name}
            className={[
              "cursor-pointer text-gray-500 hover:text-white",
              activeIndex === index ? "border-b-2 border-b-indigo-600" : "",
            ].join(" ")}
            onClick={() => {
              setActiveIndex(index);
            }}
          >
            {renderTitle(name)}
          </div>
        ))}
      </div>
      {tabNames.map((name, index) => (
        <div
          key={name}
          className="flex-1 flex-col overflow-hidden"
          style={{
            display: activeIndex === index ? "flex" : "none",
          }}
        >
          {renderTab(name)}
        </div>
      ))}
    </div>
  );
};
