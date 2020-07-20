import {en_US as baseCoreLocale} from "../../core/locales/en_US";
import {Locale as CoreLocale} from "../../core/locales/Locale";
import {CoreHelper} from "../../core/utils/CoreHelper";
import {Locale} from "./Locale";

const uiLocale: Omit<Locale, keyof CoreLocale> = {
  "Common-loadingText": "Loading...",
  "Home-title": "Home",
  "Input-hide": "hide",
  "Input-show": "show",
  "SignIn-emailInputLabel": "Email",
  "SignIn-passwordInputLabel": "Password",
  "SignIn-submitButtonLabel": "Log in",
  "SignIn-unsuccessfulSignInMessage": "Sign in unsuccessful",
  "SignUp-title": "Sign up",
  "Welcome-signIn": "Sign in instead",
  "Welcome-signInHeading": "Already have an account?",
  "Welcome-signUp": "Sign up",
  "Welcome-title": "Welcome!",
  "Welcome-welcomeMessage": "Welcome {userName}!",
};

const coreLocale: Partial<CoreLocale> = {};

CoreHelper.mergeWith(baseCoreLocale, CoreHelper.mergeWith(coreLocale, uiLocale));
