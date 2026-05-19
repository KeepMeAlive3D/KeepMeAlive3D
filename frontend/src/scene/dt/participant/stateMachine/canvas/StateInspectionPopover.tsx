import { Card, CardAction, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card.tsx";
import { Info, Shield, XIcon } from "lucide-react";
import { Button } from "@/components/ui/button.tsx";
import { Badge } from "@/components/ui/badge.tsx";
import { ScrollArea } from "@/components/ui/scroll-area.tsx";
import * as React from "react";
import { Separator } from "@radix-ui/react-menubar";
import type { StateData } from "@/scene/dt/participant/stateMachine/canvas/stateData.ts";

export function StateInspectionPopover({ inspectState, setInspectState }: {
  inspectState: StateData | undefined,
  setInspectState: (value: StateData | undefined) => void
}) {
  if (inspectState === undefined) {
    return null;
  } else {
    return (
      <Card className="absolute top-5 right-5 w-full max-w-sm">
        <CardHeader>
          <CardTitle>State Inspection: {inspectState.id}</CardTitle>
          <CardDescription>Inspect properties of this state.</CardDescription>
          <CardAction>
            <Button variant="ghost" onClick={() => setInspectState(undefined)}>
              <XIcon />
            </Button>
          </CardAction>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center gap-2">
            <div className="flex w-full flex-wrap gap-2">
              {inspectState.details.onEntry ? <Badge>OnEntry</Badge> : null}
              {inspectState.details.onExit ? <Badge>OnExit</Badge> : null}
            </div>
          </div>
          {(inspectState.details.transitions !== undefined && inspectState.details.transitions.length > 0) ?
            <div className="pt-4">
              <h4 className="mb-4 text-sm leading-none font-medium">Transitions</h4>
              <ScrollArea className="max-h-72 rounded-md border p-4">
                {inspectState.details.transitions.map(it => (
                  <React.Fragment key={it.toState}>
                    <div className="flex flex-row items-center">
                      <div className="text-sm flex-none">
                        {it.toState ?? "Undefined"}
                      </div>
                      <div className="grow"></div>
                      {it.condition? <Badge variant="outline"><Shield size={20} className="pr-2"/> Cond | {it.condition}</Badge> : null}
                      {it.event? <Badge variant="outline"><Info size={20} className="pr-2"/> Event | {it.event}</Badge> : null}
                    </div>

                    <Separator className="my-2" />
                  </React.Fragment>
                ))}
              </ScrollArea>
            </div>
            : null
          }
        </CardContent>
      </Card>
    );
  }
}