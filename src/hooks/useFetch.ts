import { useState, useCallback } from "react";

type Params = readonly unknown[] | [void];
type ApiFunc<T = unknown, P extends Params = Params> = (...params: P) => Promise<T>;

export const useFetch = <T = unknown, P extends Params = Params>(apiFunc: ApiFunc<T, P>) => {
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);

  const invokeApi = useCallback(
    async (...params: P): Promise<T> => {
      setIsLoading(true);
      setIsSuccess(false);
      try {
        const result = await apiFunc(...params);
        setIsLoading(false);
        setIsSuccess(true);
        return result;
      } catch (error) {
        setIsLoading(false);
        setIsSuccess(false);
        throw error;
      }
    },
    [apiFunc]
  );

  return { invokeApi, isLoading, isSuccess };
};
