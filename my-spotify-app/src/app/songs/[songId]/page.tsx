import SongPlayerPage from "@/components/music/musicPageClient";
import styles from "@/styles/page.module.css";

export default async function SongPage({
  params,
}: {
  params: Promise<{ songId: string }>;
}) {
  const { songId } = await params;

  return (
    <div className={styles.page_default}>
      <SongPlayerPage songId={songId} />
    </div>
  );
}
