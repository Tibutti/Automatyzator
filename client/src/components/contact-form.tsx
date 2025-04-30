import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

// Używamy funkcji zamiast obiektu, aby tłumaczenia były dynamiczne
const getContactFormSchema = (t: any) => z.object({
  name: z.string().min(2, {
    message: t('contact.form.nameError', 'Imię i nazwisko musi zawierać co najmniej 2 znaki')
  }),
  email: z.string().email({
    message: t('contact.form.emailError', 'Wprowadź poprawny adres e-mail')
  }),
  company: z.string().optional(),
  message: z.string().min(10, {
    message: t('contact.form.messageError', 'Wiadomość musi zawierać co najmniej 10 znaków')
  }),
});

export default function ContactForm() {
  const { t } = useTranslation('common');
  const { toast } = useToast();
  
  const contactFormSchema = getContactFormSchema(t);
  type ContactFormValues = z.infer<typeof contactFormSchema>;
  
  const form = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      name: "",
      email: "",
      company: "",
      message: "",
    },
  });
  
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: ContactFormValues) => {
      return apiRequest("POST", "/api/contact", data);
    },
    onSuccess: () => {
      toast({
        title: t('contact.form.successTitle'),
        description: t('contact.form.successDescription'),
      });
      form.reset();
    },
    onError: () => {
      toast({
        title: t('contact.form.errorTitle'),
        description: t('contact.form.errorDescription'),
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: ContactFormValues) => {
    mutate(data);
  };
  
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="bg-background dark:bg-gray-800 p-8 rounded-xl shadow-md space-y-6"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('contact.form.name')}</FormLabel>
              <FormControl>
                <Input placeholder={t('contact.form.name')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('contact.form.email')}</FormLabel>
              <FormControl>
                <Input type="email" placeholder="jan@firma.pl" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="company"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('contact.form.company', 'Firma')}</FormLabel>
              <FormControl>
                <Input placeholder={t('contact.form.companyPlaceholder', 'Nazwa firmy')} {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="message"
          render={({ field }) => (
            <FormItem>
              <FormLabel>{t('contact.form.message')}</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder={t('contact.form.messagePlaceholder', 'Opisz swoje potrzeby...')} 
                  className="min-h-[120px]" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Button 
          type="submit" 
          className="w-full py-3 cta-button"
          disabled={isPending}
        >
          {isPending ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {t('contact.form.sending')}
            </>
          ) : (
            t('contact.form.submit')
          )}
        </Button>
      </form>
    </Form>
  );
}
