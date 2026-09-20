import { useTheme } from "next-themes";
import { Toaster as Sonner, toast } from "sonner";

type ToasterProps = React.ComponentProps<typeof Sonner>;

const Toaster = ({ ...props }: ToasterProps) => {
  const { theme = "system" } = useTheme();

  return (
    <Sonner
      theme={theme as ToasterProps["theme"]}

      position="top-right"

      richColors

      closeButton

      duration={2000}

      expand={false}

      visibleToasts={3}

      offset={20}

      toastOptions={{
        classNames: {
          toast:
            "rounded-2xl border border-violet-300/20 bg-slate-900 text-white shadow-2xl",

          title:
            "font-semibold",

          description:
            "text-slate-300",

          success:
            "border-green-400/30",

          error:
            "border-red-400/30",

          warning:
            "border-yellow-400/30",

          info:
            "border-sky-400/30",

          actionButton:
            "bg-violet-600 text-white",

          cancelButton:
            "bg-slate-700 text-white",
        },
      }}

      {...props}
    />
  );
};

export { Toaster, toast };