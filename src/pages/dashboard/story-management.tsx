import Link from "next/link";

export default function StoryManagement () {
  return <>
    <StoryList />
    <div className="flex gap-4 items-start mt-4">
      <StoryViewer />
      <AudioStamping />
    </div>
  </>;
}

StoryManagement.theme = "dashboard"

function StoryList () {
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
              <tr key={i} className="hover">
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
              <button className="btn btn-primary ml-auto">Add Story</button>
            </td>
          </tr>
        </tfoot>

      </table>
    </div>
  );
}

function StoryViewer () {
  return (
    <div className="card w-96 border border-spacing-1">
      <div className="card-body">
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Give an inspirated name for the story</span>
          </label>
          <input type="text" name="name" placeholder="Type here" className="input input-bordered w-full" />
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Give some description</span>
          </label>
          <input type="text" name="name" placeholder="Type here" className="input input-bordered w-full" />
        </div>

        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Select Audio for Story Teller</span>
          </label>
          <select className="select select-bordered w-full">
            <option value="main_theme" selected>Main Theme</option>
            <option value="backsong">Backsong</option>
            <option value="audio">Audio</option>
          </select>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Select Backsong to hypeup the story</span>
          </label>
          <select className="select select-bordered w-full">
            <option value="main_theme" selected>Main Theme</option>
            <option value="backsong">Backsong</option>
            <option value="audio">Audio</option>
          </select>
        </div>

        <div className="card-actions justify-end mt-4">
          <button className="btn btn-outline btn-error">Delete</button>
          <button className="btn btn-primary">Update</button>
          <button className="btn btn-primary">Add</button>
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
