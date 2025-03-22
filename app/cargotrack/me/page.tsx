'use client';

import * as React from 'react';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { CalendarIcon, Loader2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Form,
  FormControl,
  // FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { useToast } from "@/hooks/use-toast";

const formSchema = z.object({
  name: z.string().min(2, {
    message: 'El nombre debe tener al menos 2 caracteres.',
  }),
  surname: z.string().min(2, {
    message: 'El apellido debe tener al menos 2 caracteres.',
  }),
  email: z.string().email({
    message: 'Please enter a valid email address.',
  }),
  dob: z.date({
    required_error: 'Una fecha de nacimiento es necesaria.',
  }),
  // bio: z.string().max(160, {
  //   message: 'Bio must not be longer than 160 characters.',
  // }),
});

export default function UserInfoForm() {
  const [isLoading, setIsLoading] = React.useState(false);
  const [userData, setUserData] = React.useState({
    name: 'John',
    surname: 'Doe',
    email: 'john@example.com',
    dob: new Date('1990-01-01'),
    // bio: 'I love coding and building awesome web applications!',
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
        title: 'Información de ususario actualizada',
        description: 'Tu perfil ha sido actualizado correctamente.',
      });
    }, 1000);
  }

  return (
    <div className="max-w-2xl w-full mx-auto p-6 space-y-8">

      <div>
        <h2 className="text-2xl font-bold">Información de usuario</h2>
        {/* <p className="text-muted-foreground"> View and update your profile information.  </p> */}
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
          <FormField
            disabled={false}
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Alberto" {...field} />
                </FormControl>
                {/* <FormDescription> This is your public display name.  </FormDescription> */}
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
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Alberto" {...field} />
                </FormControl>
                {/* <FormDescription> This is your public display name.  </FormDescription> */}
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
                {/* <FormDescription> We will never share your email with anyone else.  </FormDescription> */}
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
                          : (<span>Elige una fecha</span>)
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
                {/* <FormDescription> Your date of birth is used to calculate your age.  </FormDescription> */}
                <FormMessage />
              </FormItem>
            )}
          />

          {/* <FormField
            disabled={false}
            control={form.control}
            name="bio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Bio</FormLabel>
                <FormControl>
                  <Input placeholder="Tell us about yourself" {...field} />
                </FormControl>
                <FormDescription>
                  Write a short bio about yourself (max 160 characters).
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          /> */}

          <Button type="submit" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Actualizar Perfil
          </Button>
        </form>
      </Form>

      <div className="mt-8 p-6 border rounded-lg bg-muted">
        <h3 className="text-lg font-semibold mb-4">
          Información del usuario
        </h3>
        <dl className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          <div>
            <dt className="font-medium text-muted-foreground text-sm">
              Nombre
            </dt>
            <dd>{userData.name}</dd>
          </div>
          <div>
            <dt className="font-medium text-muted-foreground text-sm">
              Apellido
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
            <dt className="font-medium text-muted-foreground text-sm">Fecha de nacimiento</dt>
            <dd>{format(userData.dob, 'PPP')}</dd>
          </div>
        </dl>
      </div>

    </div>
  );
}