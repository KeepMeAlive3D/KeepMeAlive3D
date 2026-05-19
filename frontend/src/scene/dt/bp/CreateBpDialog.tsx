import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog.tsx";
import { Input } from "@/components/ui/input.tsx";
import { Button } from "@/components/ui/button.tsx";
import { type SetStateAction, useState } from "react";
import * as React from "react";
import { uploadBpmFile } from "@/scene/dt/bp/bpInfoData.ts";
import { useParams } from "react-router";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Form, FormField, FormItem, FormLabel } from "@/components/ui/form.tsx";
import { Spinner } from "@/components/ui/spinner.tsx";
import { z } from "zod";

export function CreateBpDialogContent({ refresh, setRefresh, setOpen }: {
  refresh: boolean,
  setRefresh: React.Dispatch<SetStateAction<boolean>>,
  setOpen: React.Dispatch<SetStateAction<boolean>>
}) {
  const { dtId } = useParams();
  const [loading, setLoading] = useState(false)

  const handleUpload = (values: z.infer<typeof formSchema>) => {
    setLoading(true)
    uploadBpmFile(Number(dtId), values.file).then(() => {
      setLoading(false)
      setOpen(false);
      setRefresh(!refresh)
    });
  };

  const formSchema = z.object({
    file: z.file().min(1),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });


  return (
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(handleUpload)}>
          <DialogHeader>
            <DialogTitle>Upload a State Machine</DialogTitle>
            <DialogDescription>
              Upload a state machine in the SCXML format.
            </DialogDescription>
          </DialogHeader>
          <FormField
            render={({ field: { value, onChange, ...fieldProps } }) => <FormItem>
              <FormLabel>File</FormLabel>
              <Input {...fieldProps}
                     onChange={(event) => onChange(event.target.files && event.target.files.length > 0 ? event.target.files[0] : null)}
                     type="file" />
            </FormItem>
            } name={"file"} />
          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner className="ml-2" /> : <span>Upload</span>}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}