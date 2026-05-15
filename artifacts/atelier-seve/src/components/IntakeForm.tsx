import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useSubmitIntake, IntakeInputTipoPelle, IntakeInputTrattamento } from "@workspace/api-client-react";
import { useLanguage } from "@/LanguageContext";
import { motion, AnimatePresence } from "framer-motion";

type FormValues = {
  nomeCompleto: string;
  email: string;
  telefono: string;
  dataNascita: string;
  tipoPelle: IntakeInputTipoPelle;
  trattamento: IntakeInputTrattamento;
  noteAggiuntive?: string;
};

function FloatingField({
  label,
  error,
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="relative">
      <label className="block font-sans text-[10px] uppercase tracking-[0.25em] mb-2.5" style={{ color: "#9E7B7B" }}>
        {label}
      </label>
      {children}
      {error && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-1.5 font-sans text-[11px]"
          style={{ color: "#c96060" }}
        >
          {error}
        </motion.p>
      )}
    </div>
  );
}

const inputBase =
  "w-full bg-transparent font-sans text-sm pb-2.5 pt-1 focus:outline-none transition-all duration-300 placeholder:text-[rgba(249,244,238,0.2)]";
const inputBorder = "border-b border-[rgba(201,160,110,0.25)] focus:border-[#C9A06E]";

