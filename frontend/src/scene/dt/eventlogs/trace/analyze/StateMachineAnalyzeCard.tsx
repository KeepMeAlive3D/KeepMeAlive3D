import { Link, useParams } from "react-router";
import { Card } from "@/components/ui/card.tsx";
import { GitGraph } from "lucide-react";

export function StateMachineAnalyzeCard({ name, id }: {
  name: string,
  id: number
}) {
  const { dtId, refId, traceName } = useParams();

  return (
    <Link to={`/dt/${dtId}/log/${refId}/trace/${traceName}/analyze/${id}`} className="w-full max-w-sm mx-2 my-4">
      <Card className=" hover:bg-accent cursor-pointer min-h-25 min-w-80 flex-row">
        <GitGraph className="m-auto ml-5" />
        <h2 className="m-auto font-medium">{name}</h2>
        <div className="m-auto"></div>
      </Card>
    </Link>
  );
}
