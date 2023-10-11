import { IconType } from "react-icons";

export const SimpleButton = ({
  text,
  primaryStyle,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  text: string;
  primaryStyle?: boolean;
}) => {
  return (
    <button
      {...props}
      className={[
        primaryStyle
          ? "text-sm bg-indigo-700 text-white p-1 px-3 rounded-md hover:bg-indigo-600 active:bg-indigo-700"
          : "text-sm border-gray-900 border-2 text-gray-900 p-1 px-3 rounded-md hover:text-gray-800 hover:border-gray-800 active:text-gray-900 active:border-gray-900",
        props.className || "",
      ].join(" ")}
    >
      {text}
    </button>
  );
};

export const IconButton = ({
  icon: Icon,
  attachment: Attachment,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconType;
  attachment?: IconType;
}) => {
  return (
    <button
      {...props}
      className={[
        "relative hover:bg-gray-800 p-0.5 rounded-md",
        props.className || undefined,
      ].join("")}
    >
      <Icon />
      {Attachment && (
        <Attachment className="absolute -bottom-0.5 -right-0.5 w-2 h-2 text-green-500" />
      )}
    </button>
  );
};