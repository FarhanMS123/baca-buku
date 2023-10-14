import { useRouter } from "next/router";
import { useEffect, useRef } from "react";
import { api } from "~/utils/api";

export default function Buku () {
  const router = useRouter();
  const { id }: {
    id?: string
  } = router.query;
  const { data: buku } = api.buku.getBuku.useQuery(parseInt(id ?? "0"), { enabled: Boolean(id) });

  const refAudio = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    const handle = () => {
      if (refAudio.current?.readyState == 0) refAudio.current?.load();
      else if (!refAudio.current?.paused) document.removeEventListener("click", handle);
      
      refAudio.current?.play();
    };

    document.addEventListener("click", handle);

    refAudio.current?.load();

    return () => document.removeEventListener("click", handle);

  }, [refAudio, buku]);

  return <>
    <audio ref={refAudio} autoPlay controls loop>
      <source src={buku?.backsong?.blob_url} />
    </audio>
  </>;
}

Buku.noNavbar = true;
Buku.offTheme = true;
