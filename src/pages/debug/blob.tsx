import { useState } from "react";
import { Label } from "~/components/forms";
import { api } from "~/utils/api";

export default function Blob() {
  const { data, refetch } = api.debug.listVercelBlob.useQuery();

  const [curr, setCurr] = useState<{ url: string } | null>(null);
  const { data: head } = api.debug.getVercelBlob.useQuery(curr?.url ?? "", { enabled: curr != null });
  const { mutateAsync } = api.debug.delVercelBlob.useMutation();

  console.log({ data, curr });

  async function handleDelete() {
    if (curr) await mutateAsync(curr.url);
    setCurr(null);
    refetch();
  }

  return <div className="gap-4 items-start mt-4 md:flex">
    <div className="card border border-1 md:w-96">
      <div className="card-body">
        {data?.blobs.map((x) => (
          <button key={x.uploadedAt.toString()} className="btn h-auto py-4" onClick={() => setCurr(x)}>
            { x.pathname }
          </button>
        ))}
      </div>
    </div>

    {curr && <div className="card border border-1 mt-4 md:mt-0 md:w-96">
      <div className="card-body">
        <Label labelTopLeft="Meta">
          <textarea className="textarea textarea-bordered overflow-auto whitespace-nowrap" value={ JSON.stringify(curr, null, 2) }></textarea>
        </Label>
        <Label labelTopLeft="Head">
          <textarea className="textarea textarea-bordered overflow-auto whitespace-nowrap" value={ JSON.stringify(head, null, 2) }></textarea>
        </Label>

        <div className="card-actions justify-end mt-4">
          <button className="btn btn-error" onClick={() => void handleDelete()}>Delete</button>
        </div>

      </div>
    </div>}

  </div>;
}

Blob.theme = "dashboard";
