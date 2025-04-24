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

const newsletterSchema = z.object({
  email: z.string().email("Wprowadź poprawny adres e-mail"),
});

type NewsletterFormValues = z.infer<typeof newsletterSchema>;

export default function NewsletterForm() {
  const { toast } = useToast();
  const [email, setEmail] = useState("");
  
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
        title: "Sukces!",
        description: "Dziękujemy za zapisanie się do newslettera.",
      });
      reset();
    },
    onError: () => {
      toast({
        title: "Wystąpił błąd",
        description: "Nie udało się zapisać do newslettera. Spróbuj ponownie.",
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
          placeholder="Twój email"
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
        {isPending ? <Loader2 className="h-4 w-4 animate-spin" /> : "Zapisz się"}
      </Button>
    </form>
  );
}
