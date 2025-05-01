import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";
import { Loader2 } from "lucide-react";
import { useTranslation } from "react-i18next";

function createNewsletterSchema(t: any) {
  return z.object({
    email: z.string().email(t('newsletter.emailError', "Wprowadź poprawny adres e-mail")),
  });
}

export default function NewsletterForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  const { t } = useTranslation();
  
  const newsletterSchema = createNewsletterSchema(t);
  type NewsletterFormValues = z.infer<typeof newsletterSchema>;
  
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<NewsletterFormValues>({
    resolver: zodResolver(newsletterSchema),
    defaultValues: {
      email: "",
    },
  });
  
  const { mutate, isPending } = useMutation({
    mutationFn: async (data: NewsletterFormValues) => {
      return apiRequest("POST", "/api/newsletter", data);
    },
    onSuccess: () => {
      toast({
        title: t('newsletter.successTitle', 'Sukces!'),
        description: t('newsletter.successDescription', 'Dziękujemy za zapisanie się do newslettera.'),
      });
      reset();
    },
    onError: () => {
      toast({
        title: t('newsletter.errorTitle', 'Wystąpił błąd'),
        description: t('newsletter.errorDescription', 'Nie udało się zapisać do newslettera. Spróbuj ponownie.'),
        variant: "destructive",
      });
    },
  });
  
  const onSubmit = (data: NewsletterFormValues) => {
    mutate(data);
  };
  
  return (
    <form onSubmit={handleSubmit(onSubmit)} className="flex">
      <div className="flex-grow">
        <Input
          type="email"
          placeholder={t('newsletter.placeholder')}
          className="rounded-r-none h-12"
          {...register("email")}
          aria-invalid={errors.email ? "true" : "false"}
        />
        {errors.email && (
          <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>
        )}
      </div>
      <Button 
        type="submit" 
        className="rounded-l-none h-12 cta-button"
        disabled={isPending}
      >
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : t('newsletter.button')}
      </Button>
    </form>
  );
}
