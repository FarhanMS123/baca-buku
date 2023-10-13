import Link from "next/link";
import { type Dispatch, type SetStateAction, useState, useRef, useEffect, type ChangeEvent } from "react";
import { Label } from "~/components/forms";
import { useForm } from "react-hook-form";
import { type Book } from "@prisma/client";
import { api } from "~/utils/api";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import _ from "lodash";
import { Trash2 } from 'lucide-react';

type StateViewer = "add" | Book | null;

export default function StoryManagement () {
  const [stateViewer, setStateViewer] = useState<StateViewer>(null);

  function refresh() {
    setStateViewer(null);
  }

  return <>
    <StoryList {...{stateViewer, setStateViewer}} />
    {stateViewer != null && <div className="gap-4 items-start mt-4 md:flex">
      <StoryViewer key={new Date().getTime()} {...{stateViewer, refresh}} />
    </div>}
  </>;
}

StoryManagement.theme = "dashboard";

function StoryList ({ stateViewer, setStateViewer }: {
  stateViewer: StateViewer;
  setStateViewer: Dispatch<SetStateAction<StateViewer>>
}) {
  return(
    <div className="overflow-x-auto max-h-[30rem] table-pin-rows table-pin-cols w-full">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Audio</th>
            <th>Backsong</th>
          </tr>
        </thead>

        <tbody>
          {
            Array(100).fill(0).map((x, i) => 
              <tr key={i} className="hover" onClick={() => setStateViewer("update" as unknown as Book)}>
                <td className="whitespace-nowrap">
                  <Link href="#" className="btn btn-secondary btn-sm">Some Unique Name</Link>
                </td>
                <td className="min-w-[16rem]">
                  A lot and long long so long description
                </td>
                <td>
                  <audio controls>
                    <source src="#" />
                  </audio>
                  {true && <div className="badge badge-primary mt-2">Page: 3</div>}
                </td>
                <td>
                  <audio controls>
                    <source src="#" />
                  </audio>
                </td>
              </tr>
            )
          }
        </tbody>

        <tfoot>
          <tr>
            <td colSpan={4}>
              <button className="btn btn-primary ml-auto" onClick={() => setStateViewer("add")}>Add Story</button>
            </td>
          </tr>
        </tfoot>

      </table>
    </div>
  );
}

