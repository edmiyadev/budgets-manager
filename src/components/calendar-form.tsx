"use client"

import * as React from "react"
import { CalendarIcon } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { FormControl, FormDescription, FormItem, FormLabel, FormMessage } from "./ui/form"
import { format } from "date-fns"
import { cn } from "@/lib/utils"
import { es } from "date-fns/locale"


export default function CalendarForm({ label, description, field }: any) {
  const [open, setOpen] = React.useState(false)

  return (
    <FormItem className="flex flex-col">
      <FormLabel>{label}</FormLabel>
      <Popover open={open} onOpenChange={setOpen}>
        <PopoverTrigger asChild>
          <FormControl>
            <Button
              variant={"outline"}
              className={cn(
                "w-[240px] pl-3 text-left font-normal",
                !field.value && "text-muted-foreground"
              )}
            >
              {field.value ? (
                format(field.value, "PP", { locale: es })
              ) : (
                <span>Pick a date</span>
              )}
              <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
            </Button>
          </FormControl>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="single"
            selected={field.value}
            month={field.value}
            onMonthChange={field.value}

            captionLayout="dropdown"
            onSelect={(e) => {
              field.onChange(e)
              setOpen(false)
            }}
          />
        </PopoverContent>
      </Popover>
      <FormDescription>
        {description}
      </FormDescription>
      <FormMessage />
    </FormItem>
  )
}