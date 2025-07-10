import AdminSongsPanel from "@/components/admin/songs/songAdminPageClient";
import styles from "@/styles/page.module.css";

export default function AdminSongsPage() {
  return (
    <div className={styles.page_default}>
      <AdminSongsPanel />
    </div>
  );
}
