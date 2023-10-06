import Link from "next/link";
import { type Dispatch, type SetStateAction, useState } from "react";
import { Label } from "~/components/forms";

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

        <Label labelTopLeft="Give the story an inspiring name">
          <input type="text" name="name" placeholder="Type here" className="input input-bordered w-full" />
        </Label>
        <Label labelTopLeft="Tell a little spoiler to attract curiosity - description">
          <input type="text" name="name" placeholder="Type here" className="input input-bordered w-full" />
        </Label>
        <Label labelTopLeft="Upload the story" labelBottomLeft={true && "You could empty this field."}>
          <input type="file" className="file-input file-input-bordered file-input-primary w-full" />
        </Label>
        <Label labelTopLeft="Select Audio for Story Teller">
          <select className="select select-bordered w-full">
            <option value="">Audio 1</option>
            <option value="">Audio 2</option>
            <option value="">Audio 3</option>
          </select>
        </Label>
        <Label labelTopLeft="Select Backsong to hypeup the story">
          <select className="select select-bordered w-full">
            <option value="">Song 1</option>
            <option value="">Song 2</option>
            <option value="">Song 3</option>
          </select>
        </Label>

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
