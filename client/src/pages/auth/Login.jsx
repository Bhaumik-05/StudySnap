import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Container from "../../components/ui/Container";
import Input from "../../components/ui/Input";
import Button from "../../components/ui/Button";
import Alert from "../../components/ui/Alert";
import { useAuth } from "../../context/AuthContext";
import { getErrorMessage } from "../../lib/api";
import { validateEmail, validateLoginPassword } from "../../lib/validators";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [form, setForm] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [submitError, setSubmitError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const redirectTo = location.state?.from?.pathname || "/dashboard";

  const setField = (field) => (event) => {
    setForm((prev) => ({ ...prev, [field]: event.target.value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
    setSubmitError("");
  };

  function validate() {
    const nextErrors = {};
    const emailError = validateEmail(form.email);
    if (emailError) nextErrors.email = emailError;
    const passwordError = validateLoginPassword(form.password);
    if (passwordError) nextErrors.password = passwordError;
    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  }

  async function handleSubmit(event) {
    event.preventDefault();
    setSubmitError("");
    if (!validate()) return;

    setSubmitting(true);
    try {
      await login({ email: form.email.trim(), password: form.password });
      navigate(redirectTo, { replace: true });
    } catch (error) {
      setSubmitError(getErrorMessage(error, "Login failed."));
    } finally {
      setSubmitting(false);
    }
  }


return (
  <main className="min-h-screen overflow-hidden bg-[var(--background)]">
    <div className="grid min-h-screen lg:grid-cols-[1fr_1.05fr]">
      {/* Left: auth */}
      <section className="relative flex min-h-screen flex-col justify-between border-r border-black/10 px-6 py-6 sm:px-10 lg:px-12">
        {/* Header */}
        <div className="flex items-center justify-between">
          <Link
            to="/"
            className="group inline-flex items-center gap-2 font-semibold tracking-tight"
          >
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-black text-sm font-black text-white">
              S
            </span>

            <span className="text-lg">StudySnap</span>

            <span className="ml-1 rounded-full bg-white px-2.5 py-1 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black/60 shadow-sm ring-1 ring-black/10">
              Notes
            </span>
          </Link>

          <span className="font-mono text-[10px] font-bold uppercase tracking-[0.2em] text-black/35">
            Auth / 01
          </span>
        </div>

        {/* Form area */}
        <div className="mx-auto w-full max-w-md py-14 lg:py-10">
          <div className="mb-8">
            <span className="font-mono text-[11px] font-bold uppercase tracking-[0.22em] text-black/40">
              Welcome back
            </span>

            <h1 className="mt-3 text-[clamp(3.5rem,7vw,6.5rem)] font-black leading-[0.88] tracking-[-0.075em]">
              Sign
              <br />
              <span className="text-black/25">in.</span>
            </h1>

            <p className="mt-6 max-w-sm text-sm leading-6 text-black/55">
              Pick up where you left off. Access your notes, tagged study
              material and shared academic resources in one place.
            </p>
          </div>

          <div className="mb-8 h-px w-full bg-black/10" />

          <form
            className="flex flex-col gap-5"
            onSubmit={handleSubmit}
            noValidate
          >
            {submitError && (
              <Alert
                variant="error"
                className="rounded-sm border border-red-200 bg-red-50 text-sm"
              >
                {submitError}
              </Alert>
            )}

            <Input
              label="Email"
              name="email"
              type="email"
              autoComplete="email"
              placeholder="you@example.com"
              value={form.email}
              onChange={setField("email")}
              error={errors.email}
            />

            <Input
              label="Password"
              name="password"
              type="password"
              autoComplete="current-password"
              value={form.password}
              onChange={setField("password")}
              error={errors.password}
            />

            <Button
              type="submit"
              variant="accent"
              loading={submitting}
              className="mt-1 min-h-14 w-full rounded-sm bg-black px-6 text-sm font-bold uppercase tracking-[0.08em] text-white transition-all hover:bg-black/90 hover:shadow-[6px_6px_0_0_var(--accent)]"
            >
              Log in
            </Button>
          </form>

          <div className="mt-8 flex items-center justify-between gap-4 text-xs">
            <span className="text-black/45">
              New to StudySnap?
            </span>

            <Link
              to="/register"
              className="font-semibold underline decoration-black/20 underline-offset-4 transition-colors hover:text-black hover:decoration-black"
            >
              Create an account
            </Link>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-end justify-between gap-6 text-[10px] font-mono uppercase tracking-[0.16em] text-black/35">
          <span>StudySnap / Academic Workspace</span>
          <span>01 / 02</span>
        </div>
      </section>

      {/* Right: Kaminari-inspired StudySnap panel */}
      <section className="relative hidden min-h-screen overflow-hidden bg-[#dff3ed] lg:flex">
        {/* oversized section number */}
        <div className="absolute left-10 top-6 z-10 text-[clamp(4rem,8vw,8rem)] font-black leading-none tracking-[-0.08em] text-black">
          01
        </div>

        {/* top label */}
        <div className="absolute right-10 top-8 z-10 rounded-full bg-white/70 px-4 py-2 font-mono text-[10px] font-bold uppercase tracking-[0.18em] text-black/60 backdrop-blur-sm">
          Your academic space
        </div>

        {/* visual field */}
        <div className="relative flex w-full items-center justify-center p-14">
          <div className="relative aspect-square w-[min(72%,580px)]">
            {/* mint/orange abstract shapes */}
            <div className="absolute inset-[14%] rounded-[2.5rem] border border-black/10 bg-[#eefaf6] rotate-[-5deg]" />

            <div className="absolute inset-[11%] rounded-[2.5rem] bg-[#9ff5df] rotate-[5deg] shadow-[18px_18px_0_rgba(17,17,17,0.08)]" />

            {/* main note */}
            <div className="absolute left-[18%] top-[17%] w-[64%] rounded-sm bg-white p-6 shadow-[0_30px_70px_rgba(17,17,17,0.16)] rotate-[-3deg]">
              <div className="mb-7 flex items-center justify-between">
                <span className="font-mono text-[9px] font-bold uppercase tracking-[0.18em] text-black/40">
                  Study / 2026
                </span>

                <span className="h-3 w-3 rounded-full bg-[#f6c46f]" />
              </div>

              <div className="space-y-3">
                <div className="h-2 w-[78%] rounded-full bg-black" />
                <div className="h-2 w-full rounded-full bg-black/10" />
                <div className="h-2 w-[88%] rounded-full bg-black/10" />
                <div className="h-2 w-[67%] rounded-full bg-black/10" />
              </div>

              <div className="mt-8 grid grid-cols-3 gap-2">
                <div className="h-12 rounded-sm bg-[#eefaf6]" />
                <div className="h-12 rounded-sm bg-[#f7efe2]" />
                <div className="h-12 rounded-sm bg-[#f1ebff]" />
              </div>

              <div className="mt-8 flex gap-2">
                <span className="rounded-full bg-[#ff6b61] px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-white">
                  Red
                </span>

                <span className="rounded-full bg-[#5b8def] px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-white">
                  Blue
                </span>

                <span className="rounded-full bg-[#f1c453] px-2.5 py-1 font-mono text-[8px] font-bold uppercase tracking-[0.12em] text-black">
                  Saved
                </span>
              </div>
            </div>

            {/* floating PDF card */}
            <div className="absolute bottom-[12%] right-[6%] w-[34%] rounded-sm border border-black/10 bg-white p-4 shadow-[0_20px_50px_rgba(17,17,17,0.12)] rotate-[7deg]">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-sm bg-black font-mono text-[10px] font-bold text-white">
                PDF
              </div>

              <div className="space-y-2">
                <div className="h-1.5 w-full rounded-full bg-black/15" />
                <div className="h-1.5 w-[82%] rounded-full bg-black/15" />
                <div className="h-1.5 w-[61%] rounded-full bg-black/15" />
              </div>
            </div>

            {/* floating tag */}
            <div className="absolute left-[4%] bottom-[18%] rounded-full border border-black/10 bg-white px-5 py-3 shadow-lg rotate-[-8deg]">
              <div className="font-mono text-[9px] font-bold uppercase tracking-[0.15em]">
                Organise.
              </div>
              <div className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-black/40">
                Learn.
              </div>
              <div className="font-mono text-[9px] font-bold uppercase tracking-[0.15em] text-black/40">
                Share.
              </div>
            </div>
          </div>
        </div>

        {/* bottom editorial text */}
        <div className="absolute bottom-7 left-10 right-10 flex items-end justify-between gap-8">
          <div className="max-w-sm">
            <p className="text-[clamp(1.7rem,3vw,3.2rem)] font-black leading-[0.95] tracking-[-0.06em]">
              Notes that
              <br />
              move with you.
            </p>
          </div>

          <div className="max-w-[180px] text-right font-mono text-[9px] font-bold uppercase leading-4 tracking-[0.15em] text-black/45">
            Search.
            <br />
            Tag.
            <br />
            Download.
            <br />
            Share.
          </div>
        </div>
      </section>
    </div>
  </main>
);

}

export default Login;
