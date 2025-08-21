import React, { createElement, FC } from "https://esm.sh/react@19.1.1";
const h = createElement;

type Route<T extends Record<string, string>> = {
  pathMatcher: (path: string) => boolean;
  params?: (path: string) => T;
  Component: FC<T>;
};

export const Router: FC<{
  path: string;
  routes: Route<any>[];
}> = ({ path, routes }) => {
  const route = routes.find(({ pathMatcher }) => pathMatcher(path));
  if (route) {
    const params = route.params?.(path) ?? {};
    return <route.Component {...params} />;
  }

  return (
    <div>
      <p>{path}</p>
      <p>404 not found.</p>
    </div>
  );
};
