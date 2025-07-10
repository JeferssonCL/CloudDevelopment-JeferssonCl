import AdminArtistsPanel from "@/components/admin/artists/artistAdminPageClient";
import styles from "@/styles/page.module.css";

export default function AdminArtistsPage() {
  return (
    <div className={styles.page_default}>
      <AdminArtistsPanel />
    </div>
  );
}
