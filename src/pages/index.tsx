import Link from "next/link";
import { api } from "~/utils/api";

export default function Home() {
  const {data: books,} = api.buku.getBukus.useQuery();
  return (
    <main className="w-full p-4 flex gap-4">
      {books?.map(x => (
        <Link key={x.id} href={`/buku/${ x.id }`}>
          <div className="card shadow-xl w-40 bg-base-100">
            <figure>
              <img src={x.thumb_url} alt="" />
            </figure>
            <div className="card-body p-4">
              <h4 className="card-title text-base">{ x.name }</h4>
            </div>
          </div>
        </Link>
      ))}
    </main>
  );
}
