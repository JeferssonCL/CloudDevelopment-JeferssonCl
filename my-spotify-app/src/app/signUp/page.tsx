import { RegisterForm } from "@/components/auth/registerForm";
import styles from "@/styles/page.module.css";

export default function SignUpPage() {
  return (
    <div className={styles.page_default}>
      <RegisterForm />
    </div>
  );
}
