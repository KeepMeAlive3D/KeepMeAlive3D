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
import {uploadStateMachine} from "@/scene/dt/participant/stateMachine/data.ts";
import {useParams} from "react-router";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Form, FormField, FormItem, FormLabel} from "@/components/ui/form";
import {Spinner} from "@/components/ui/spinner.tsx";

export function StateMachineDialog({setOpen, setRefresh, refresh}: {
    setOpen: React.Dispatch<SetStateAction<boolean>>
    setRefresh: React.Dispatch<SetStateAction<boolean>>
    refresh: boolean
}) {
    const [loading, setLoading] = useState(false);
    const {dtId, participantId} = useParams();

    function upload(values: z.infer<typeof formSchema>) {
        setLoading(true)
        uploadStateMachine(dtId!, participantId!, values.file)
            .then(() => {
                setOpen(false)
                setRefresh(!refresh)
            })
            .finally(() => {
                setLoading(false)
            })
    }

    const formSchema = z.object({
        file: z.file().min(1)
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
                        <DialogTitle>Upload a State Machine</DialogTitle>
                        <DialogDescription>
                            Upload a state machine in the SCXML format.
                        </DialogDescription>
                    </DialogHeader>
                    <FormField
                        render={({field: {value, onChange, ...fieldProps}}) => <FormItem>
                            <FormLabel>File</FormLabel>
                            <Input {...fieldProps}
                                   onChange={(event) => onChange(event.target.files && event.target.files.length > 0 ? event.target.files[0] : null)}
                                   type="file"/>
                        </FormItem>
                        } name={"file"}/>
                    <DialogFooter className="mt-2">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Spinner className="ml-2"/> : <span>Upload</span>}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    )
}