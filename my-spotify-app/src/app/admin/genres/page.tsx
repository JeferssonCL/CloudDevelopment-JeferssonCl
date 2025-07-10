import AdminGenresPanel from "@/components/admin/genres/genreAdminPageClient";
import styles from "@/styles/page.module.css";

export default function AdminGenresPage() {
  return (
    <div className={styles.page_default}>
      <AdminGenresPanel />
    </div>
  );
}
