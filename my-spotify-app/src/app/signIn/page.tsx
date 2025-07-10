import { LoginForm } from "@/components/auth/loginForm";
import styles from "@/styles/page.module.css";

export default function SignInPage() {
  return (
    <div className={styles.page_default}>
      <LoginForm />
    </div>
  );
}
