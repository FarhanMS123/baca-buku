import Link from "next/link";
import { type Dispatch, type SetStateAction, useState, useRef, useEffect } from "react";
import { Label } from "~/components/forms";
import { useForm } from "react-hook-form";
import { type Book } from "@prisma/client";
import { api } from "~/utils/api";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";

type StoryBank = {
  id?: number;
  name: string;
  description: string;
};

type StateViewer = "add" | Book | null;

export default function StoryManagement () {
  const [stateViewer, setStateViewer] = useState<StateViewer>(null);

  function refresh() {
    setStateViewer(null);
  }

  return <>
    <StoryList {...{stateViewer, setStateViewer}} />
    {stateViewer != null && <div className="flex gap-4 items-start mt-4">
      <StoryViewer key={new Date().getTime()} {...{stateViewer, refresh}} />
      <AudioStamping />
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
              <tr key={i} className="hover" onClick={() => setStateViewer("update")}>
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
  const { register, setValue, getValues, watch  } = useForm<Book & { ebook: FileList }>();

  useEffect(() => {
    if (deleted) refresh();
  }, [deleted]);

  async function handleSubmit (state: "add" | "update") {
    let file: string | null = null;;

    if (getValues("ebook")) {
      const fformData = new FormData();
      fformData.append("ebook", getValues("ebook").item(0)!);
      const ret = await upload(fformData);
      file = ret.names.ebook![0]!;
    }

    if (state == "add")
      await store({
        name: getValues("name"),
        description: getValues("description"),
        audio_id: getValues("audio_id") as number,
        backsong_id: getValues("backsong_id") as number,
        book: file!,
        segment: [],
      });
    else if (state == "update") 
      await save({
        id: 0,
      });
  }

  return (
    <div className="card w-96 border border-spacing-1">
      <div className="card-body">

        <Label labelTopLeft="Give the story an inspiring name">
          <input type="text" placeholder="Type here" className="input input-bordered w-full" {...register("name")} />
        </Label>
        <Label labelTopLeft="Tell a little spoiler to attract curiosity - description">
          <input type="text" placeholder="Type here" className="input input-bordered w-full" {...register("description")} />
        </Label>
        <Label labelTopLeft="Upload the story" labelBottomLeft={true && "You could empty this field."}>
          <input type="file" className="file-input file-input-bordered file-input-primary w-full" {...register("ebook")} />
        </Label>
        <Label labelTopLeft="Select Audio for Story Teller">
          <select className="select select-bordered w-full" {...register("audio_id")}>
            {audios?.map((audio => (
              <option key={audio.id} value={audio.id}>{ audio.name }</option>
            )))}
          </select>
        </Label>
        <Label labelTopLeft="Select Backsong to hypeup the story">
          <select className="select select-bordered w-full" {...register("backsong_id")}>
            {backsongs?.map((backsong => (
              <option key={backsong.id} value={backsong.id}>{ backsong.name }</option>
            )))}
          </select>
        </Label>

        {true && <div className="mt-2">
          <audio controls>
            <source src="#" />
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
  );
}

function AudioStamping () {
  return (
    <div className="card border border-spacing-1">
      <div className="card-body">
        <div className="flex items-center gap-2">
          <audio controls>
            <source src="#" />
          </audio>
          <button className="btn btn-primary">Stamp</button>
        </div>
      </div>
    </div>
  );
}
