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
  size,
  attachmentColor,
  ...props
}: React.ButtonHTMLAttributes<HTMLButtonElement> & {
  icon: IconType;
  attachment?: IconType;
  attachmentColor?: "red" | "green" | "neutral";
  size?: "sm" | "md" | "lg";
}) => {
  attachmentColor = attachmentColor || "green";
  return (
    <button
      {...props}
      className={["relative hover:bg-gray-800 p-0.5 rounded-md", props.className || undefined].join("")}
    >
      <Icon className={size === "sm" ? "w-4 h-4" : size === "lg" ? "w-8 h-8" : "w-6 h-6"} />
      {Attachment && (
        <Attachment
          className={[
            "absolute -bottom-0.5 -right-0.5 w-2 h-2",
            attachmentColor === "green" ? "text-green-500" : attachmentColor === "red" ? "text-red-500" : undefined,
          ].join(" ")}
        />
      )}
    </button>
  );
};
