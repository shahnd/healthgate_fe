import { useCallback, useEffect, useRef, useState } from "react";

const initialState = {
  data: null,
  error: null,
  loading: false,
};

export function useMutation(request) {
  const controllerRef = useRef(null);
  const [state, setState] = useState(initialState);

  const mutate = useCallback(async (params) => {
    controllerRef.current?.abort();

    const controller = new AbortController();
    controllerRef.current = controller;
    setState((previous) => ({
      ...previous,
      error: null,
      loading: true,
    }));

    try {
      const data = await request({
        ...(params ?? {}),
        signal: controller.signal,
      });

      if (!controller.signal.aborted) {
        setState({ data, error: null, loading: false });
      }
      return data;
    } catch (error) {
      if (!controller.signal.aborted) {
        setState((previous) => ({
          ...previous,
          error,
          loading: false,
        }));
      }
      throw error;
    }
  }, [request]);

  const reset = useCallback(() => {
    controllerRef.current?.abort();
    controllerRef.current = null;
    setState(initialState);
  }, []);

  useEffect(() => () => controllerRef.current?.abort(), []);

  return { ...state, mutate, reset };
}
