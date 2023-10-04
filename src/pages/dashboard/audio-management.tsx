import { type Dispatch, type SetStateAction, useState } from "react";

type AudioBank = {
  name: string;
  audio_type: "main_theme" | "backsong" | "audio";
  audio?: string;
};

type StateViewer = "add" | "update" | null;

export default function AudioManagement () {
  const [stateViewer, setStateViewer] = useState<StateViewer>(null);
  return <>
  <div className="flex gap-4 items-start">
    <AudioList {...{stateViewer, setStateViewer}} />
    {stateViewer != null && <AudioViewer {...{stateViewer, setStateViewer}} />}
  </div>
  </>;
}

AudioManagement.theme = "dashboard"

function AudioList ({ stateViewer, setStateViewer }: {
  stateViewer: StateViewer;
  setStateViewer: Dispatch<SetStateAction<StateViewer>>
}) {
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
            Array(100).fill(0).map((x, i) => 
              <tr key={i} className="hover" onClick={() => setStateViewer("update")}>
                <td>Some Unique Name</td>
                <td>Main Theme</td>
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
            <td colSpan={3}>
              <button className="btn btn-primary ml-auto" onClick={() => setStateViewer("add")}>Add Audio</button>
            </td>
          </tr>
        </tfoot>
      </table>
    </div>
  );
}

function AudioViewer ({ stateViewer, setStateViewer }: {
  stateViewer: StateViewer;
  setStateViewer: Dispatch<SetStateAction<StateViewer>>
}) {
  return (
    <div className="card w-96 border border-spacing-1">
      <div className="card-body">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Give a cute name for the Audio</span>
          </label>
          <input type="text" name="name" placeholder="Type here" className="input input-bordered w-full" />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Categorize your Audio</span>
          </label>
          <select className="select select-bordered w-full">
            <option value="main_theme" selected>Main Theme</option>
            <option value="backsong">Backsong</option>
            <option value="audio">Audio</option>
          </select>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Upload the Audio</span>
          </label>
          <input type="file" className="file-input file-input-bordered file-input-primary w-full" />
          {true && <label className="label">
            <span className="label-text-alt">You could empty this field.</span>
          </label>}
        </div>
        {true && <div className="mt-2">
          <audio controls>
            <source src="#" />
          </audio>
        </div>}
        <div className="card-actions justify-end mt-4">
          {stateViewer == "update" && <>
            <button className="btn btn-outline btn-error">Delete</button>
            <button className="btn btn-primary">Update</button>
          </>}
          {stateViewer == "add" && <button className="btn btn-primary">Add</button>}
        </div>
      </div>
    </div>
  );
}
