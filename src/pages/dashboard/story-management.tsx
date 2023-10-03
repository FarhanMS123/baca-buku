export default function AudioManagement () {
  return <>
  <div className="flex gap-4">
    <AudioList />
    <AudioViewer />
  </div>
  </>;
}

AudioManagement.theme = "dashboard"

function AudioList () {
  return(
    <div className="overflow-x-auto max-h-96 table-pin-rows table-pin-cols">
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
              <tr key={i} className="hover">
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

      </table>
    </div>
  );
}

function AudioViewer () {
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
            <option selected>Main Theme</option>
            <option>Backsong</option>
            <option>Audio</option>
          </select>
        </div>
        <div className="form-control w-full">
          <label className="label">
            <span className="label-text">Upload the Audio</span>
          </label>
          <input type="file" className="file-input file-input-bordered file-input-primary w-full" />
        </div>
        <div className="card-actions justify-end">
          <button className="btn btn-outline btn-error">Delete</button>
          <button className="btn btn-primary">Update</button>
          <button className="btn btn-primary">Add</button>
        </div>
      </div>
    </div>
  );
}
