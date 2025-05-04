'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CalendarIcon, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage, } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Popover, PopoverContent, PopoverTrigger, } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";
import { useAppStore } from '@/store/userStore';

const formSchema = z.object({
  name: z.string().min(2, { message: 'Name must have at least 2 characters.' }),
  surname: z.string().min(2, { message: 'Surname must have at least 2 characters.' }),
  email: z.string().email({ message: 'Please enter a valid email address.' }),
  dob: z.date({ required_error: 'Date of birth is needed.' })
});

export default function UserInfoForm() {
  const activeUserInfo = useAppStore().getUserInfo();
  console.log("ACTIVE USER INFO", activeUserInfo);

  const [isLoading, setIsLoading] = React.useState(false);
  const [userData, setUserData] = React.useState({
    name: activeUserInfo?.name ?? "Name",
    surname: activeUserInfo?.surname ?? "Surname",
    email: activeUserInfo?.email ?? "Email",
    dob: new Date('1990-01-01'), // TODO
  });
  const { toast } = useToast();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: userData,
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);

    // TODO - Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setUserData(values);
      toast({
        title: 'User info updated',
        description: 'Your profile was correctly updated.',
      });
    }, 1000);
  }

  return (
    <div className="max-w-2xl w-full mx-auto p-6 space-y-8">
      <div>
        <h2 className="text-2xl font-bold">Profile</h2>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            disabled={false}
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input placeholder="Alberto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={false}
            control={form.control}
            name="surname"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Surname</FormLabel>
                <FormControl>
                  <Input placeholder="Surname" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={false}
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="john@example.com" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            disabled={false}
            control={form.control}
            name="dob"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de nacimiento</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={'outline'}
                        className={cn(
                          'w-[240px] pl-3 text-left font-normal',
                          !field.value && 'text-muted-foreground'
                        )}
                      >
                        {field.value
                          ? (format(field.value, 'PPP'))
                          : (<span>Choose a date a date</span>)
                        }
                        <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                      </Button>
                    </FormControl>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={field.value}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date('1900-01-01')
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Update Profile
          </Button>
        </form>
      </Form>

      <div className="mt-8 p-6 border rounded-lg bg-muted">
        <h3 className="text-lg font-semibold mb-4">
          User Information
        </h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-medium text-muted-foreground text-sm">
              Name
            </dt>
            <dd>{userData.name}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground text-sm">
              Surname
            </dt>
            <dd>{userData.surname}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground text-sm">
              Email
            </dt>
            <dd>{userData.email}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground text-sm">
              Date Of Birth
            </dt>
            <dd>{format(userData.dob, 'PPP')}</dd>
          </div>
        </dl>
      </div>
    </div>
  );
}