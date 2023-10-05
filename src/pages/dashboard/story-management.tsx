import Link from "next/link";
import { type Dispatch, type SetStateAction, useState } from "react";

type StateViewer = "add" | "update" | null;

export default function StoryManagement () {
  const [stateViewer, setStateViewer] = useState<StateViewer>(null);

  return <>
    <StoryList {...{stateViewer, setStateViewer}} />
    {stateViewer != null && <div className="flex gap-4 items-start mt-4">
      <StoryViewer {...{stateViewer, setStateViewer}} />
      <AudioStamping />
    </div>}
  </>;
}

StoryManagement.theme = "dashboard"

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

function StoryViewer ({ stateViewer, setStateViewer }: {
  stateViewer: StateViewer;
  setStateViewer: Dispatch<SetStateAction<StateViewer>>
}) {

  return (
    <div className="card w-96 border border-spacing-1">
      <div className="card-body">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Give the story an inspiring name</span>
          </label>
          <input type="text" name="name" placeholder="Type here" className="input input-bordered w-full" />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Tell a little spoiler to attract curiosity - description</span>
          </label>
          <input type="text" name="name" placeholder="Type here" className="input input-bordered w-full" />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Upload the story</span>
          </label>
          <input type="file" className="file-input file-input-bordered file-input-primary w-full" />
          {true && <label className="label">
            <span className="label-text-alt">You could empty this field.</span>
          </label>}
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Select Audio for Story Teller</span>
          </label>
          <select className="select select-bordered w-full">
            <option value="" selected>Audio 1</option>
            <option value="">Audio 2</option>
            <option value="">Audio 3</option>
          </select>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Select Backsong to hypeup the story</span>
          </label>
          <select className="select select-bordered w-full">
            <option value="" selected>Song 1</option>
            <option value="">Song 2</option>
            <option value="">Song 3</option>
          </select>
        </div>

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
