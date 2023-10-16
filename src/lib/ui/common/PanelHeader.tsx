export const PanelHeader = ({
  headerTitle,
  children,
  ...props
}: React.HTMLAttributes<HTMLDivElement> & {
  headerTitle: string;
}) => {
  return (
    <div {...props}>
      <div className="p-2 flex-row flex justify-between items-center">
        <div className="text-xs uppercase">{headerTitle}</div>
        <div className="flex-1 flex justify-end gap-2">{children}</div>
      </div>
    </div>
  );
};
