import { Spinner } from "@/components/ui/spinner.tsx";

export const LoadingSpinner = ({
  loading,
}: {
  loading: boolean;
}) => {
  if (!loading) return null;

  return (
    <Spinner></Spinner>
  );
};
