import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { useRouter } from "next/router";
import { RefObject, useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import { Document, Page } from "react-pdf";
import { ArrowLeft, Ear, Home, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';

export default function Buku () {
  const router = useRouter();
  const { id }: {
    id?: string
  } = router.query;
  const { data: buku } = api.buku.getBuku.useQuery(parseInt(id ?? "0"), { enabled: Boolean(id) });

  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [d_height, setDHeight] = useState<number>();
  const [d_width, setDWidth] = useState<number>();
  const [twoPages, setTwoPages] = useState(false);

  const [stateAudio, setStateAudio] = useState<number>(0);

  const refAudio = useRef<HTMLAudioElement>(null);
  const refCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const handle = () => {
      if (refAudio.current?.readyState == 0) refAudio.current?.load();
      else if (!refAudio.current?.paused) document.removeEventListener("click", handle);
      
      refAudio.current?.play();
      setStateAudio(Math.random())
    };

    document.addEventListener("click", handle);

    refAudio.current?.load();

    return () => document.removeEventListener("click", handle);

  }, [refAudio, buku]);

  useEffect(() => {
    const handleResize = () => {
      setDHeight(window.innerHeight);
    };
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    handleTwoPage();
  }, [refCanvas, d_height]);

  function handleTwoPage() {
    if (refCanvas.current) {
      if (refCanvas.current.width * 2 < window.innerWidth) setTwoPages(true);
      else setTwoPages(false);

      if (window.innerWidth < refCanvas.current.width) setDWidth(window.innerWidth);
      else setDWidth(undefined);
    }
  }

  function setPage(cur: 1 | -1) {
    if (cur == 1 && pageNumber < numPages) setPageNumber((x) => x + 1);
    else if (cur == -1 && pageNumber > 1) setPageNumber((x) => x - 1);
  }

  function handlePaginationFirst(ev: MouseEvent) {
    if (twoPages) setPage(-1);
    else {
      const bound = refCanvas.current!.getBoundingClientRect();
      const w_2 = bound.width / 4; 
      const [x, y] = [ev.clientX - bound.x, ev.clientY - bound.y];

      if (x < w_2) setPage(-1);
      else if (x > w_2 * 3) setPage(1);
    }
  }

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  if (!buku) return (<></>);

  return <>
    <audio ref={refAudio} autoPlay loop>
      <source src={buku.backsong?.blob_url} />
    </audio>

    <Link className="btn btn-circle bg-base-content text-base-100 fixed top-8 left-8 z-[99999] shadow-lg border-0" href="/">
      <Home />
    </Link>
    <div className="flex gap-4 fixed top-8 right-8 z-[99999]">
      <button className="btn btn-circle bg-base-content text-base-100 shadow-lg border-0">
        <Ear />
      </button>
      <button className="btn btn-circle bg-base-content text-base-100 shadow-lg border-0"
        onClick={() => {refAudio.current?.paused ? refAudio.current?.play() : refAudio.current?.pause(); setStateAudio(Math.random());} }
      >
        {refAudio.current?.paused ? <VolumeX /> : <Volume2 />}
      </button>
    </div>

    <Document file={buku.blob_url} onLoadSuccess={onDocumentLoadSuccess} className="flex justify-center items-center h-screen sm:h-auto">
      <Page canvasRef={refCanvas} pageNumber={pageNumber} height={d_height} width={d_width}
        className="!bg-transparent !max-w-min" onRenderSuccess={handleTwoPage} onClick={handlePaginationFirst} />
      {twoPages && <Page pageNumber={pageNumber + 1} height={d_height} className="!bg-transparent !max-w-min" onClick={() => setPage(1)} />}
    </Document>
  </>;
}

Buku.noNavbar = true;
Buku.offTheme = true;
