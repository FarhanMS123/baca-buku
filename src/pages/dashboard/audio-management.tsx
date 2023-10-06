import { type Dispatch, type SetStateAction, useState, useRef, LegacyRef, ChangeEvent, useEffect } from "react";
import { useMutation } from "@tanstack/react-query";
import axios from "axios";
import { api } from "~/utils/api";
import { XCircle } from "lucide-react";
import { Label } from "~/components/forms";

export type AudioBank = {
  id?: number,
  name: string;
  audio_type: "main_theme" | "backsong" | "audio";
  audio: string;
};

type StateViewer = "add" | AudioBank | null; // | (ReturnType<typeof api.audio.getAudios.useQuery>)["data"];

export default function AudioManagement () {
  const { refetch } = api.audio.getAudios.useQuery();
  const [stateViewer, setStateViewer] = useState<StateViewer>(null);

  function refresh() {
    setStateViewer(null);
    refetch();
  }

  return <>
  <div className="flex gap-4 items-start">
    <AudioList {...{stateViewer, setStateViewer}} />
    {stateViewer != null && <AudioViewer key={new Date().getTime()} {...{stateViewer, refresh}} />}
  </div>
  </>;
}

AudioManagement.theme = "dashboard"

function AudioList ({ stateViewer, setStateViewer }: {
  stateViewer: StateViewer;
  setStateViewer: Dispatch<SetStateAction<StateViewer>>
}) {
  const { data } = api.audio.getAudios.useQuery();

  return(
    <div className="overflow-x-auto max-h-[30rem] table-pin-rows table-pin-cols">
      <table className="table">
        <thead>
          <tr>
            <th>Name</th>
            <th>Type</th>
            <th>Audio</th>
          </tr>
        </thead>

        <tbody>
          {
            (data ?? []).map((audio, i) => 
              <tr key={audio.id} className="hover" onClick={() => setStateViewer(audio as unknown as AudioBank)}>
                <td>{ audio.name }</td>
                <td>{ audio.audio_type }</td>
                <td>
                  <audio controls>
                    <source src={ audio.blob_url } />
                  </audio>
                </td>
              </tr>
            )
          }
        </tbody>

        <tfoot>
          <tr>
            <td colSpan={3}>
              <button className="btn btn-primary ml-auto" onClick={() => setStateViewer("add")}>Add Audio</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function AudioViewer ({ stateViewer, refresh }: {
  stateViewer: StateViewer;
  refresh: () => void
}) {
  const { data: names, isSuccess: uploaded, isError: isUploadError, isLoading: isUploading, mutate: upload, ..._upload } 
        = useMutation((data: FormData) => axios.post<{names: Record<string, string[]>}>("/api/upload", data, {
          headers: {
            "Content-Type": "multipart/form-data",
          }
        }).then(res => res.data));
  const { isSuccess: stored, isError: isStoringError, isLoading: isStoring,  mutate: create, ..._store } = api.audio.uploadAudio.useMutation();
  const { isSuccess: saved, isError: isSavedError, isLoading: isSaving,  mutate: save, ..._save } = api.audio.updateAudio.useMutation();
  const { isSuccess: deleted, mutate: deleteAudio, isLoading: isDeleting } = api.audio.deleteAudio.useMutation();

  const isNew = stateViewer == "add";
  const isLoading = isStoring || isUploading || isSaving || isDeleting;

  const [formData, setFormData] = useState<Partial<AudioBank>>({});
  const [urlObj, setUrlObj] = useState<string>("");
  const [isTriggered, setTrigger] = useState(false);
  const refAudioFile = useRef<HTMLInputElement>(null);
  const refAudioStream = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    URL.revokeObjectURL(urlObj);
    if ( refAudioFile.current?.files?.[0] ) setUrlObj(URL.createObjectURL(refAudioFile.current.files[0]));
    return () => void URL.revokeObjectURL(urlObj);
  }, [ formData ]);

  useEffect(() => {
    if (refAudioStream.current)
      refAudioStream.current.src = urlObj;
  }, [ urlObj ]);

  useEffect(()=>{
      if (!isTriggered) return;

      if ("audio" in formData && typeof names == "object" && typeof names.names == "object" 
          && typeof names.names.audio == "object" && names.names.audio != null) 
        formData.audio = names.names.audio[0];

      if(uploaded || isTriggered) {
        if (isNew) create(formData as AudioBank);
        else save({
          ...(formData as AudioBank),
          id: 0,
        });
      }
  }, [names, isTriggered]);

  useEffect(() => {
    if (isUploadError || isStoringError)
      console.log({
        _upload, _store, _save,
        names, uploaded, isUploadError, isUploading, upload,
        stored, isStoringError, isStoring, create,
        saved, isSavedError, isSaving, save,
      });
  }, [isUploadError, isStoringError]);

  useEffect(() => {
    if (stored || saved || deleted) refresh();
  }, [stored, saved, deleted]);

  const handleFormData = (ev: ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    setFormData((curr) => ({...curr, [ev.target.name]: ev.target.value}));
  }

  function handleFileUpload() {
    if (!("audio" in formData)) return void setTrigger(true);
    const fformData = new FormData();
    fformData.append(refAudioFile.current!.name, refAudioFile.current!.files!.item(0)!);
    upload(fformData);
  }

  return (
    <div className="card w-96 border border-spacing-1">
      <div className="card-body">
        {(isUploadError || isStoringError) && <div className="alert alert-error">
          <XCircle />
          <span>Storing Audio Failed! Please check your input or open console for technical inspection.</span>
        </div>}

        <Label className="w-full" labelTopLeft="Give a cute name for the Audio">
          <input type="text" placeholder="Type here" className="input input-bordered w-full"
            name="name" onChange={handleFormData} defaultValue={(stateViewer as AudioBank)?.name}
          />
        </Label>
        <Label className="w-full" labelTopLeft="Categorize your Audio">
          <select className="select select-bordered w-full" name="audio_type" onChange={handleFormData} defaultValue={(stateViewer as AudioBank)?.audio_type}>
            <option value="main_theme">Main Theme</option>
            <option value="backsong">Backsong</option>
            <option value="audio">Audio</option>
          </select>
        </Label>
        <Label className="w-full" labelTopLeft="Upload the Audio" labelBottomLeft={!isNew && "You could empty this field."}>
          <input type="file" className="file-input file-input-bordered file-input-primary w-full"
            ref={refAudioFile} name="audio" onChange={handleFormData} accept="audio/*"
          />
        </Label>

        {urlObj.length > 0 && <div className="mt-2">
          <audio ref={refAudioStream} controls>
            <source src="#" />
          </audio>
        </div>}

        <div className="card-actions justify-end mt-4">
          {!isNew && <>
            <button className="btn btn-outline btn-error" onClick={() => {isLoading || deleteAudio(stateViewer!.id!)}}>
              Delete {isLoading && <span className="loading loading-spinner text-error"></span>}
            </button>
            <button className="btn btn-primary" onClick={() => { isLoading || handleFileUpload() }}>
              Update {isLoading && <span className="loading loading-spinner text-error"></span>}
            </button>
          </>}
          {isNew && <button className="btn btn-primary" onClick={() => { isLoading || handleFileUpload() }}>
            Add {isLoading && <span className="loading loading-spinner text-neutral"></span>}
          </button>}
        </div>

      </div>
    </div>
  );
}
