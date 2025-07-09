import GenreClientPage from "@/components/genre/genrePageClient";
import styles from "@/styles/page.module.css";

export default async function GenresPage({
  params,
}: {
  params: Promise<{ genreId: string }>;
}) {
  const { genreId } = await params;

  return (
    <div className={styles.page_default}>
      <GenreClientPage genreId={genreId} />
    </div>
  );
}
