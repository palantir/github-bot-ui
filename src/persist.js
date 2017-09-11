/**
 * Copyright 2016-present Palantir Technologies
 * @license MIT
 */

export function persistState(...properties) {
  const persisters = properties.map(persist);
  return (store, storage) => {
    store.subscribe(() => {
      const state = store.getState();
      persisters.forEach((persister) => persister(storage, state));
    });
  };
}

function persist(property) {
  const { select, key, nullValue } = property;

  let current;
  return (storage, state) => {
    const previous = current;
    current = select(state);

    if (current !== previous) {
      if (current === nullValue) {
        storage.removeItem(key);
      } else {
        storage.setItem(key, current);
      }
    }
  };
}
