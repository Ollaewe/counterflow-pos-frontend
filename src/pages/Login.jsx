import React, { useState } from "react";
import {
  ShoppingBasket,
  Boxes,
  ChartNoAxesCombined,
  Eye,
  EyeOff,
  Store,
} from "lucide-react";
import Button from "../components/ui/Button.jsx";
import Field from "../components/ui/Field.jsx";
import { api } from "../services/api.js";

export default function Login({ onSuccess, setup }) {
  const [error, setError] = useState(""),
    [busy, setBusy] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  return (
    <div className="login">
      <div className="login-story">
        <div className="brand">
          <div className="brand-mark">c</div> counterflow<span>POS</span>
        </div>
        <div>
          <span className="eyebrow">YOUR STORE. IN SYNC.</span>
          <h1>
            A clearer view.
            <br />A smoother checkout.
          </h1>
          <p>
            Sales, stock, and your team.
            <br />
            Everything working together.
          </p>
          <div className="story-metrics">
            <div>
              <ShoppingBasket />
              <b>Sell with ease</b>
            </div>
            <div>
              <Boxes />
              <b>Know your stock</b>
            </div>
            <div>
              <ChartNoAxesCombined />
              <b>See your growth</b>
            </div>
          </div>
        </div>
        <span className="story-foot">
          Built for the way your business moves.
        </span>
      </div>
      <div className="login-form">
        <div className="mobile-brand">Counterflow POS</div>
        <span className="eyebrow">
          {setup ? "LET’S SET UP YOUR STORE" : "WELCOME BACK"}
        </span>
        <h2>{setup ? "Make it yours." : "Ready for a good day?"}</h2>
        <p>
          {setup
            ? "Create the first administrator account."
            : "Sign in to your store workspace."}
        </p>
        <form
          onSubmit={async (e) => {
            e.preventDefault();
            setBusy(true);
            setError("");

            const b = Object.fromEntries(new FormData(e.currentTarget));

            try {
              if (setup) {
                await api("/setup", {
                  ...b,
                  sample: b.sample === "on",
                });

                await api("/login", {
                  username: b.username,
                  password: b.password,
                });
              } else {
                await api("/login", b);
              }

              await onSuccess();
            } catch (err) {
              setError(err.message);
            } finally {
              setBusy(false);
            }
          }}
        >
          {setup && (
            <>
              <Field
                label="Store name"
                name="store_name"
                placeholder="e.g. Mainland Supermarket"
                required
              />

              <Field label="Your full name" name="name" required />
            </>
          )}

          <Field
            label="Username"
            name="username"
            autoComplete="username"
            required
          />

          <div className="field">
            <label htmlFor="login-password">Password</label>

            <div className="password-input">
              <input
                id="login-password"
                name="password"
                type={showPassword ? "text" : "password"}
                autoComplete={setup ? "new-password" : "current-password"}
                minLength={setup ? 12 : 1}
                required
              />

              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword((visible) => !visible)}
                aria-label={showPassword ? "Hide password" : "Show password"}
                aria-controls="login-password"
                aria-pressed={showPassword}
                title={showPassword ? "Hide password" : "Show password"}
              >
                {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
              </button>
            </div>
          </div>

          {setup && (
            <label className="check">
              <input type="checkbox" name="sample" defaultChecked />
              Start with a sample product catalogue
            </label>
          )}

          {error && (
            <div className="error" role="alert">
              {error}
            </div>
          )}

          <Button type="submit" className="primary full" disabled={busy}>
            {busy ? "Please wait…" : setup ? "Create store" : "Sign in"}
          </Button>
        </form>
        <div className="login-note">
          <Store size={17} />
          {setup
            ? "Your account controls staff access and store settings."
            : "Your role determines which tools you can access."}
        </div>
      </div>
    </div>
  );
}
