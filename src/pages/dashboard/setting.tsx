import { Audio } from "@prisma/client";
import { ChangeEvent, useEffect, useMemo, useState } from "react";
import { Label } from "~/components/forms";
import { $main_theme, $use_theme } from "~/hooks/setting";
import { api } from "~/utils/api";

export default function Setting () {
  const [mainTheme, setMainTheme] = useState<Partial<Audio>>({});
  const [isTheme, setIsTheme] = useState<boolean | undefined>(false);

  const { data: themes } = api.audio.getAudios.useQuery("main_theme");

  useEffect(() => {
    if (Object.keys($main_theme.get()).length == 0 && themes?.[0]) 
      $main_theme.set(themes[0]);

    setMainTheme($main_theme.get());
    setIsTheme($use_theme.get());

  }, [$main_theme.get(), $use_theme.get()]);

  function handleSetTheme(ev: ChangeEvent<HTMLSelectElement>) {
    const theme = themes?.find((x) => x.id == parseInt(ev.target.value));
    if (theme) $main_theme.set(theme);
    return;
  }

  function handleTurnOnTheme () {
    $use_theme.set(!isTheme);
  }

  return <>
    <div className="card border border-1 md:w-96">
      <div className="card-body">
        <h2 className="card-title">Setting</h2>
        <Label className="" labelTopLeft="Main Theme">
          <select className="select select-bordered w-full" defaultValue={mainTheme.id}
            onChange={handleSetTheme}
          >
            {themes?.map((theme, i) => (
              <option key={theme.id} value={theme.id}>{ theme.name }</option>
            ))}
          </select>
        </Label>

        <div className="form-control">
          <label className="label cursor-pointer">
            <span className="label-text">Turn on Main Theme</span> 
            <input type="checkbox" className="toggle toggle-info" checked={isTheme} onChange={() => void handleTurnOnTheme()} />
          </label>
        </div>

      </div>
    </div>
  </>;
}

Setting.theme = "dashboard";
