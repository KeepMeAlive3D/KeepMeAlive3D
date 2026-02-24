import * as React from "react";
import {type SetStateAction, useState} from "react";
import {
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useParams} from "react-router";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form.tsx";
import {Spinner} from "@/components/ui/spinner.tsx";
import { createEventLog } from "@/scene/dt/eventlogs/data.ts";

export function CreateEventLogGroupDialog({setOpen, setRefresh, refresh}: {
  setOpen: React.Dispatch<SetStateAction<boolean>>
  setRefresh: React.Dispatch<SetStateAction<boolean>>
  refresh: boolean
}) {
  const [loading, setLoading] = useState(false);
  const {dtId} = useParams();

  function upload(values: z.infer<typeof formSchema>) {
    setLoading(true)
    createEventLog(Number(dtId), values.name)
      .then(() => {
        setOpen(false)
        setRefresh(!refresh)
      })
      .finally(() => {
        setLoading(false)
      })
  }

  const formSchema = z.object({
    name: z.string().min(2).max(50),
  });

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {},
  });

  return (
    <DialogContent className="sm:max-w-[425px]">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(upload)}>
          <DialogHeader>
            <DialogTitle>Upload a Event log</DialogTitle>
            <DialogDescription>
              Upload a event log in the .xes format.
            </DialogDescription>
          </DialogHeader>
          <FormField
            control={form.control}
            render={({field}) => (
              <FormItem className="my-2">
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input {...field}/>
                </FormControl>
              </FormItem>
            )}
            name={"name"}
          />
          <DialogFooter className="mt-2">
            <DialogClose asChild>
              <Button variant="outline">Cancel</Button>
            </DialogClose>
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner className="ml-2"/> : <span>Create</span>}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  )
}