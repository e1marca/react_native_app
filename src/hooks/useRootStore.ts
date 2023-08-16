import RootStore from "src/stores/rootStore";

export let rootStore: RootStore;

export const useRootStore = (): RootStore => {
  if (!rootStore) {
    rootStore = new RootStore();
  }

  return rootStore;
};
