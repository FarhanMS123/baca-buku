import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

import { useRouter } from "next/router";
import { RefObject, useCallback, useEffect, useRef, useState } from "react";
import { api } from "~/utils/api";
import { Document, Page } from "react-pdf";
import { ArrowLeft, Ear, Home, Volume2, VolumeX } from 'lucide-react';
import Link from 'next/link';
import { FixedSizeList } from "react-window";
import { useClientSide } from '~/hooks/solver';

type RectDOMBase = "x" | "y" | "width" | "height";
type RectDOMPos = "top" | "bottom" | "left" | "right";

export default function Buku () {
  const router = useRouter();
  const { id }: {
    id?: string
  } = router.query;
  const { data: buku } = api.buku.getBuku.useQuery(parseInt(id ?? "0"), { enabled: Boolean(id) });

  const [isClient] = useClientSide();
  const [_refreshState, _refresh] = useState<number>();
  const refreshState = () => void _refresh(Math.random());

  const [totalPages, setTotalPages] = useState(0);
  const [visibleStartIndex, setVisibleStartIndex] = useState(0);
  const [canvasBound, setCanvasBound] = useState<DOMRect>({ x: 0, y: 0, width: 10, height: 10, top: 0, left: 0, right: 10, bottom: 10, toJSON: () => ({}) });
  const [d_width, setDWidth] = useState<[number, boolean]>([100, false]); // width, required
  const [d_height, setDHeight] = useState(100);

  const [twoPages, setTwoPages] = useState(false);

  const refAudio = useRef<HTMLAudioElement>(null);
  const refPageCanvas = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    // refAudio.current?.load();

    const handle = () => {
      if (refAudio.current?.readyState == 0) refAudio.current?.load();
      else if (!refAudio.current?.paused) document.removeEventListener("click", handle);
      
      refAudio.current?.play();
      refreshState();
    };
    // document.addEventListener("click", handle);
    // return () => document.removeEventListener("click", handle);

  }, [buku]);

  useEffect(() => {
    handleResize();
    document.addEventListener("click", handleResize);
    window.addEventListener('resize', handleResize);
    return () => {
      document.removeEventListener("click", handleResize);
      window.removeEventListener("resize", handleResize);
    }
  }, []);

  function handleResize() {
    if (refPageCanvas.current) {
      const bound = refPageCanvas.current.getBoundingClientRect();
      setCanvasBound(bound);

      if (bound.width * 2 <= window.innerWidth) setTwoPages(true);
      else setTwoPages(false);

      if (window.innerWidth < bound.width) setDWidth([window.innerWidth, true]);
      else if (window.innerHeight < bound.height) setDWidth([window.innerWidth, false]);
      else if (window.innerWidth > bound.width) setDWidth([window.innerWidth, false]);

      console.log([window.innerHeight, bound.height, window.innerHeight < bound.height]);
    }

    setDHeight(window.innerHeight);
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
        onClick={() => {refAudio.current?.paused ? refAudio.current?.play() : refAudio.current?.pause(); refreshState();} }
      >
        {refAudio.current?.paused ? <VolumeX /> : <Volume2 />}
      </button>
    </div>

    <Document file={buku.blob_url} onLoadSuccess={({ numPages }) => void setTotalPages(numPages)} className="relative">
      <Page canvasRef={refPageCanvas} pageIndex={visibleStartIndex} 
        height={d_height} width={d_width[1] ? d_width[0] : undefined}
        className="!bg-transparent absolute -z-10 -top-full -left-full !max-w-min" 
      />
      <FixedSizeList
        layout="horizontal"
        itemCount={totalPages}
        itemSize={d_width[0]}
        // width={twoPages ? canvasBound.width * 2 : canvasBound.width}
        width={canvasBound.width}
        height={d_height}
        onItemsRendered={({ visibleStartIndex }) => setVisibleStartIndex(visibleStartIndex)}
      >
        {({ index, style }) => (
          <div style={style}>
            <Page pageIndex={index} height={d_height} width={d_width[1] ? d_width[0] : undefined} className="!max-w-min" />
          </div>
        )}
      </FixedSizeList>
    </Document>
  </>;
}

Buku.noNavbar = true;
Buku.offTheme = true;
