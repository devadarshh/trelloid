// ListWrapper.tsx
interface ListWrapperProps {
  children: React.ReactNode;
}

export const ListWrapper = ({ children }: ListWrapperProps) => {
  return (
    <div className="shrink-0 w-[272px] select-none rounded-md">{children}</div>
  );
};