export function IntakeForm() {
  const { lang, t } = useLanguage();
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

  const selectClass = `${inputBase} ${inputBorder} appearance-none cursor-pointer`;

  const skinTypeLabels: Record<IntakeInputTipoPelle, string> = {
    [IntakeInputTipoPelle.Normale]: lang === "it" ? "Normale" : "Normal",
    [IntakeInputTipoPelle.Secca]: lang === "it" ? "Secca" : "Dry",
    [IntakeInputTipoPelle.Grassa]: lang === "it" ? "Grassa" : "Oily",
    [IntakeInputTipoPelle.Mista]: lang === "it" ? "Mista" : "Combination",
    [IntakeInputTipoPelle.Sensibile]: lang === "it" ? "Sensibile" : "Sensitive",
  };

  const treatmentLabels: Record<IntakeInputTrattamento, string> = {
    [IntakeInputTrattamento.Viso]: lang === "it" ? "Trattamento Viso" : "Facial",
    [IntakeInputTrattamento.Ciglia]: lang === "it" ? "Ciglia" : "Lashes",
    [IntakeInputTrattamento.Corpo]: lang === "it" ? "Corpo" : "Body",
    [IntakeInputTrattamento.Epilazione]: lang === "it" ? "Epilazione" : "Waxing",
    [IntakeInputTrattamento.Labbra]: lang === "it" ? "Labbra" : "Lip Treatment",
  };

  return (
    <section
      id="intake"
      className="w-full py-28 md:py-36 px-5 md:px-10"
      style={{ backgroundColor: "#0e0905" }}
    >
      <div className="max-w-3xl mx-auto">
        <div className="mb-16 text-center">
          <span className="font-sans text-[10px] uppercase tracking-[0.35em] mb-3 block" style={{ color: "rgba(201,160,110,0.6)" }}>
            {lang === "it" ? "Il tuo rituale inizia qui" : "Your ritual begins here"}
          </span>
          <h2 className="font-serif text-4xl md:text-5xl lg:text-6xl italic mb-5" style={{ color: "#F9F4EE" }}>
            {t.intake.heading}
          </h2>
          <p className="font-sans text-base max-w-lg mx-auto leading-relaxed" style={{ color: "rgba(249,244,238,0.45)" }}>
            {t.intake.subheading}
          </p>
        </div>

        <AnimatePresence mode="wait">
          {isSuccess ? (
            <motion.div
              key="success"
              initial={{ opacity: 0, scale: 0.96, y: 16 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              className="flex flex-col items-center justify-center p-14 rounded-3xl text-center"
              style={{
                background: "rgba(249,244,238,0.04)",
                border: "1.5px solid rgba(201,160,110,0.25)",
                backdropFilter: "blur(20px)",
              }}
            >
              <div
                className="w-20 h-20 rounded-full flex items-center justify-center mb-8"
                style={{
                  background: "linear-gradient(135deg, rgba(201,160,110,0.2), rgba(232,196,184,0.15))",
                  border: "1.5px solid rgba(201,160,110,0.4)",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none">
                  <path d="M5 12l5 5 9-9" stroke="#C9A06E" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <h3 className="font-serif italic text-3xl mb-3" style={{ color: "#F9F4EE" }}>
                {t.intake.successTitle}
              </h3>
              <p className="font-sans text-base leading-relaxed max-w-sm" style={{ color: "rgba(249,244,238,0.55)" }}>
                {t.intake.successMessage}
              </p>
              <div className="flex gap-2 mt-8">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: "#C9A06E", opacity: 0.4 + i * 0.3 }} />
                ))}
              </div>
            </motion.div>
          ) : (
            <motion.form
              key="form"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              onSubmit={form.handleSubmit(onSubmit)}
              className="space-y-10"
              noValidate
            >
              <div
                className="p-8 md:p-10 rounded-3xl"
                style={{
                  background: "rgba(249,244,238,0.03)",
                  border: "1.5px solid rgba(201,160,110,0.12)",
                }}
              >
                <h3 className="font-serif italic text-lg mb-7" style={{ color: "rgba(201,160,110,0.8)" }}>
                  {lang === "it" ? "Chi sei?" : "Who are you?"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <FloatingField label={t.intake.labels.name} error={form.formState.errors.nomeCompleto?.message}>
                    <input
                      {...form.register("nomeCompleto")}
                      className={`${inputBase} ${inputBorder}`}
                      placeholder={lang === "it" ? "es. Sofia Martini" : "e.g. Sofia Martini"}
                      style={{ color: "#F9F4EE" }}
                    />
                  </FloatingField>
                  <FloatingField label={t.intake.labels.email} error={form.formState.errors.email?.message}>
                    <input
                      type="email"
                      {...form.register("email")}
                      className={`${inputBase} ${inputBorder}`}
                      placeholder="sofia@example.com"
                      style={{ color: "#F9F4EE" }}
                    />
                  </FloatingField>
                  <FloatingField label={t.intake.labels.phone} error={form.formState.errors.telefono?.message}>
                    <input
                      type="tel"
                      {...form.register("telefono")}
                      className={`${inputBase} ${inputBorder}`}
                      placeholder="+39 02 ..."
                      style={{ color: "#F9F4EE" }}
                    />
                  </FloatingField>
                  <FloatingField label={t.intake.labels.dob} error={form.formState.errors.dataNascita?.message}>
                    <input
                      type="date"
                      {...form.register("dataNascita")}
                      className={`${inputBase} ${inputBorder}`}
                      style={{ color: form.watch("dataNascita") ? "#F9F4EE" : "rgba(249,244,238,0.3)", colorScheme: "dark" }}
                    />
                  </FloatingField>
                </div>
              </div>

              <div
                className="p-8 md:p-10 rounded-3xl"
                style={{
                  background: "rgba(249,244,238,0.03)",
                  border: "1.5px solid rgba(201,160,110,0.12)",
                }}
              >
                <h3 className="font-serif italic text-lg mb-7" style={{ color: "rgba(201,160,110,0.8)" }}>
                  {lang === "it" ? "La tua pelle" : "Your skin"}
                </h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
                  <FloatingField label={t.intake.labels.skinType}>
                    <div className="relative">
                      <select
                        {...form.register("tipoPelle")}
                        className={selectClass}
                        style={{ color: "#F9F4EE" }}
                      >
                        {Object.values(IntakeInputTipoPelle).map((v) => (
                          <option key={v} value={v} className="bg-[#1C1210] text-[#F9F4EE]">
                            {skinTypeLabels[v]}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-0 bottom-3 pointer-events-none">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                          <path d="M1 1l5 5 5-5" stroke="#C9A06E" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                  </FloatingField>
                  <FloatingField label={t.intake.labels.treatment}>
                    <div className="relative">
                      <select
                        {...form.register("trattamento")}
                        className={selectClass}
                        style={{ color: "#F9F4EE" }}
                      >
                        {Object.values(IntakeInputTrattamento).map((v) => (
                          <option key={v} value={v} className="bg-[#1C1210] text-[#F9F4EE]">
                            {treatmentLabels[v]}
                          </option>
                        ))}
                      </select>
                      <div className="absolute right-0 bottom-3 pointer-events-none">
                        <svg width="12" height="8" viewBox="0 0 12 8" fill="none">
                          <path d="M1 1l5 5 5-5" stroke="#C9A06E" strokeWidth="1.5" strokeLinecap="round" />
                        </svg>
                      </div>
                    </div>
                  </FloatingField>
                </div>
              </div>

              <div
                className="p-8 md:p-10 rounded-3xl"
                style={{
                  background: "rgba(249,244,238,0.03)",
                  border: "1.5px solid rgba(201,160,110,0.12)",
                }}
              >
                <FloatingField label={t.intake.labels.notes}>
                  <textarea
                    {...form.register("noteAggiuntive")}
                    rows={4}
                    className={`${inputBase} ${inputBorder} resize-none`}
                    placeholder={lang === "it" ? "Hai allergie, preferenze o richieste speciali?" : "Any allergies, preferences or special requests?"}
                    style={{ color: "#F9F4EE" }}
                  />
                </FloatingField>
              </div>

              <button
                type="submit"
                disabled={submitIntake.isPending}
                className="relative w-full py-5 font-sans text-xs uppercase tracking-[0.25em] rounded-2xl transition-all duration-300 overflow-hidden disabled:opacity-50 group hover:scale-[1.01]"
                style={{
                  background: "linear-gradient(135deg, #C9A06E 0%, #9E7B7B 100%)",
                  color: "#F9F4EE",
                  boxShadow: "0 8px 30px rgba(201,160,110,0.35)",
                }}
              >
                <span className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  style={{ background: "linear-gradient(135deg, rgba(255,255,255,0.1) 0%, rgba(255,255,255,0.05) 100%)" }}
                />
                {submitIntake.isPending ? (
                  <span className="flex items-center justify-center gap-3">
                    <span className="inline-block w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    {t.intake.submitting}
                  </span>
                ) : (
                  t.intake.submit
                )}
              </button>
            </motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
