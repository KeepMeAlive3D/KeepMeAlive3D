import {
    DialogClose,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from "@/components/ui/dialog.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {useParams} from "react-router";
import * as React from "react";
import {type SetStateAction, useState} from "react";
import {createParticipant} from "@/scene/dt/participant/processParticipantInfo.ts";
import {Spinner} from "@/components/ui/spinner.tsx";
import {Form, FormControl, FormField, FormItem, FormLabel} from "@/components/ui/form.tsx";
import {useForm} from "react-hook-form";
import {zodResolver} from "@hookform/resolvers/zod";
import {z} from "zod";
import {Select, SelectContent, SelectGroup, SelectItem, SelectLabel, SelectValue} from "@/components/ui/select.tsx";
import {SelectTrigger} from "@radix-ui/react-select";
import {Hammer, PersonStanding, TruckElectric} from "lucide-react";

export function CreateParticipantDialog({setOpen, setRefresh, refresh}: {
    setOpen: React.Dispatch<SetStateAction<boolean>>
    setRefresh: React.Dispatch<SetStateAction<boolean>>
    refresh: boolean
}) {
    const {dtId} = useParams();
    const [loading, setLoading] = useState(false)

    const formSchema = z.object({
        name: z.string().min(2).max(50),
        icon: z.enum(["0", "1", "2"])
    });

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: "",
            icon: "0"
        },
    });

    function create(values: z.infer<typeof formSchema>) {
        setLoading(true)
        createParticipant(Number(dtId), {
            name: values.name,
            icon: Number(values.icon)
        }).then(() => {
            setOpen(false)
            setRefresh(!refresh)
        }).finally(() => {
            setLoading(false)
        })
    }

    return (
        <DialogContent className="sm:max-w-[425px]">
            <Form {...form}>
                <form onSubmit={form.handleSubmit(create)}>
                    <DialogHeader>
                        <DialogTitle>Create Process Participant</DialogTitle>
                        <DialogDescription>
                            Create a new Process Participant, to display a Model
                            and a State Machine.
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
                    <FormField
                        control={form.control}
                        render={({field}) => (
                            <FormItem>
                                <FormLabel>Icon</FormLabel>
                                <Select key={field.value} value={field.value + ""}
                                        onValueChange={(val) => field.onChange(val)}>
                                    <SelectTrigger className="w-full border p-2 rounded-md text-sm font-medium">
                                        <SelectValue placeholder="Select an Icon"/>
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectGroup>
                                            <SelectLabel>Icon</SelectLabel>
                                            <SelectItem value="0"><Hammer/></SelectItem>
                                            <SelectItem value="1"><PersonStanding/></SelectItem>
                                            <SelectItem value="2"><TruckElectric/></SelectItem>
                                        </SelectGroup>
                                    </SelectContent>
                                </Select>
                            </FormItem>
                        )}
                        name={"icon"}
                    />
                    <DialogFooter className="mt-2">
                        <DialogClose asChild>
                            <Button variant="outline">Cancel</Button>
                        </DialogClose>
                        <Button type="submit" disabled={loading}>
                            {loading ? <Spinner className="ml-2"/> : <span>Create Process Participant</span>}
                        </Button>
                    </DialogFooter>
                </form>
            </Form>
        </DialogContent>
    );
}