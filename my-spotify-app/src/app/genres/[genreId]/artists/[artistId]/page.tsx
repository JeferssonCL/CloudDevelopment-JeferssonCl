import ArtistClientPage from "@/components/artist/artistPageClient";
import styles from "@/styles/page.module.css";

export default async function ArtistPage({
  params,
}: {
  params: Promise<{ artistId: string }>;
}) {
  const { artistId } = await params;

  return (
    <div className={styles.page_default}>
      <ArtistClientPage artistId={artistId} />
    </div>
  );
}
