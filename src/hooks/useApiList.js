import { useCallback, useEffect, useState } from "react";
import { api } from "../services/api.js";
export function useApiList(path, enabled = true, scope = "public") {
  const [items, setItems] = useState([]),
    [loading, setLoading] = useState(enabled),
    [loaded, setLoaded] = useState(false),
    [error, setError] = useState("");
  const reload = useCallback(async () => {
    if (!enabled) return [];
    setLoading(true);
    setError("");
    try {
      const data = await api(path);
      setItems(data);
      setLoaded(true);
      return data;
    } catch (e) {
      setError(e.message);
      throw e;
    } finally {
      setLoading(false);
    }
  }, [path, enabled, scope]);
  useEffect(() => {
    let active = true;
    setItems([]);
    setLoaded(false);
    setError("");
    setLoading(enabled);
    if (enabled)
      api(path)
        .then((data) => {
          if (active) {
            setItems(data);
            setLoaded(true);
          }
        })
        .catch((e) => {
          if (active) setError(e.message);
        })
        .finally(() => {
          if (active) setLoading(false);
        });
    return () => {
      active = false;
    };
  }, [path, enabled, scope]);
  return { items, setItems, loading, loaded, error, reload };
}
