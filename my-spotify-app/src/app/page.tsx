import ArtistSection from "@/components/artist/artistSection";
import Genres from "@/components/genre/genreSections";
import Banner from "@/components/home/banner";
import styles from "@/styles/page.module.css";

export default function Home() {
  return (
    <div className={styles.tenant_page}>
      <Banner />
      <Genres />
      <ArtistSection />
    </div>
  );
}
