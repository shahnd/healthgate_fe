import { useCallback, useEffect, useRef, useState } from "react";

export function useRequest(request, params) {
  const controllerRef = useRef(null);
  const [state, setState] = useState({
    data: null,
    error: null,
    loading: true,
  });

  const execute = useCallback(async () => {
    // 이미 이전 컴포넌트에서 작동하고 있다면 중단
    controllerRef.current?.abort();

    // 새로운 AbortController 생성
    const controller = new AbortController();
    controllerRef.current = controller;

    setState((previous) => ({
      ...previous,
      error: null,
      loading: true,
    }));

    try {
      // fetch 시도
      const data = await request({
        ...(params ?? {}),
        signal: controller.signal,
      });

      // 정상 종료 시 데이터 적재
      if (!controller.signal.aborted) {
        setState({ data, error: null, loading: false });
      }
    } catch (error) {
      // 에러가 발생했지만 중단되지 않았다면
      if (!controller.signal.aborted) {
        setState((previous) => ({
          ...previous,
          error, // 에러는 보존해야 함
          loading: false,
        }));
      }
    }
  }, [params, request]);

  // 컴포넌트 로드 시 fetch
  useEffect(() => {
    execute();

    return () => controllerRef.current?.abort(); // 컴포넌트 unmount 시 요청 중단
  }, [execute]);

  return { ...state, reload: execute };
}
