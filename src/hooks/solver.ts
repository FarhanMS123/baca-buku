import { useStore } from "@nanostores/react";
import type { Store, StoreValue } from "nanostores";
import { useEffect, useState } from "react";

export function useStoreExtend<T extends Store>(store: T) {
    const storeS = useStore(store);
    const [state, setState] = useState<StoreValue<T> | null>(null);

    useEffect(() => {
        if (typeof window != "undefined") 
            setState(storeS);
    }, [storeS]);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-return
    return state;
}

export function useClientSide() {
    const [ isClient, setIsClient ] = useState(false);

    useEffect(() => {
        if (typeof window != "undefined")
            setIsClient(true);
    });

    return [ isClient, setIsClient ];
}
