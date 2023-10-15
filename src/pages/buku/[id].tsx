import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { useRouter } from "next/router";
import { RefObject, useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import { Document, Page } from "react-pdf";
import { ArrowLeft, Ear, Home, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import { FixedSizeList } from "react-window";

type RectDOMBase = "x" | "y" | "width" | "height";
type RectDOMPos = "top" | "bottom" | "left" | "right";

export default function Buku () {
  const router = useRouter();
  const { id }: {
    id?: string
  } = router.query;
  const { data: buku } = api.buku.getBuku.useQuery(parseInt(id ?? "0"), { enabled: Boolean(id) });

  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);

  const [d_height, setDHeight] = useState<number>();
  const [d_bound, setDBound] = useState<Partial<Record<RectDOMBase | RectDOMPos, number>>>({});
  const [twoPages, setTwoPages] = useState(false);

  const [, setStateAudio] = useState<number>(0);

  const refAudio = useRef<HTMLAudioElement>(null);
  const refCanvas = useRef<HTMLCanvasElement>(null);

  console.log([refCanvas, d_height, d_bound]);

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
    document.addEventListener("click", handleTwoPage);
    return () => document.removeEventListener("click", handleTwoPage)
  }, [refCanvas, d_height, d_bound]);

  function handleTwoPage() {
    if (refCanvas.current) {
      let isTwoPages = false;
      if (refCanvas.current.width * 2 < window.innerWidth) isTwoPages = true;
      setTwoPages(isTwoPages);

      const bound = refCanvas.current.getBoundingClientRect();
      if (refCanvas.current.width <= window.innerWidth) { // Canvas is Fit, use height
        if (Math.abs(refCanvas.current.height - window.innerHeight) > 50) setDBound(bound);
      } else { // Canvas is cramped, use width
        if (Math.abs(refCanvas.current.height - window.innerHeight) > 50) setDBound(bound);
      }

      console.log([refCanvas.current.height, window.innerHeight, Math.abs(refCanvas.current.height - window.innerHeight) > 50]);
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
      <FixedSizeList
        height={d_height ?? 10}
        itemSize={d_bound.width ?? 10}
        layout="horizontal"
        itemCount={numPages}
        width={(d_bound.width ?? 0) * 2}
        className="!overflow-hidden"
      >
        {({index, style}) => (
          <div style={{...style}}>
            <Page {...(index == 0 ? {canvasRef: refCanvas} : {})} pageIndex={index} height={d_height} />
          </div>
        )}
      </FixedSizeList>
    </Document>
  </>;
}

Buku.noNavbar = true;
Buku.offTheme = true;