function StoryViewer ({ stateViewer, refresh }: {
  stateViewer: StateViewer;
  refresh: () => void;
}) {
  const { data: names, isSuccess: uploaded, isError: isUploadError, isLoading: isUploading, mutateAsync: upload, ..._upload } 
        = useMutation((data: FormData) => axios.post<{names: Record<string, string[]>}>("/api/upload", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }).then(res => res.data));
  const { isSuccess: deleted, mutate: deleteBuku, isLoading: isDeleting } = api.buku.deleteBuku.useMutation();
  const { mutateAsync: store, isLoading: isStoring } = api.buku.addBuku.useMutation();
  const { mutateAsync: save, isLoading: isSaving } = api.buku.updateBuku.useMutation();

  const isNew = stateViewer == "add";
  const isLoading = isUploading || isDeleting || isStoring || isSaving;

  const {data: audios} = api.audio.getAudios.useQuery("audio");
  const {data: backsongs} = api.audio.getAudios.useQuery("backsong");

  const { register, setValue, getValues, watch, getFieldState, trigger, control  } = useForm<Book & { ebook: FileList, thumb: FileList }>();

  const { data: bs } = api.audio.getAudio.useQuery(watch("backsong_id") ?? 0);

  useEffect(() => {
    if (deleted) refresh();
  }, [deleted]);

  useEffect(() => {
    if (isNew) {
      if (audios) setValue("audio_id", audios[0]?.id ?? 0 );
      if (backsongs) setValue("backsong_id", backsongs[0]?.id ?? 0 );
    }
  }, [audios, backsongs]);

  async function handleSubmit (state: "add" | "update") {
    let file: string | null = null;
    let thumb: string | null = null;

    const fformData = new FormData();
    if (getValues("ebook")) fformData.append("ebook", getValues("ebook").item(0)!);
    if (getValues("thumb")) fformData.append("thumb", getValues("thumb").item(0)!);
      
    const ret = await upload(fformData);
    
    if (getValues("ebook")) file = ret.names.ebook![0]!;
    if (getValues("thumb")) thumb = ret.names.thumb![0]!;

    if (state == "add")
      await store({
        name: getValues("name"),
        description: getValues("description"),
        audio_id: getValues("audio_id")!,
        backsong_id: getValues("backsong_id")!,
        book: file!,
        thumb: thumb!,
        segment: [],
      });
    else if (state == "update") {
      const payload: Parameters<typeof save>[0] = {
        id: 0,
      };

      if ( getFieldState("name").isDirty ) payload.name = getValues("name");
      if ( getFieldState("description").isDirty ) payload.description = getValues("description");
      if ( getFieldState("audio_id").isDirty ) payload.audio_id = getValues("audio_id")!;
      if ( getFieldState("backsong_id").isDirty ) payload.backsong_id = getValues("backsong_id")!;
      if ( file ) payload.book = file;

      await save(payload);
    }
  }

  return <>
    <div className="card border border-1 md:w-96">
      <div className="card-body">

        <Label labelTopLeft="Give the story an inspiring name">
          <input type="text" placeholder="Type here" className="input input-bordered w-full" {...register("name")} />
        </Label>
        <Label labelTopLeft="Tell a little spoiler to attract curiosity - description">
          <textarea placeholder="Type here" className="textarea textarea-bordered w-full" {...register("description")}></textarea>
        </Label>
        <Label labelTopLeft="Upload the story" labelBottomLeft={!isNew && "You could empty this field."}>
          <input type="file" className="file-input file-input-bordered file-input-primary w-full" {...register("ebook")} />
        </Label>
        <Label labelTopLeft="Set an Interesting Cover for the Book - Thumbnail" labelBottomLeft={!isNew && "You could empty this field."}>
          <input type="file" className="file-input file-input-bordered file-input-primary w-full" {...register("thumb")} />
        </Label>
        <Label labelTopLeft="Select Audio for Story Teller">
          <select className="select select-bordered w-full" {...register("audio_id", { valueAsNumber: true })}>
            {audios?.map((audio => (
              <option key={audio.id} value={audio.id}>{ audio.name }</option>
            )))}
          </select>
        </Label>
        <Label labelTopLeft="Select Backsong to hypeup the story">
          <select className="select select-bordered w-full" {...register("backsong_id", { valueAsNumber: true })}>
            {backsongs?.map((backsong, i) => (
              <option key={backsong.id} value={backsong.id}>{ backsong.name }</option>
            ))}
          </select>
        </Label>

        {bs && <div className="mt-2">
          <audio controls className="max-w-full">
            <source src={bs.blob_url} />
          </audio>
        </div>}

        <div className="card-actions justify-end mt-4">
          {!isNew && <>
            <button className="btn btn-outline btn-error" onClick={() => deleteBuku(stateViewer!.id)} disabled={isLoading}>
              Delete {isDeleting && <span className="loading loading-spinner text-error"></span>}
            </button>
            <button className="btn btn-primary" onClick={() => void handleSubmit("update")} disabled={isLoading}>
              Update {isSaving && <span className="loading loading-spinner text-primary-content"></span>}
            </button>
          </>}
          {isNew && <button className="btn btn-primary" onClick={() => void handleSubmit("add")} disabled={isLoading}>
            Add {isDeleting && <span className="loading loading-spinner text-primary-content"></span>}
          </button>}
        </div>
      </div>
    </div>
    {watch("audio_id") && !isNaN(getValues("audio_id")!) &&
    <AudioStamping srcId={ watch("audio_id")! } segment={ watch("segment") }
      setValue={(data) => setValue("segment", data)} /> }
  </>;
}

function AudioStamping ({ srcId, segment, setValue }: {
  srcId: number;
  segment: Book["segment"];
  setValue: (data: Book["segment"]) => void;
}) {
  const { data: audio } = api.audio.getAudio.useQuery(srcId);
  const refAudio = useRef<HTMLAudioElement>(null);

  function stamp() {
    let arr: Book["segment"] = 
      (typeof segment == "object" && (segment as any[]).constructor.name == Array.name) ? segment : [];
    arr = [
      ...arr,
      {
        timestamp: refAudio.current!.currentTime,
        page: 0
      }
    ];
    arr = _.chain(arr).sortBy(["timestamp"]).uniqBy("timestamp").value();
    setValue(arr);
  }

  function handlePageChange (ev: ChangeEvent<HTMLInputElement>, i: number) {
    segment[i]!.page = parseInt(ev.target.value);
    setValue([...segment]);
  }

  function handleDelete (i: number) {
    _.pullAt(segment, [i]);
    setValue([...segment]);
  }

  return (
    <div className="card border border-1">
      <div className="card-body">
        <div className="items-center gap-2 md:flex">
          <audio ref={refAudio} controls className="max-w-full">
            {audio && <source src={ audio.blob_url } />}
          </audio>
          <button className="btn btn-primary" onClick={stamp}>Stamp</button>
        </div>
        <table className="table">
          <thead>
            <tr>
              <th>Timestamp</th>
              <th>Page</th>
              <th></th>
            </tr>
          </thead>
          <tbody>
            { segment?.map((x, i) => (
              <tr key={x.timestamp}>
                <td>{x.timestamp}</td>
                <td>
                  <input type="text" placeholder="Page Number" className="input input-bordered w-full"
                    defaultValue={x.page} onChange={(ev) => handlePageChange(ev, i)} />
                </td>
                <td>
                  <button className="btn btn-circle btn-error" onClick={() => handleDelete(i)}>
                    <Trash2 />
                  </button>
                </td>
              </tr>
            )) }
          </tbody>
        </table>
      </div>
    </div>
  );
}
