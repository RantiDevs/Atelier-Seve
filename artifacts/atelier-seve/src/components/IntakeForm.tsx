import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubmitIntake, IntakeInputTipoPelle, IntakeInputTrattamento } from "@workspace/api-client-react";
import { useLanguage } from "@/LanguageContext";

type FormValues = {
  nomeCompleto: string;
  email: string;
  telefono: string;
  dataNascita: string;
  tipoPelle: IntakeInputTipoPelle;
  trattamento: IntakeInputTrattamento;
  noteAggiuntive?: string;
};

export function IntakeForm() {
  const { t } = useLanguage();
  const [isSuccess, setIsSuccess] = useState(false);
  const submitIntake = useSubmitIntake();

  const formSchema = z.object({
    nomeCompleto: z.string().min(2, t.intake.errors.name),
    email: z.string().email(t.intake.errors.email),
    telefono: z.string().min(5, t.intake.errors.phone),
    dataNascita: z.string().min(1, t.intake.errors.dob),
    tipoPelle: z.nativeEnum(IntakeInputTipoPelle),
    trattamento: z.nativeEnum(IntakeInputTrattamento),
    noteAggiuntive: z.string().optional(),
  });

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nomeCompleto: "",
      email: "",
      telefono: "",
      dataNascita: "",
      tipoPelle: IntakeInputTipoPelle.Normale,
      trattamento: IntakeInputTrattamento.Viso,
      noteAggiuntive: "",
    },
  });

  const onSubmit = (data: FormValues) => {
    submitIntake.mutate({ data }, { onSuccess: () => setIsSuccess(true) });
  };

  const inputClass = "bg-transparent border-b border-input pb-2 font-sans text-foreground focus:outline-none focus:border-accent transition-colors";
  const labelClass = "font-sans text-xs uppercase tracking-widest text-muted-foreground";

  return (
    <section className="w-full bg-background py-24 px-6 md:px-12 lg:px-24 border-t border-border/20">
      <div className="max-w-2xl mx-auto">
        <div className="mb-16 text-center">
          <h2 className="font-serif text-3xl md:text-5xl text-foreground mb-4">{t.intake.heading}</h2>
          <p className="font-sans text-muted-foreground text-lg">{t.intake.subheading}</p>
        </div>

        {isSuccess ? (
          <div className="flex flex-col items-center justify-center p-12 bg-secondary/20 rounded-xl border border-border animate-in fade-in zoom-in duration-500">
            <svg className="w-16 h-16 text-border mb-6 animate-pulse" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M12 21.5c-4.97 0-9-4.03-9-9s4.03-9 9-9 9 4.03 9 9-4.03 9-9 9z" strokeLinecap="round" strokeLinejoin="round" />
              <path d="M8.5 12.5l2 2 5-5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
            <h3 className="font-serif italic text-2xl text-foreground mb-2">{t.intake.successTitle}</h3>
            <p className="font-sans text-muted-foreground text-center">{t.intake.successMessage}</p>
          </div>
        ) : (
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col space-y-2">
                <label className={labelClass}>{t.intake.labels.name}</label>
                <input {...form.register("nomeCompleto")} className={inputClass} />
              </div>
              <div className="flex flex-col space-y-2">
                <label className={labelClass}>{t.intake.labels.email}</label>
                <input type="email" {...form.register("email")} className={inputClass} />
              </div>
              <div className="flex flex-col space-y-2">
                <label className={labelClass}>{t.intake.labels.phone}</label>
                <input type="tel" {...form.register("telefono")} className={inputClass} />
              </div>
              <div className="flex flex-col space-y-2">
                <label className={labelClass}>{t.intake.labels.dob}</label>
                <input type="date" {...form.register("dataNascita")} className={inputClass} />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div className="flex flex-col space-y-2">
                <label className={labelClass}>{t.intake.labels.skinType}</label>
                <select {...form.register("tipoPelle")} className={`${inputClass} appearance-none rounded-none`}>
                  {Object.values(IntakeInputTipoPelle).map((v) => (
                    <option key={v} value={v} className="bg-background text-foreground">{v}</option>
                  ))}
                </select>
              </div>
              <div className="flex flex-col space-y-2">
                <label className={labelClass}>{t.intake.labels.treatment}</label>
                <select {...form.register("trattamento")} className={`${inputClass} appearance-none rounded-none`}>
                  {Object.values(IntakeInputTrattamento).map((v) => (
                    <option key={v} value={v} className="bg-background text-foreground">{v}</option>
                  ))}
                </select>
              </div>
            </div>

            <div className="flex flex-col space-y-2">
              <label className={labelClass}>{t.intake.labels.notes}</label>
              <textarea {...form.register("noteAggiuntive")} rows={3} className={`${inputClass} resize-none`} />
            </div>

            <button
              type="submit"
              disabled={submitIntake.isPending}
              className="w-full py-4 bg-foreground text-background font-sans text-sm uppercase tracking-widest hover:bg-accent transition-colors disabled:opacity-50"
            >
              {submitIntake.isPending ? t.intake.submitting : t.intake.submit}
            </button>
          </form>
        )}
      </div>
    </section>
  );
}
